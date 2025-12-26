// src/app/game/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ConfettiExplosion from 'react-confetti-explosion'

export default function GamePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const {
    gameId,
    me,
    opponent,
    turn,
    winner,
    drawCard,
    playCard,
    endTurn,
    initGame,
    cringeStoriesPlayed,
  } = useGameStore()

  const [isExploding, setIsExploding] = useState(false)

  // Инициализация игры при загрузке
  useEffect(() => {
    const loadGame = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: game } = await supabase
        .from('active_games')
        .select('*')
        .eq('id', params.id)
        .single()

      if (!game) {
        router.push('/lobby')
        return
      }

      const oppId = game.player1 === user.id ? game.player2 : game.player1
      const oppUsername = oppId === game.player1 ? 'Хозяин' : 'Гость'

      initGame(params.id, user.id, oppId!, oppUsername || 'Кринж-аноним')
    }

    loadGame()
  }, [params.id, router, initGame])

  // Добор карты в начале хода
  useEffect(() => {
    if (turn === 'me' && me.hand.length < 5) {
      drawCard()
    }
  }, [turn, drawCard, me.hand.length])

  // Победа!
  useEffect(() => {
    if (winner && winner === me.userId) {
      setIsExploding(true)
      setTimeout(() => {
        router.push('/lobby')
      }, 8000)
    } else if (winner) {
      setTimeout(() => {
        router.push('/lobby')
      }, 5000)
    }
  }, [winner, me.userId, router])

  if (!gameId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-6xl animate-pulse text-krinzh-500">КРИНЖ ЗАГРУЖАЕТСЯ...</div>
      </div>
    )
  }

  if (winner) {
    const iWon = winner === me.userId
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-red-900 text-white">
        {isExploding && <ConfettiExplosion particleCount={300} duration={5000} />}
        <h1 className="text-9xl font-black mb-8 animate-bounce">
          {iWon ? 'ТЫ ПОБЕДИЛ!' : 'ТЫ ПРОИГРАЛ...'}
        </h1>
        <p className="text-6xl font-bold text-krinzh-500">
          {iWon ? 'КРИНЖ ПОКОРЁН' : 'ДЕД ИНСАЙД'}
        </p>
        <p className="text-3xl mt-8">Возвращение в лобби через {iWon ? '8' : '5'} сек...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ded via-black to-ded text-white p-4">
      {/* Поле оппонента */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-4xl font-bold text-red-500">{opponent.username || 'Оппонент'}</h2>
          <div className="text-3xl">
            ❤️ {opponent.mental} | Кринж: {opponent.cring}/100
            <div className="w-full bg-gray-800 rounded-full h-8 mt-2">
              <div
                className="bg-red-600 h-8 rounded-full transition-all duration-500"
                style={{ width: `${opponent.cring}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 flex-wrap my-8">
          {opponent.field.map((card, i) => (
            <div
              key={i}
              className="bg-red-900 border-4 border-red-700 rounded-xl p-6 text-center min-w-32 animate-pulse"
            >
              <p className="text-xl font-bold">{card.name}</p>
            </div>
          ))}
        </div>

        {/* Центр */}
        <div className="text-center my-12">
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-krinzh-500 to-yellow-500 animate-pulse">
            {turn === 'me' ? 'ТВОЙ ХОД, ЛЕГЕНДА' : 'ЖДИ... ОППОНЕНТ КРИНЖИТ'}
          </h1>
          <p className="text-3xl mt-4">Кринжовых историй сыграно: {cringeStoriesPlayed}</p>
        </div>

        {/* Твоё поле */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-green-500">{me.username}</h2>
          <div className="text-3xl">
            ❤️ {me.mental} | Кринж: {me.cring}/100
            <div className="w-full bg-gray-800 rounded-full h-8 mt-2">
              <div
                className="bg-gradient-to-r from-green-500 to-yellow-500 h-8 rounded-full transition-all duration-500"
                style={{ width: `${me.cring}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 flex-wrap my-12">
          {me.field.map((card, i) => (
            <div
              key={i}
              className="bg-green-900 border-4 border-green-600 rounded-xl p-6 text-center min-w-40 shadow-2xl animate-bounce-slow"
            >
              <p className="text-2xl font-bold text-yellow-400">{card.name}</p>
            </div>
          ))}
        </div>

        {/* Твоя рука */}
        <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-90 p-6 border-t-4 border-krinzh-500">
          <div className="flex justify-center gap-6 flex-wrap max-w-7xl mx-auto">
            {me.hand.map((card) => (
              <button
                key={card.instanceId || card.id}
                onClick={() => playCard(card)}
                disabled={turn !== 'me'}
                className="bg-gradient-to-br from-krinzh-600 to-purple-700 p-6 rounded-2xl border-4 border-krinzh-400 shadow-2xl hover:scale-110 hover:rotate-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p className="text-xl font-black text-yellow-300">{card.name}</p>
                {card.isStory && <p className="text-xs text-red-400">КРИНЖ-ИСТОРИЯ</p>}
              </button>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={endTurn}
              disabled={turn !== 'me'}
              className="px-24 py-8 bg-gradient-to-r from-red-600 to-orange-600 text-5xl font-black rounded-full hover:scale-110 transition-all disabled:opacity-50 shadow-2xl"
            >
              ЗАВЕРШИТЬ ХОД
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}