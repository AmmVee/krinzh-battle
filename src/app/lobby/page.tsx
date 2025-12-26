// src/app/lobby/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'

export default function Lobby() {
  const router = useRouter()
  const initGame = useGameStore(s => s.initGame)
  const [waiting, setWaiting] = useState(false)

  const findGame = async () => {
    setWaiting(true)
    const { data: user } = await supabase.auth.getUser()

    // Ищем свободную игру
    const { data: openGame } = await supabase
      .from('active_games')
      .select('*')
      .eq('status', 'waiting')
      .single()

    if (openGame) {
      // Присоединяемся
      await supabase
        .from('active_games')
        .update({ player2: user.user.id, status: 'playing' })
        .eq('id', openGame.id)

      initGame(openGame.id, user.user.id, openGame.player1, 'Хозяин')
      router.push(`/game/${openGame.id}`)
    } else {
      // Создаём новую
      const { data: newGame } = await supabase
        .from('active_games')
        .insert({ player1: user.user.id, status: 'waiting' })
        .select()
        .single()

      // Ждём оппонента в реальном времени
      supabase.channel(`game:${newGame.id}`)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'active_games', filter: `id=eq.${newGame.id}` }, (payload) => {
          if (payload.new.status === 'playing') {
            initGame(newGame.id, user.user.id, payload.new.player2, 'Гость')
            router.push(`/game/${newGame.id}`)
          }
        })
        .subscribe()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 to-black">
      <button
        onClick={findGame}
        disabled={waiting}
        className="px-20 py-16 text-6xl font-bold bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl hover:scale-110 transition disabled:opacity-50"
      >
        {waiting ? 'ИЩЕМ КРИНЖ... ⏳' : 'НАЙТИ ОППОНЕНТА'}
      </button>
    </div>
  )
}