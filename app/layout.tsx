import { Geist, Geist_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

import { QueryProvider } from '@/components/providers/query-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { TRPCReactProvider } from '@/trpc/client'

import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('font-sans antialiased', fontMono.variable, geist.variable)}
    >
      <body>
        <ThemeProvider>
          <Toaster />
          <QueryProvider>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
