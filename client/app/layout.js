import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import LayoutWrapper from './LayoutWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RestorePro Services | 24/7 Emergency Restoration',
  description: '24/7 emergency restoration services for water damage, fire damage, mold remediation, and more.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.className} bg-slate-50 text-slate-900`} suppressHydrationWarning>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}

