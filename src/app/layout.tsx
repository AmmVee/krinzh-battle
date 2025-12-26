// src/app/layout.tsx
import { supabase } from '@/lib/supabase'
import './globals.css'

export const metadata = {
  title: 'Кринж до Смерти',
  description: 'Самая кринжовая карточная игра рунета',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className="bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}