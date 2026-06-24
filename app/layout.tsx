import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Scripa — Voice documentation for tradespeople',
  description: 'Speak your job notes. Get a structured report in seconds.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
