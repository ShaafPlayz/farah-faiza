import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zarab Collections - Feminine Ready-to-wear Clothing',
  description: 'ZARAB Collections is a premium ready-to-wear women\'s clothing brand offering elegant, contemporary designs for the modern woman.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="font-secondary text-primary bg-white">
        {children}
      </body>
    </html>
  )
}