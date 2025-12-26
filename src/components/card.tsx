// src/components/Card.tsx
'use client'

import { Card as CardType } from '@/store/gameStore'
import { motion } from 'framer-motion'

interface CardProps {
  card: CardType
  onPlay?: () => void
  disabled?: boolean
  isInHand?: boolean
  isOpponentCard?: boolean
}

export default function Card({ card, onPlay, disabled = false, isInHand = false, isOpponentCard = false }: CardProps) {
  const isStory = card.isStory || card.type === 'cringe_story'

  return (
    <motion.button
      whileHover={{ scale: isInHand ? 1.15 : 1.05, rotate: isInHand ? 5 : 0 }}
      whileTap={{ scale: 0.95 }}
      onClick={onPlay}
      disabled={disabled || isOpponentCard}
      className={`
        relative overflow-hidden rounded-3xl border-4 shadow-2xl transition-all duration-300
        ${isInHand 
          ? 'w-48 h-72 cursor-pointer border-yellow-500 hover:border-yellow-300' 
          : 'w-40 h-60 cursor-default border-zinc-700'
        }
        ${disabled || isOpponentCard ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-krinzh-500/50'}
        ${isStory ? 'bg-gradient-to-br from-red-900 via-purple-900 to-black border-red-600' : 
          card.type === 'active' ? 'bg-gradient-to-br from-emerald-900 via-teal-900 to-black border-emerald-500' :
          card.type === 'instant' ? 'bg-gradient-to-br from-orange-900 via-red-900 to-black border-orange-500' :
          'bg-gradient-to-br from-zinc-900 via-purple-900 to-black border-purple-600'
        }
      `}
    >
      {/* Фоновая анимация для активных карт */}
      {card.type === 'active' && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent animate-pulse" />
      )}

      {/* Кринж-иконка для историй */}
      {isStory && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full animate-pulse">
          КРИНЖ
        </div>
      )}

      <div className="relative z-10 h-full p-6 flex flex-col justify-between text-center">
        <div>
          <h3 className="text-xl font-black text-yellow-400 drop-shadow-lg leading-tight">
            {card.name}
          </h3>
        </div>

        <div className="space-y-2">
          {card.cring !== undefined && (
            <div className="bg-red-900/80 border-2 border-red-500 rounded-xl px-4 py-2">
              <p className="text-3xl font-black text-red-400">{card.cring}</p>
              <p className="text-xs text-red-300">КРИНЖА</p>
            </div>
          )}
          
          {card.mental !== undefined && (
            <div className="bg-emerald-900/80 border-2 border-emerald-500 rounded-xl px-4 py-2">
              <p className="text-3xl font-black text-emerald-400">+{card.mental}</p>
              <p className="text-xs text-emerald-300">МЕНТАЛКИ</p>
            </div>
          )}
        </div>

        {/* Тип карты внизу */}
        <div className="mt-4">
          <span className={`
            text-xs font-bold px-3 py-1 rounded-full
            ${card.type === 'active' ? 'bg-emerald-600 text-white' :
              card.type === 'instant' ? 'bg-orange-600 text-white' :
              isStory ? 'bg-red-700 text-white' :
              'bg-zinc-700 text-zinc-300'
            }
          `}>
            {card.type === 'active' ? 'АКТИВНАЯ' :
             card.type === 'instant' ? 'МГНОВЕННАЯ' :
             isStory ? 'ИСТОРИЯ' : 'ОБЫЧНАЯ'}
          </span>
        </div>
      </div>

      {/* Блеск */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full animate-shine" />
    </motion.button>
  )
}