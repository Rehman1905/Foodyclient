'use client'
import Link from "next/link"
import './global.css'
import style from './layout.module.css'
import Footer from './footer/footer'
import UserContext from './context/userContext'
export const metadata = {
  title: 'Foody',
}
import Navbar from './navbar/navbar.js'
import { usePathname } from "next/navigation"


export default function RootLayout({ children }) {
  const path = usePathname()
  return (
    <html lang="en">
      <body>
        <UserContext>
          <Navbar />
          <main>{children}</main>
          <footer style={{ display: path === '/login' ? 'none' : 'block' }} className={style.footer}>
            <Footer />
          </footer>
        </UserContext>
      </body>
    </html>
  )
}
