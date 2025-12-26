// src/app/404/page.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-600 mb-8 animate-pulse">
        404
      </h1>
      <h2 className="text-6xl font-bold text-krinzh-500 mb-8">
        ДЕД ИНСАЙД НАШЁЛ ТЕБЯ
      </h2>
      <p className="text-3xl text-zinc-400 mb-12">
        Эта страница обосралась и убежала в туалет
      </p>
      <Link href="/lobby">
        <button className="px-16 py-8 bg-gradient-to-r from-krinzh-600 to-purple-600 text-4xl font-black rounded-full hover:scale-110 transition-all border-4 border-yellow-500">
          ВЕРНУТЬСЯ В КРИНЖ
        </button>
      </Link>
      <div className="mt-16 text-6xl">
        💀☠️🤡😭
      </div>
    </div>
  )
}