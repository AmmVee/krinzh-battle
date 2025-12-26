// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// cn — это наш главный кринж-комбайн (clsx + tailwind-merge)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Задержка (для анимаций и имитации сети)
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Случайное число в диапазоне
export const random = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min

// Перемешивание массива (Фишер-Йейтс — как у настоящих пацанов)
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Форматирование кринжа (для красоты)
export const formatCring = (value: number): string => {
  if (value >= 100) return '💀 ДЕД ИНСАЙД'
  if (value >= 90) return '😭 ПИЗДЕЦ'
  if (value >= 75) return '🤡 КЛОУН'
  if (value >= 50) return '😰 НЕРВНО'
  if (value >= 25) return '😅 НУ ТАКОЕ'
  return '😎 БАЗА'
}

// Форматирование менталки
export const formatMental = (value: number): string => {
  if (value <= 20) return '💀 ПИЗДА'
  if (value <= 50) return '😵‍💫 ШАТАЕТСЯ'
  if (value <= 80) return '🫡 ДЕРЖИТСЯ'
  return '🗿 СИГМА'
}

// Генерация уникального ID для карт (чтобы React не ебался)
export const generateCardId = (cardId: number, index: number) => 
  `${cardId}-${index}-${Date.now()}`

// Кринж-рандом для карт типа "Блейза"
export const coinFlip = () => Math.random() < 0.5

// Проверка на победу
export const checkWin = (cring: number, maxCring: number = 100) => cring >= maxCring

// Звуки (если захочешь потом через этот файл играть)
export const playSound = (type: 'cring' | 'mental' | 'victory' | 'puk') => {
  const sounds = {
    cring: '/sounds/cring.mp3',
    mental: '/sounds/mental.mp3',
    victory: '/sounds/victory.mp3',
    puk: '/sounds/puk-syr.mp3',
  }
  const audio = new Audio(sounds[type])
  audio.volume = 0.7
  audio.play().catch(() => {})
}