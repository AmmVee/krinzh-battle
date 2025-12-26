// src/components/HealthBar.tsx
'use client'

import { motion } from 'framer-motion'

interface HealthBarProps {
  value: number          // текущее значение (кринж или менталка)
  maxValue: number       // максимум
  type: 'cring' | 'mental' // тип полоски
  label?: string         // имя игрока
  className?: string
}

export default function HealthBar({ 
  value, 
  maxValue = 100, 
  type, 
  label,
  className = ''
}: HealthBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100))

  const isCring = type === 'cring'
  const isLow = isCring ? percentage >= 80 : percentage <= 30
  const isCritical = isCring ? percentage >= 95 : percentage <= 10

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {/* Заголовок */}
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-2xl font-black text-yellow-400 drop-shadow-lg">
            {label}
          </span>
          <span className={`text-3xl font-black ${isCring ? 'text-red-500' : 'text-emerald-400'}`}>
            {value} / {maxValue}
          </span>
        </div>
      )}

      {/* Основная полоска */}
      <div className="relative h-16 bg-black rounded-3xl border-4 border-zinc-800 overflow-hidden shadow-2xl">
        {/* Фоновая пульсация при критическом значении */}
        {isCritical && (
          <div className="absolute inset-0 bg-red-600 opacity-50 animate-ping" />
        )}

        {/* Заполнение */}
        <motion.div
          className={`
            absolute inset-y-0 left-0 rounded-3xl
            ${isCring 
              ? 'bg-gradient-to-r from-red-900 via-red-600 to-orange-600' 
              : 'bg-gradient-to-r from-emerald-900 via-emerald-500 to-cyan-500'
            }
            ${isLow ? 'animate-pulse' : ''}
          `}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Блеск */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%] animate-shine" />
        </motion.div>

        {/* Текст внутри полоски */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-black text-white drop-shadow-2xl">
            {isCring ? 'КРИНЖ' : 'МЕНТАЛКА'}
          </span>
        </div>

        {/* Критическая рамка */}
        {isCritical && (
          <div className="absolute inset-0 border-8 border-red-600 rounded-3xl animate-pulse" />
        )}
      </div>

      {/* Эмодзи-состояние */}
      <div className="text-center">
        {isCring ? (
          percentage >= 100 ? '💀☠️' :
          percentage >= 90 ? '😭😭😭' :
          percentage >= 70 ? '🤡🤡' :
          percentage >= 50 ? '😰' :
          percentage >= 30 ? '😅' :
          '😎'
        ) : (
          percentage <= 10 ? '💀' :
          percentage <= 30 ? '😵‍💫' :
          percentage <= 50 ? '😰' :
          percentage <= 70 ? '🫡' :
          '🗿'
        )}
      </div>
    </div>
  )
}