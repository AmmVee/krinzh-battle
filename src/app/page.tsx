// src/app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-red-900 flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 mb-8 animate-pulse">
          КРИНЖ ДО СМЕРТИ
        </h1>
        
        <p className="text-5xl font-bold text-krinzh-300 mb-16">
          Самая кринжовая карточная игра рунета 2025
        </p>

        <div className="space-y-8">
          <Link href="/login">
            <button className="px-24 py-16 bg-gradient-to-r from-krinzh-600 to-purple-700 text-7xl font-black rounded-full border-8 border-yellow-500 shadow-2xl hover:scale-110 hover:rotate-6 transition-all">
              ИГРАТЬ
            </button>
          </Link>

          <div className="text-6xl mt-20">
            💀🤡😭 пук-сыр 😭🤡💀
          </div>

          <p className="text-3xl text-zinc-400 mt-20">
            Слава роду. Дед инсайд уже в колоде.
          </p>
        </div>
      </div>
    </div>
  )
}