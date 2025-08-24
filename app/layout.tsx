import './globals.css'
import type { Metadata } from 'next'
import { Baloo_Tammudu_2 } from 'next/font/google'

const balooTammudu2 = Baloo_Tammudu_2({
  subsets: ['latin'],
  variable: '--font-baloo-tammudu-2',
})

export const metadata: Metadata = {
  title: 'Zarab Collections - Modern Pakistani Clothing',
  description: 'Zarab Collections offers inspiring feminine luxury with elegant, contemporary designs for the modern woman. Discover our collection of classic feminine clothing.',
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
      <body className={`font-secondary text-gray-900 bg-white ${balooTammudu2.variable}`}>
        {children}
      </body>
    </html>
  )
}