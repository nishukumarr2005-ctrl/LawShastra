import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, CheckCircle2, Mail } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="bg-white border-t border-[#EFEBE1] pt-16 pb-12 text-[#25232B]">
      <Container>
        {/* Top Newsletter / Value Callout Bar */}
        <div className="bg-[#FFF9E5] border border-[#FFE885] rounded-3xl p-8 lg:p-10 mb-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#9A7300] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FF8A45]" />
              Stay Ahead in Tech & Design
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#25232B] tracking-tight">
              Get weekly curated lessons and industry insights.
            </h3>
            <p className="mt-2 text-sm text-[#77747F]">
              Join 45,000+ engineers, designers, and founders. No spam, unsubscribe anytime.
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            {subscribed ? (
              <div className="flex items-center gap-2.5 p-4 bg-white rounded-2xl border border-emerald-200 text-emerald-800 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>You are subscribed! Check your inbox for our latest curriculum guide.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-[#A19DA8] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email..."
                    className="w-full bg-white border border-[#EFEBE1] rounded-2xl pl-11 pr-4 py-3 text-sm text-[#25232B] placeholder:text-[#A19DA8] focus:outline-none focus:border-[#FF8A45] focus:ring-2 focus:ring-[#FF8A45]/20 font-medium"
                  />
                </div>
                <Button
                  type="submit"
                  variant="dark"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="shrink-0"
                >
                  Join Free
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Info */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-2xl bg-[#FFD84D] flex items-center justify-center text-[#25232B] shadow-xs">
                <Sparkles className="w-5 h-5 fill-[#25232B]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#25232B]">
                Edu<span className="text-[#FF8A45]">Sphere</span>
              </span>
            </Link>
            <p className="text-sm text-[#77747F] leading-relaxed max-w-sm mb-6">
              A modern education platform empowering creative minds and engineers to build extraordinary products. Inspired by modern human-centric design.
            </p>
            <div className="flex items-center gap-2 text-[#77747F]">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-[#EFEBE1] bg-[#FFFDF8] hover:bg-[#F8F5EE] hover:text-[#25232B] flex items-center justify-center transition-colors"
                aria-label="Twitter / X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-[#EFEBE1] bg-[#FFFDF8] hover:bg-[#F8F5EE] hover:text-[#25232B] flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-[#EFEBE1] bg-[#FFFDF8] hover:bg-[#F8F5EE] hover:text-[#25232B] flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.69 1.69 0 0 0 1.7-1.69c0-.93-.76-1.69-1.7-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.69 1.69 1.69m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl border border-[#EFEBE1] bg-[#FFFDF8] hover:bg-[#F8F5EE] hover:text-[#25232B] flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>


          {/* Column: Popular Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#25232B] mb-4">
              Explore Topics
            </h4>
            <ul className="space-y-2.5 text-sm text-[#77747F]">
              <li>
                <Link to="/courses?category=web-development" className="hover:text-[#25232B] transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/courses?category=ui-ux-design" className="hover:text-[#25232B] transition-colors">
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link to="/courses?category=data-science" className="hover:text-[#25232B] transition-colors">
                  Data Science
                </Link>
              </li>
              <li>
                <Link to="/courses?category=programming" className="hover:text-[#25232B] transition-colors">
                  Programming & DSA
                </Link>
              </li>
              <li>
                <Link to="/courses?category=artificial-intelligence" className="hover:text-[#25232B] transition-colors">
                  Artificial Intelligence
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#25232B] mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-[#77747F]">
              <li>
                <Link to="/courses" className="hover:text-[#25232B] transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-[#25232B] transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <a href="#instructors" className="hover:text-[#25232B] transition-colors">
                  Meet Instructors
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-[#25232B] transition-colors">
                  Learning Methodology
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 text-amber-700 font-semibold text-xs">
                  Enterprise Teams <span className="bg-[#FFF9E5] text-[10px] px-1.5 py-0.5 rounded">New</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Column: Company & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#25232B] mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm text-[#77747F]">
              <li>
                <a href="#why-us" className="hover:text-[#25232B] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <span className="hover:text-[#25232B] transition-colors cursor-pointer">
                  Community Discord
                </span>
              </li>
              <li>
                <span className="hover:text-[#25232B] transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-[#25232B] transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-[#25232B] transition-colors cursor-pointer">
                  Contact Support
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#EFEBE1] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#77747F]">
          <p>© {CURRENT_YEAR} EduSphere Platform Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with React, TypeScript & Tailwind CSS. Designed for real learners.
          </p>
        </div>
      </Container>
    </footer>
  )
}
