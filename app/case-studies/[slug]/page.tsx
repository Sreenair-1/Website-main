'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'

const DEFAULT_CASE_STUDIES: Record<string, any> = {
  'retail-customer-empathy': {
    title: 'Retail Transformation Through Customer Empathy',
    slug: 'retail-customer-empathy',
    description: 'How a major retail chain redesigned their customer experience using design thinking',
    client_name: 'Premium Retail Co',
    industry: 'Retail',
    challenge: 'Declining foot traffic and poor customer satisfaction scores despite recent renovations. The store was seeing a 3-year downward trend in customer visits and had received multiple complaints about the shopping experience.',
    solution: 'Conducted deep empathy research with customers and staff, identifying pain points in the shopping journey through interviews and observation. Prototyped new store layouts, improved signage, and trained staff in customer-centric service. Implemented iterative feedback loops with customers.',
    results: { 'Customer Satisfaction': '+35%', 'Foot Traffic': '+22%', 'Transaction Value': '+18%', 'Staff Satisfaction': '+28%' },
    image_url: 'https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=1200&h=600&fit=crop',
    tags: ['Customer Experience', 'Retail', 'Design Thinking'],
    featured: true,
  },
  'healthcare-service-innovation': {
    title: 'Healthcare Service Innovation',
    slug: 'healthcare-service-innovation',
    description: 'Streamlining patient care pathways through design thinking methodology',
    client_name: 'City Medical Center',
    industry: 'Healthcare',
    challenge: 'Long wait times averaging 2+ hours, poor care coordination between departments, and low patient satisfaction scores. The hospital was facing increasing patient complaints and reputation damage.',
    solution: 'Mapped entire patient journeys from arrival to discharge. Identified systemic inefficiencies in appointment scheduling, check-in processes, and care transitions. Tested new digital check-in systems, improved communication protocols, and reorganized staff workflows.',
    results: { 'Wait Time Reduction': '-40%', 'Patient Satisfaction': '+42%', 'Staff Efficiency': '+28%', 'Readmission Rate': '-15%' },
    image_url: 'https://images.unsplash.com/photo-1631217314831-c6227db76b6e?w=1200&h=600&fit=crop',
    tags: ['Healthcare', 'Process Improvement', 'Patient Experience'],
    featured: true,
  },
  'manufacturing-supply-chain': {
    title: 'Manufacturing Supply Chain Optimization',
    slug: 'manufacturing-supply-chain',
    description: 'Redesigning supply chain networks with stakeholder insights',
    client_name: 'Industrial Manufacturing Inc',
    industry: 'Manufacturing',
    challenge: 'Complex supply chain with high inventory costs, frequent production delays, and poor supplier relationships. The company was spending 25% more than industry benchmarks on inventory.',
    solution: 'Engaged suppliers and logistics partners in co-design workshops. Visualized supply chain bottlenecks and tested new coordination methods including better forecasting and just-in-time delivery. Implemented collaborative planning systems.',
    results: { 'Lead Time': '-25%', 'Inventory Costs': '-32%', 'On-Time Delivery': '+38%', 'Supplier Satisfaction': '+31%' },
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop',
    tags: ['Supply Chain', 'Manufacturing', 'Logistics'],
    featured: false,
  },
  'financial-digital-transformation': {
    title: 'Financial Services Digital Transformation',
    slug: 'financial-digital-transformation',
    description: 'Building customer-centric digital banking solutions',
    client_name: 'Regional Financial Services',
    industry: 'Finance',
    challenge: 'Legacy systems limiting digital innovation, poor digital adoption rates among customers, and declining younger customer base. The bank was losing market share to digital-native competitors.',
    solution: 'Co-designed mobile banking platform with customers and staff. Built multiple iterative prototypes and tested with real users. Developed phased implementation strategy with extensive change management and training.',
    results: { 'Digital Adoption': '+55%', 'Customer Retention': '+29%', 'New Accounts': '+41%', 'Digital Transaction Volume': '+78%' },
    image_url: 'https://images.unsplash.com/photo-1518320506885-18927582291e?w=1200&h=600&fit=crop',
    tags: ['Digital Transformation', 'Finance', 'User Experience'],
    featured: true,
  },
}

export default function CaseStudyPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [study, setStudy] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const defaultStudy = DEFAULT_CASE_STUDIES[slug]
    if (defaultStudy) {
      setStudy(defaultStudy)
    }
    setLoading(false)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!study) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Case Study Not Found</h1>
          <Link href="/case-studies" className="text-primary hover:underline">
            ← Back to Case Studies
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/case-studies" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Case Studies
          </Link>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="h-96 bg-gray-300 overflow-hidden">
        <img
          src={study.image_url}
          alt={study.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            {study.industry}
          </div>
          <h1 className="text-5xl font-bold mb-4">{study.title}</h1>
          <p className="text-xl text-muted-foreground">{study.description}</p>
        </div>

        {/* Client Info */}
        <div className="bg-secondary/5 rounded-lg p-6 mb-12 border border-border">
          <h3 className="font-semibold mb-2">About the Client</h3>
          <p className="text-muted-foreground">{study.client_name} - {study.industry} sector</p>
        </div>

        {/* Challenge */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">The Challenge</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            {study.challenge}
          </p>
        </section>

        {/* Our Approach */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Approach</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            {study.solution}
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-6">
            <p className="text-sm font-medium text-primary mb-2">Design Thinking Methodology</p>
            <p className="text-muted-foreground">
              We followed our proven Design Thinking framework: Empathize, Define, Ideate, Prototype, and Test. This human-centered approach ensured that solutions directly addressed stakeholder needs.
            </p>
          </div>
        </section>

        {/* Results */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(study.results).map(([metric, value]) => (
              <div key={metric} className="bg-card border border-border rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-primary mb-2">{value}</p>
                <p className="text-sm text-muted-foreground">{metric}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tags */}
        {study.tags && (
          <section className="mb-12">
            <h3 className="font-semibold mb-4">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {study.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-secondary/20 text-foreground px-4 py-2 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="border-t border-border pt-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Transformation?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover how design thinking can drive innovation and growth in your organization.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/booking"
              className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Schedule Consultation
            </Link>
            <Link
              href="/diagnostics"
              className="border border-border text-foreground px-8 py-3 rounded-md font-medium hover:bg-secondary/5 transition-colors"
            >
              Take Assessment
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}
