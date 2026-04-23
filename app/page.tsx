'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  BadgeCheck,
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
      title: 'Authentication-ready',
      description: 'User sign-up, login, and protected experiences are wired into the app shell.',
    },
    {
      icon: TabletSmartphone,
      title: 'Responsive by default',
      description: 'Layouts, spacing, and navigation adapt cleanly from mobile to desktop.',
    },
    {
      icon: BarChart3,
      title: 'API-connected',
      description: 'The app is set up for RESTful data flows, dashboards, and AI-assisted insights.',
    },
    {
      icon: ShieldCheck,
      title: 'Cross-browser safe',
      description: 'Shared layout, semantic markup, and utility styling keep the experience consistent.',
    },
  ]

  const workflow = [
    {
      step: '01',
      title: 'Create the foundation',
      text: 'Set up the shared layout, design language, and content structure that every page will use.',
    },
    {
      step: '02',
      title: 'Wire the key journeys',
      text: 'Connect onboarding, diagnostics, and the dashboard so users can move through the product.',
    },
    {
      step: '03',
      title: 'Expand with feedback',
      text: 'Use the roadmap to layer in more features, refinements, and stronger security.',
    },
  ]

  const roadmap = [
    {
      version: 'v1.0',
      title: 'Core experience',
      description: 'Complete the landing page, authentication flow, and primary user journeys.',
    },
    {
      version: 'v1.1',
      title: 'Feedback loop',
      description: 'Add user feedback collection, deeper messaging, and more helpful reporting.',
    },
    {
      version: 'v1.2',
      title: 'Security hardening',
      description: 'Tighten access controls, validation, and surface-level resilience improvements.',
    },
    {
      version: 'v2.0',
      title: 'Major redesign',
      description: 'Ship a broader UI refresh with richer motion, stronger performance, and new flows.',
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
                Building the first version of the site from the README
              </div>

              <div className="space-y-5">
                <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
                  A focused website for
                  <span className="block text-primary">authentication, diagnostics, and growth.</span>
                </h1>
                <p className="max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                  The README calls for user authentication, responsive design, RESTful API integration,
                  and cross-browser compatibility. This starter turns those goals into a real product
                  experience with a clean landing page, clear navigation, and room to expand.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/diagnostics"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40"
                >
                  Launch diagnostics
                  <Workflow className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: 'Auth', value: 'Ready' },
                  { label: 'Layout', value: 'Responsive' },
                  { label: 'API', value: 'Connected' },
                  { label: 'UI', value: 'Expandable' },
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
                      <p className="text-sm text-muted-foreground">Project shell</p>
                      <h2 className="text-2xl font-semibold">Website foundation</h2>
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
                          <BadgeCheck className="h-4 w-4 text-primary" />
                          Landing page scaffold is in place
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          We can now layer in content, forms, and integrations without reworking the base.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-border bg-card p-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <MessageSquareMore className="h-4 w-4 text-primary" />
                          Next UX step
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Replace placeholder flows with branded onboarding, pricing, and support content.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border bg-card p-4">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          Engineering priorities
                        </div>
                        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                            Clean auth, data, and dashboard journeys
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                            Shared layout and metadata across routes
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                            Consistent responsive treatment
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
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Core capabilities</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                The README translates into four clear product promises.
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
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Build workflow</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                A simple sequence to get the site moving.
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                We start with the visible surfaces users touch first, then fill in the private journeys and
                supporting features behind them.
              </p>
            </div>

            <div className="grid gap-4">
              {workflow.map((item) => (
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

        <section className="bg-secondary/20">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Roadmap</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                  The site can grow in controlled phases.
                </h2>
              </div>
              <Link
                href="/case-studies"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Explore solutions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {roadmap.map((item) => (
                <div key={item.version} className="rounded-3xl border border-border bg-card p-6">
                  <div className="text-sm font-medium uppercase tracking-[0.25em] text-primary">{item.version}</div>
                  <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
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
                  The foundation is ready. Now we can build the full product flow.
                </h2>
                <p className="mt-4 max-w-2xl text-muted-foreground">
                  Start with the authenticated experience, then connect the diagnostic journey and dashboard
                  data around it.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Start building
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40"
                >
                  View dashboard
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
