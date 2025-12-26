'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    if (!username || !password) return

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: `${username}@krinzh.fake`,
      password,
    })

    if (error?.message.includes('Invalid login credentials')) {
      await supabase.auth.signUp({
        email: `${username}@krinzh.fake`,
        password,
        options: { data: { username } }
      })
    }

    router.push('/lobby')
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-red-600 mb-10">КРИНЖ ДО СМЕРТИ</h1>
        <input
          placeholder="НИК"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block mx-auto mb-6 px-10 py-6 text-4xl bg-zinc-900 text-white rounded-xl"
        />
        <input
          type="password"
          placeholder="ПАРОЛЬ"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          className="block mx-auto mb-10 px-10 py-6 text-4xl bg-zinc-900 text-white rounded-xl"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="px-20 py-10 bg-red-600 text-6xl font-bold rounded-full hover:bg-red-700"
        >
          {loading ? 'КРИНЖИМ...' : 'ВОЙТИ'}
        </button>
      </div>
    </div>
  )
}