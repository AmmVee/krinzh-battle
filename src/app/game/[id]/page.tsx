// src/app/game/[id]/page.tsx
'use client'
import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useRouter } from 'next/navigation'

export default function Game({ params }: { params: { id: string } }) {
  const { gameId, me, opponent, turn, winner, drawCard, playCard, endTurn } = useGameStore()
  const router = useRouter()

  useEffect(() => {
    if (winner) {
      setTimeout(() => router.push('/lobby'), 5000)
    }
  }, [winner])

  useEffect(() => {
    drawCard() // добор в начале хода
  }, [turn])

  if (winner) {
    return (
      <div className="flex min-h-screen items-center justify-center text-9xl font-bold bg-black">
        {winner === me.userId ? 'ТЫ ПОБЕДИЛ!' : 'ТЫ ПРОИГРАЛ...'}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="text-4xl mb-8 text-center">
        {opponent.username}: ❤️ {opponent.mental} | Кринж: {opponent.cring}/100
      </div>

      <div className="text-6xl text-center my-16 font-bold">
        {turn === 'me' ? 'ТВОЙ ХОД' : 'ЖДИ...'}
      </div>

      <div className="text-4xl mb-8">
        {me.username}: ❤️ {me.mental} | Кринж: {me.cring}/100
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {me.hand.map(card => (
          <button
            key={card.instanceId || card.id}
            onClick={() => playCard(card)}
            className="bg-gradient-to-br from-yellow-500 to-orange-600 p-6 rounded-xl text-xl font-bold hover:scale-110 transition"
          >
            {card.name}
          </button>
        ))}
      </div>

      <button
        onClick={endTurn}
        className="mt-12 px-20 py-8 bg-red-600 text-4xl rounded-full hover:bg-red-700"
      >
        ЗАВЕРШИТЬ ХОД
      </button>
    </div>
  )
}