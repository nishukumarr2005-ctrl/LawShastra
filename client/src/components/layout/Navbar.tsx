import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Sparkles, Search, Menu, X, BookOpen, Compass, Award, ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Track scroll position to add clean border elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])



  const navLinks = [
    { label: 'Home', href: '/home', icon: BookOpen },
    { label: 'Bare Acts', href: '/categories', icon: Compass },
    { label: 'Case Laws', href: '/#instructors', icon: Award },
    { label: 'Question Bank', href: '/#why-us' },
    { label: 'About Us', href: '/#why-us' },
    { label: 'Contact', href: '/#why-us' },

  ]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        isScrolled
          ? 'bg-[#FFFDF8]/95 backdrop-blur-md border-b border-[#EFEBE1] py-3.5 shadow-xs'
          : 'bg-[#FFFDF8] border-b border-[#F5F2EA] py-5'
      )}
    >
      <Container size="full" className="max-w-none">
        <div className="flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-[#FFD84D] flex items-center justify-center text-[#25232B] shadow-xs group-hover:rotate-6 transition-transform">
              <Sparkles className="w-5 h-5 fill-[#25232B]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#25232B]">
                <span className="text-[#25232B]">Lex</span><span className="text-[#FF8A45]">Quora</span>
              </span>
              <span className="text-[10px] font-bold text-[#77747F] uppercase tracking-wider -mt-1">
                Learn Without Limits
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    'px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors',
                    isActive
                      ? 'text-[#25232B] bg-[#FFF9E5]'
                      : 'text-[#5C5963] hover:text-[#25232B] hover:bg-[#F8F5EE]'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right Actions: Search Button & Auth CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#77747F] hover:text-[#25232B] bg-white border border-[#EFEBE1] hover:border-[#D5D0C5] rounded-xl transition-all shadow-2xs"
            >
              <Search className="w-3.5 h-3.5 text-[#A19DA8]" />
              <span>Search 1,200+ courses...</span>
              <kbd className="text-[10px] bg-[#F4F1EA] text-[#77747F] px-1.5 py-0.5 rounded border border-[#E2DDD3]">
                /
              </kbd>
            </Link>

            <Button variant="ghost" size="sm">
              Log in
            </Button>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => {
                window.location.href = '/courses'
              }}
            >
              Start Free Trial
            </Button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/courses"
              className="p-2 text-[#25232B] bg-white border border-[#EFEBE1] rounded-xl hover:bg-[#F8F5EE]"
              aria-label="Search courses"
            >
              <Search className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#25232B] bg-white border border-[#EFEBE1] rounded-xl hover:bg-[#F8F5EE] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-[#EFEBE1] pb-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.href}
                className={({ isActive }) =>
                  cn(
                    'block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors',
                    isActive
                      ? 'bg-[#FFF9E5] text-[#25232B]'
                      : 'text-[#5C5963] hover:bg-[#F8F5EE] hover:text-[#25232B]'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-[#EFEBE1] flex flex-col gap-2">
              <Button variant="outline" size="md" className="w-full">
                Log in
              </Button>
              <Button
                variant="primary"
                size="md"
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  window.location.href = '/courses'
                }}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
