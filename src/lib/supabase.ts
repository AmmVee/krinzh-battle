// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Отсутствуют переменные окружения Supabase! Проверь .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Для дебага (можно удалить потом)
console.log('Supabase подключён к:', supabaseUrl)