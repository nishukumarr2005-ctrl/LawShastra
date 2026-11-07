import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, BookMarked, CheckCircle2, Lock, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    window.setTimeout(() => {
      setIsSubmitting(false)
      navigate('/admin')
    }, 700)
  }

  return (
    <div className="min-h-screen bg-[#FFFDF8] text-[#25232B]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-180px] top-[-120px] h-[420px] w-[420px] rounded-full bg-[#FFD84D]/20 blur-3xl" />
        <div className="absolute bottom-[-140px] right-[-120px] h-[420px] w-[420px] rounded-full bg-[#7952D9]/10 blur-3xl" />
      </div>

      <Container size="wide" className="relative min-h-screen py-10 lg:py-16">
        <div className="grid min-h-[calc(100vh-5rem)] items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#F3DD91] bg-[#FFFDF8] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#A87800]">
              <Sparkles className="h-3.5 w-3.5" />
              LexQuora Admin
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-[-0.06em] text-[#171936] md:text-6xl">
              Manage legal content,
              <span className="block text-[#5F42D9]">without the chaos.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-8 text-[#63606C]">
              Upload laws, organise categories, update chapters, publish PDFs and maintain a clean legal knowledge base for learners, researchers and practitioners.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Laws', value: '186+' },
                { label: 'Categories', value: '24' },
                { label: 'Published', value: '94%' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#EFE7DA] bg-white p-4 shadow-[0_16px_38px_rgba(87,64,26,0.04)]">
                  <div className="text-2xl font-black tracking-[-0.05em] text-[#171936]">{item.value}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#7B7882]">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              {[
                'Upload and manage Bare Acts across legal domains',
                'Track chapter-wise content and quick view summaries',
                'Control publishing status and admin workflows',
              ].map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-2xl border border-[#F0EADD] bg-[#FFFDF8] p-3">
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF7E8] text-[#2F8742]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-[#3D3A46]">{point}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-[#EFE7DA] bg-white p-5 shadow-[0_24px_70px_rgba(28,22,44,0.07)] md:p-8">
            <div className="flex items-center justify-between gap-3 border-b border-[#F0EADD] pb-5">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#7C7784]">Secure access</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#171936]">Admin login</h2>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF4CC] text-[#A87800]">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#373347]">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue="admin@lexquora.com"
                  className="w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#373347]">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  defaultValue="admin123"
                  className="w-full rounded-2xl border border-[#E7E0D5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#171936] outline-none transition focus:border-[#D8C7FF] focus:ring-4 focus:ring-[#F2EBFF]"
                />
              </div>

              <div className="flex items-center justify-between gap-3 text-sm text-[#5E5B6B]">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-[#D8D0C4] text-[#5F42D9] focus:ring-[#5F42D9]" defaultChecked />
                  Remember me
                </label>
                <Link to="#" className="font-semibold text-[#5F42D9] hover:text-[#4A31A5]">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting} rightIcon={<ArrowRight className="h-4 w-4" />}>
                {isSubmitting ? 'Signing in...' : 'Sign in to dashboard'}
              </Button>
            </form>

            <div className="mt-6 rounded-2xl border border-dashed border-[#EEDDC5] bg-[#FFFDF7] p-4">
              <div className="flex items-center gap-3 text-[#3B3942]">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF4FF] text-[#3257C5]">
                  <BookMarked className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#171936]">Demo credentials</div>
                  <div className="text-xs text-[#716E7A]">admin@lexquora.com / admin123</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#696575]">
              <Lock className="h-4 w-4 text-[#7C7784]" />
              Protected by secure admin access and role-based permissions
            </div>
          </section>
        </div>
      </Container>
    </div>
  )
}
