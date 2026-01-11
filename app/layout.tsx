import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Golden Air',
  description: 'Golden Air — Luxury travel experiences',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="antialiased font-jakarta bg-white text-black dark:bg-background-dark dark:text-white">
        {children}
      </body>
    </html>
  )
}
