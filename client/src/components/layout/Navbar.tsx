import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, Search, Menu, X, ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import { getPublicCms, type PublicMenu } from '@/services/lawService'

type NavLinkItem = { label: string; href: string }

const DEFAULT_NAV_LINKS: NavLinkItem[] = [
 
]

const toNavLink = (m: PublicMenu): NavLinkItem => ({ label: m.label, href: m.path || '/' })

function NavItem({
  href,
  label,
  variant,
  onNavigate,
}: {
  href: string
  label: string
  variant: 'desktop' | 'mobile'
  onNavigate?: () => void
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const baseClass = 'rounded-xl text-sm font-semibold transition-colors'

  // Hash/anchor links (e.g. "/#why-us") scroll smoothly instead of routing.
  if (href.includes('#')) {
    const [path, hash] = href.split('#')
    const targetPath = path || '/'
    const onTarget = targetPath === location.pathname
    const scrollTo = (id: string) => {
      if (!id) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault()
      onNavigate?.()
      if (onTarget) {
        scrollTo(hash)
      } else {
        navigate(href)
        requestAnimationFrame(() => scrollTo(hash))
      }
    }
    return (
      <a
        href={href}
        onClick={handleClick}
        className={cn(
          baseClass,
          variant === 'mobile'
            ? 'block px-4 py-2.5 text-[#5C5963] hover:bg-[#F8F5EE] hover:text-[#25232B]'
            : 'px-3.5 py-2 text-[#5C5963] hover:text-[#25232B] hover:bg-[#F8F5EE]'
        )}
      >
        {label}
      </a>
    )
  }

  return (
    <NavLink
      to={href}
      end
      onClick={() => onNavigate?.()}
      className={({ isActive }) =>
        cn(
          baseClass,
          variant === 'mobile' ? 'block px-4 py-2.5' : 'px-3.5 py-2',
          isActive
            ? variant === 'mobile'
              ? 'bg-[#FFF9E5] text-[#25232B]'
              : 'text-[#25232B] bg-[#FFF9E5]'
            : 'text-[#5C5963] hover:text-[#25232B] hover:bg-[#F8F5EE]'
        )
      }
    >
      {label}
    </NavLink>
  )
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [navLinks, setNavLinks] = useState<NavLinkItem[]>(DEFAULT_NAV_LINKS)

  // Track scroll position to add clean border elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load header menus from CMS (managed in Admin → Menus). Fall back to defaults.
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const cms = await getPublicCms()
        const menus = Array.isArray(cms?.menus) ? cms.menus : []
        const headerMenus = menus
          .filter((m) => m && m.visible !== false && String(m.location || '').toLowerCase() === 'header')
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map(toNavLink)
          .filter((l) => l.label)
        if (alive && headerMenus.length > 0) {
          setNavLinks(headerMenus)
        }
      } catch {
        // keep defaults on failure
      }
    })()
    return () => {
      alive = false
    }
  }, [])

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
              <NavItem key={link.label} href={link.href} label={link.label} variant="desktop" />
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

            <Link to="/admin/login">
              <Button variant="ghost" size="sm" type="button">
                Log in
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => {
                window.location.href = '/categories'
              }}
            >
              Explore laws
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
              <NavItem
                key={link.label}
                href={link.href}
                label={link.label}
                variant="mobile"
                onNavigate={() => setMobileMenuOpen(false)}
              />
            ))}
            <div className="pt-3 border-t border-[#EFEBE1] flex flex-col gap-2">
              <Link to="/admin/login">
                <Button variant="outline" size="md" className="w-full" type="button">
                  Log in
                </Button>
              </Link>
              <Button
                variant="primary"
                size="md"
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  window.location.href = '/categories'
                }}
              >
                Explore laws
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}