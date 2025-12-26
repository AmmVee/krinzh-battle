// src/app/login/page.tsx
'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${username}@krinzh.fake`, // фейковый email
      password,
    })

    if (error && error.message.includes('Invalid login')) {
      // Если нет — регистрируем
      await supabase.auth.signUp({
        email: `${username}@krinzh.fake`,
        password,
        options: { data: { username } }
      })
      await supabase.from('profiles').upsert({ 
        id: (await supabase.auth.getUser()).data.user?.id,
        username 
      })
    }

    router.push('/lobby')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 to-black">
      <div className="bg-zinc-900 p-10 rounded-2xl border-4 border-purple-600">
        <h1 className="text-4xl font-bold mb-8 text-center">КРИНЖ ДО СМЕРТИ</h1>
        <input
          placeholder="Никнейм"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-4 mb-4 bg-black rounded-lg text-white"
        />
        <input
          type="password"
          placeholder="Пароль (любой)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          className="w-full p-4 mb-6 bg-black rounded-lg text-white"
        />
        <button
          onClick={login}
          className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-2xl font-bold rounded-lg hover:scale-105 transition"
        >
          ВОЙТИ В КРИНЖ
        </button>
      </div>
    </div>
  )
}