// src/app/lobby/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useGameStore } from '@/store/gameStore'

export default function Lobby() {
  const router = useRouter()
  const initGame = useGameStore((s) => s.initGame)
  const [searching, setSearching] = useState(false)
  const [queueCount, setQueueCount] = useState(0)

  // Проверяем, не в игре ли мы уже
  useEffect(() => {
    const checkExistingGame = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: activeGame } = await supabase
        .from('active_games')
        .select('id')
        .in('status', ['waiting', 'playing'])
        .or(`player1.eq.${user.id},player2.eq.${user.id}`)
        .single()

      if (activeGame) {
        router.push(`/game/${activeGame.id}`)
      }
    }

    checkExistingGame()
  }, [router])

  // Считаем людей в очереди (для красоты)
  useEffect(() => {
    const channel = supabase.channel('lobby-count')
    channel
      .on('broadcast', { event: 'count' }, ({ payload }) => {
        setQueueCount(payload.count)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const findGame = async () => {
    setSearching(true)

    const { data: { user } } = await supabase.auth.getUser()

    // Ищем игру в статусе waiting
    const { data: waitingGame } = await supabase
      .from('active_games')
      .select('*')
      .eq('status', 'waiting')
      .neq('player1', user?.id)
      .single()

    if (waitingGame) {
      // Присоединяемся
      await supabase
        .from('active_games')
        .update({ player2: user?.id, status: 'playing' })
        .eq('id', waitingGame.id)

      initGame(waitingGame.id, user!.id, waitingGame.player1, 'Противник')
      router.push(`/game/${waitingGame.id}`)
    } else {
      // Создаём свою игру
      const { data: newGame } = await supabase
        .from('active_games')
        .insert({ player1: user?.id, status: 'waiting' })
        .select()
        .single()

      // Слушаем подключение второго игрока
      const channel = supabase.channel(`game-waiting-${newGame.id}`)
      channel
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'active_games',
          filter: `id=eq.${newGame.id}`
        }, (payload) => {
          if (payload.new.status === 'playing' && payload.new.player2) {
            initGame(newGame.id, user!.id, payload.new.player2, 'Противник')
            router.push(`/game/${newGame.id}`)
          }
        })
        .subscribe()

      // Показываем анимацию ожидания
      const interval = setInterval(() => {
        setQueueCount(prev => prev + Math.floor(Math.random() * 3) - 1)
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-red-900 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        {/* Заголовок */}
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-8 animate-pulse">
          КРИНЖ ДО СМЕРТИ
        </h1>

        <p className="text-4xl font-bold text-krinzh-300 mb-12">
          {searching ? 'ИЩЕМ ДОСТОЙНОГО КРИНЖА...' : 'ГОТОВ ВСТУПИТЬ В БОЙ?'}
        </p>

        {/* Кнопка поиска */}
        {!searching ? (
          <button
            onClick={findGame}
            className="px-32 py-20 text-8xl font-black bg-gradient-to-r from-red-600 to-orange-700 rounded-full shadow-2xl hover:scale-110 hover:rotate-3 transition-all duration-300 border-8 border-yellow-500"
          >
            НАЙТИ ОППОНЕНТА
          </button>
        ) : (
          <div className="space-y-8">
            <div className="text-6xl font-bold animate-bounce">
              ⏳ ПОДКЛЮЧЕНИЕ...
            </div>
            <div className="text-3xl text-krinzh-400">
              В очереди: {Math.max(1, queueCount)} кринж-воинов
            </div>
            <div className="flex justify-center gap-8 mt-12">
              <div className="text-6xl animate-ping">😭</div>
              <div className="text-6xl animate-ping delay-150">💀</div>
              <div className="text-6xl animate-ping delay-300">🤡</div>
            </div>
          </div>
        )}

        {/* Нижняя плашка */}
        <div className="mt-20 text-2xl font-bold text-zinc-400">
          {searching ? 'Дед инсайд уже рядом...' : 'Слава роду. Готовь менталку.'}
        </div>
      </div>
    </div>
  )
}