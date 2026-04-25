import Link from 'next/link'
import { ArrowRight, BadgeCheck, Briefcase, Users2, Target, ShieldCheck, Workflow } from 'lucide-react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const values = [
  {
    icon: Target,
    title: 'Clarity first',
    text: 'We simplify complex operational problems so leadership teams can make faster decisions.',
  },
  {
    icon: Workflow,
    title: 'Practical execution',
    text: 'Recommendations are designed to be implemented in real businesses, not just presented in slides.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted delivery',
    text: 'We keep work structured, transparent, and measurable from the first workshop to the final handoff.',
  },
]

const strengths = [
  'Supply chain analysis and optimization',
  'Operational readiness and process mapping',
  'Transformation planning and delivery support',
  'Client communication and stakeholder alignment',
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(15,98,254,0.16),transparent_35%),radial-gradient(circle_at_top_right,rgba(8,145,178,0.14),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_25%)]" />
          <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
                  <Briefcase className="h-4 w-4 text-primary" />
                  About IndusOpa Consulting
                </div>

                <div className="space-y-4">
                  <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
                    We help operations teams move from
                    <span className="block text-primary">unclear to coordinated.</span>
                  </h1>
                  <p className="max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
                    IndusOpa is a consultancy focused on operations, supply chain performance, and transformation
                    readiness. We partner with organizations that need clearer decisions, stronger processes, and
                    measurable delivery.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/booking"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Start a conversation
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/case-studies"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40"
                  >
                    See case studies
                    <BadgeCheck className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                <div className="rounded-[1.5rem] border border-border bg-gradient-to-br from-primary/10 via-card to-secondary/20 p-6">
                  <p className="text-sm uppercase tracking-[0.25em] text-primary">What we focus on</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {strengths.map((item) => (
                      <div key={item} className="rounded-2xl border border-border bg-background/80 p-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                          <p className="text-sm leading-6 text-muted-foreground">{item}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { value: '01', label: 'Assess' },
                    { value: '02', label: 'Design' },
                    { value: '03', label: 'Deliver' },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl border border-border bg-background p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{item.value}</div>
                      <div className="mt-1 text-sm font-medium text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/20">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="grid gap-6 md:grid-cols-3">
              {values.map((item) => (
                <article key={item.title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <item.icon className="h-10 w-10 text-primary" />
                  <h2 className="mt-5 text-xl font-semibold">{item.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Our approach</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                We keep the work grounded in business reality.
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Our team looks for the practical bottlenecks that slow execution and builds a path your team can
                actually run with.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                {
                  title: 'Discovery workshops',
                  text: 'We map the current process, align stakeholders, and define the problem clearly before proposing fixes.',
                },
                {
                  title: 'Operational design',
                  text: 'We translate findings into a simpler workflow, scorecard, or decision model that teams can adopt.',
                },
                {
                  title: 'Delivery support',
                  text: 'We stay involved long enough to help the plan move from recommendation to execution.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Users2 className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="rounded-[2rem] border border-border bg-gradient-to-br from-primary/10 via-card to-secondary/20 p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">Work with us</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                  If your team needs clearer operations, let&apos;s talk.
                </h2>
                <p className="mt-4 max-w-2xl text-muted-foreground">
                  We can help you assess current performance, identify the gaps, and build a practical consulting
                  plan that supports delivery.
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
                  href="/diagnostics"
                  className="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/40"
                >
                  Start assessment
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
