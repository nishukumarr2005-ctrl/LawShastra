import { Outlet, ScrollRestoration } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF8] text-[#25232B] font-sans antialiased selection:bg-[#FFD84D]/50 selection:text-[#25232B]">
      <ScrollRestoration />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
