// src/components/SoundPlayer.tsx
'use client'

import { useEffect, useRef } from 'react'

type SoundType = 
  | 'cring' 
  | 'mental' 
  | 'victory' 
  | 'defeat' 
  | 'ded-inside' 
  | 'puk-syr' 
  | 'turn-end'
  | 'card-play'

interface SoundPlayerProps {
  play: SoundType | null
  volume?: number
}

export default function SoundPlayer({ play, volume = 0.6 }: SoundPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const sounds: Record<SoundType, string> = {
    'cring': '/sounds/cring.mp3',
    'mental': '/sounds/mental.mp3',
    'victory': '/sounds/victory.mp3',
    'defeat': '/sounds/defeat.mp3',
    'ded-inside': '/sounds/ded-inside.mp3',
    'puk-syr': '/sounds/puk-syr.mp3',
    'turn-end': '/sounds/turn-end.mp3',
    'card-play': '/sounds/card-play.mp3',
  }

  useEffect(() => {
    if (!play) return

    // Создаём новый аудио-элемент каждый раз (чтобы можно было играть один и тот же звук подряд)
    const audio = new Audio(sounds[play])
    audio.volume = volume
    audio.play().catch(() => {}) // игнорируем ошибки (если пользователь не взаимодействовал)

    return () => {
      audio.pause()
    }
  }, [play, volume])

  return null // этот компонент ничего не рендерит
}