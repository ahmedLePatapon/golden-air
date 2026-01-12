import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/providers/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Golden Air | Séjours de Luxe & Expériences Exclusives',
    template: '%s | Golden Air',
  },
  description:
    "Découvrez des séjours de luxe sur mesure avec Golden Air. Villas d'exception, services conciergerie, bien-être et sport haut de gamme.",
  keywords: [
    'séjours de luxe',
    'voyage haut de gamme',
    'villa privée',
    'conciergerie',
    'bien-être',
    'sport',
    'expériences exclusives',
  ],
  authors: [{ name: 'Golden Air' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Golden Air',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,0..1" rel="stylesheet" />
      </head>
      <body className="font-jakarta antialiased bg-background-light dark:bg-background-dark text-gray-900 dark:text-white min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
