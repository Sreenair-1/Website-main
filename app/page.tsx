'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  BarChart3,
  Globe2,
  Lock,
  MessageSquareMore,
  ShieldCheck,
  Sparkles,
  TabletSmartphone,
  Workflow,
} from 'lucide-react'

import { Globe3D } from '@/components/globe-3d'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { useAuth } from '@/providers/auth-provider'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [loading, user, router])

  const capabilities = [
    {
      icon: Lock,
      title: 'Client access',
      description: 'Secure sign-up and login for private client portals and project workspaces.',
    },
    {
      icon: TabletSmartphone,
      title: 'Responsive delivery',
      description: 'A clean experience that works across phones, tablets, laptops, and desktops.',
    },
    {
      icon: BarChart3,
      title: 'Operational insight',
      description: 'Assessment flows and dashboards designed to turn data into clear next steps.',
    },
    {
      icon: ShieldCheck,
      title: 'Reliable execution',
      description: 'Simple, durable UI patterns that keep the site consistent across browsers.',
    },
  ]

  const services = [
    {
      step: '01',
      title: 'Assess',
      text: 'We identify the operational constraints, decision bottlenecks, and process gaps slowing growth.',
    },
    {
      step: '02',
      title: 'Design',
      text: 'We shape practical solutions for supply chains, service delivery, and team workflows.',
    },
    {
      step: '03',
      title: 'Deliver',
      text: 'We help teams implement, measure, and refine changes with a strong focus on outcomes.',
    },
  ]

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <Header />

      <main>
        <section className="relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(15,98,254,0.16),transparent_35%),radial-gradient(circle_at_top_right,rgba(8,145,178,0.14),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_25%)]" />
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-14 pt-16 lg:grid-cols-2 lg:pb-20 lg:pt-24">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4 text-primary" />
                Operations and supply chain consulting
              </div>

              <div className="space-y-5">
                <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
                  Practical consulting for teams that need
                  <span className="block text-primary">better operations and clearer decisions.</span>
                </h1>
                <p className="max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                  IndusOpa helps organizations improve supply chains, streamline delivery, and turn complex
                  problems into measurable action plans.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Book a consultation
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/diagnostics"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40"
                >
                  Start assessment
                  <Workflow className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: 'Focus', value: 'Operations' },
                  { label: 'Support', value: 'Client portal' },
                  { label: 'Method', value: 'Diagnostics' },
                  { label: 'Delivery', value: 'Consulting' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-border bg-card/80 p-4 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{stat.label}</div>
                    <div className="mt-2 text-lg font-semibold">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-3xl" />
              <div className="overflow-hidden rounded-[2rem] border border-border bg-card/70 p-4 shadow-2xl backdrop-blur">
                <div className="rounded-[1.5rem] border border-border/70 bg-background/90 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Consulting platform</p>
                      <h2 className="text-2xl font-semibold">Client experience</h2>
                    </div>
                    <Globe2 className="h-6 w-6 text-primary" />
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="relative h-[360px] overflow-hidden rounded-[1.5rem] border border-border bg-gradient-to-br from-secondary/40 via-background to-primary/10">
                      <div className="absolute inset-0">
                        <Globe3D />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-border bg-background/80 p-4 backdrop-blur">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          Structured for client work
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Assessment, communication, and delivery live in one place for a cleaner workflow.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-border bg-card p-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <MessageSquareMore className="h-4 w-4 text-primary" />
                          Client feedback
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Capture client comments and use them to refine the service experience.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border bg-card p-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <BarChart3 className="h-4 w-4 text-primary" />
                          Delivery focus
                        </div>
                        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                            Supply chain and operations reviews
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                            Case studies and client outcomes
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                            Ongoing feedback and improvement
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/20">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">What we do</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                A simple consulting model built around assessment, design, and delivery.
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {capabilities.map((item) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1"
                >
                  <item.icon className="h-10 w-10 text-primary" />
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">How we work</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                We keep the process clear from first conversation to delivery.
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Every engagement starts by understanding where the bottlenecks are, then moves into practical
                recommendations and measurable execution.
              </p>
            </div>

            <div className="grid gap-4">
              {services.map((item) => (
                <div key={item.step} className="flex gap-5 rounded-3xl border border-border bg-card p-6">
                  <div className="text-sm font-semibold tracking-[0.3em] text-primary">{item.step}</div>
                  <div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-[2rem] border border-border bg-gradient-to-br from-primary/10 via-card to-secondary/20 p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Next step</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                  Talk to us about your operations, supply chain, or transformation goals.
                </h2>
                <p className="mt-4 max-w-2xl text-muted-foreground">
                  We&apos;ll help you identify the clearest opportunities and put a practical plan around them.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/booking"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Book a call
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/case-studies"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40"
                >
                  View case studies
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
