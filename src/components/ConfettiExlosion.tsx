// src/components/ConfettiExplosion.tsx
'use client'

import Confetti from 'react-confetti-explosion'

interface ConfettiExplosionProps {
  trigger: boolean
  particleCount?: number
  duration?: number
}

export default function ConfettiExplosion({ 
  trigger, 
  particleCount = 500, 
  duration = 6000 
}: ConfettiExplosionProps) {
  if (!trigger) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <Confetti
        force={0.8}
        duration={duration}
        particleCount={particleCount}
        width={window.innerWidth}
        colors={[
          '#ec4899', // кринж-розовый
          '#a855f7', // фиолетовый
          '#f59e0b', // жЄлтый
          '#ef4444', // красный
          '#10b981', // зелЄный менталка
          '#f97316', // оранжевый
          '#8b5cf6', // ещЄ фиолетовый
        ]}
        particleSize={14}
        recycle={false}
        onComplete={() => {}}
      />
      
      {/* ƒќѕќЋЌ»“≈Ћ№Ќџ≈ ¬«–џ¬џ ѕќ ”√Ћјћ */}
      <div className="absolute top-10 left-10">
        <Confetti force={0.6} duration={4000} particleCount={150} width={400} />
      </div>
      <div className="absolute top-10 right-10">
        <Confetti force={0.6} duration={4000} particleCount={150} width={400} />
      </div>
      <div className="absolute bottom-10 left-20">
        <Confetti force={0.7} duration={5000} particleCount={200} width={500} />
      </div>
      <div className="absolute bottom-10 right-20">
        <Confetti force={0.7} duration={5000} particleCount={200} width={500} />
      </div>
    </div>
  )
}