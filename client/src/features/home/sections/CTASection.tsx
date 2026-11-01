import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'

import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-[#FFFDF8]">
      <Container>
        <div className="relative overflow-hidden bg-[#FFD84D] rounded-3xl lg:rounded-[36px] p-8 sm:p-12 lg:p-16 border border-[#F5CC38] shadow-sm">
          {/* Subtle decorative geometric badges */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-xs text-[#25232B] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <Zap className="w-3.5 h-3.5 fill-[#FF8A45] text-[#FF8A45]" />
              <span>Begin Your Journey Today</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#25232B] tracking-tight leading-tight mb-6">
              Ready to build skills that advance your career and income?
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#3E3A46] font-medium leading-relaxed mb-8 max-w-2xl">
              Get unrestricted access to over 1,200+ production courses, direct mentor feedback, private community Discord channels, and verified certificates.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10">
              <Link to="/courses">
                <Button
                  variant="dark"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto shadow-md"
                >
                  Start 14-Day Free Access
                </Button>
              </Link>
              <Link to="/categories">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto bg-white/90 hover:bg-white text-[#25232B] border-transparent"
                >
                  Explore Course Catalog
                </Button>
              </Link>
            </div>

            {/* Guarantees */}
            <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-[#25232B]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#25232B]" />
                <span>No credit card required to start</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#25232B]" />
                <span>Cancel anytime with 1-click</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#25232B]" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
