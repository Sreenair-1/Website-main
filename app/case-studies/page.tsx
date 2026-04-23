'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ArrowRight } from 'lucide-react'

interface CaseStudy {
  id: string
  title: string
  slug: string
  description: string
  client_name: string
  industry: string
  challenge: string
  solution: string
  results: Record<string, string>
  image_url: string
  tags: string[]
  featured: boolean
  created_at: string
}

const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    title: 'Retail Transformation Through Customer Empathy',
    slug: 'retail-customer-empathy',
    description: 'How a major retail chain redesigned their customer experience using design thinking',
    client_name: 'Premium Retail Co',
    industry: 'Retail',
    challenge: 'Declining foot traffic and poor customer satisfaction scores despite recent renovations',
    solution: 'Conducted empathy research with customers and staff, identified pain points in the shopping journey, prototyped new store layouts and service models',
    results: { 'Customer Satisfaction': '+35%', 'Foot Traffic': '+22%', 'Transaction Value': '+18%' },
    image_url: 'https://images.unsplash.com/photo-1483389127117-b6a2102724ae?w=800&h=600&fit=crop',
    tags: ['Customer Experience', 'Retail', 'Design Thinking'],
    featured: true,
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    title: 'Healthcare Service Innovation',
    slug: 'healthcare-service-innovation',
    description: 'Streamlining patient care pathways through design thinking methodology',
    client_name: 'City Medical Center',
    industry: 'Healthcare',
    challenge: 'Long wait times, poor care coordination, and low patient satisfaction',
    solution: 'Mapped patient journeys, identified systemic inefficiencies, tested new scheduling and communication protocols',
    results: { 'Wait Time Reduction': '-40%', 'Patient Satisfaction': '+42%', 'Staff Efficiency': '+28%' },
    image_url: 'https://images.unsplash.com/photo-1631217314831-c6227db76b6e?w=800&h=600&fit=crop',
    tags: ['Healthcare', 'Process Improvement', 'Patient Experience'],
    featured: true,
    created_at: '2024-02-10T00:00:00Z',
  },
  {
    id: '3',
    title: 'Manufacturing Supply Chain Optimization',
    slug: 'manufacturing-supply-chain',
    description: 'Redesigning supply chain networks with stakeholder insights',
    client_name: 'Industrial Manufacturing Inc',
    industry: 'Manufacturing',
    challenge: 'Complex supply chain, high inventory costs, frequent delays',
    solution: 'Engaged suppliers and logistics partners, visualized bottlenecks, tested new coordination methods',
    results: { 'Lead Time': '-25%', 'Inventory Costs': '-32%', 'On-Time Delivery': '+38%' },
    image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
    tags: ['Supply Chain', 'Manufacturing', 'Logistics'],
    featured: false,
    created_at: '2024-02-20T00:00:00Z',
  },
  {
    id: '4',
    title: 'Financial Services Digital Transformation',
    slug: 'financial-digital-transformation',
    description: 'Building customer-centric digital banking solutions',
    client_name: 'Regional Financial Services',
    industry: 'Finance',
    challenge: 'Legacy systems, poor digital adoption, declining younger customer base',
    solution: 'Co-designed with customers and staff, built iterative prototypes, phased implementation strategy',
    results: { 'Digital Adoption': '+55%', 'Customer Retention': '+29%', 'New Accounts': '+41%' },
    image_url: 'https://images.unsplash.com/photo-1518320506885-18927582291e?w=800&h=600&fit=crop',
    tags: ['Digital Transformation', 'Finance', 'User Experience'],
    featured: true,
    created_at: '2024-03-01T00:00:00Z',
  },
]

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(DEFAULT_CASE_STUDIES)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTags = Array.from(new Set(caseStudies.flatMap(cs => cs.tags)))
  const filteredStudies = selectedTag
    ? caseStudies.filter(cs => cs.tags.includes(selectedTag))
    : caseStudies

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Header */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/5 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 font-mono">Solutions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real transformations, real results. See how organizations like yours have implemented design thinking successfully.
          </p>
        </div>
      </section>

      {/* Filters */}
      {allTags.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-border">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTag === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/20 text-foreground hover:bg-secondary/30'
              }`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary/20 text-foreground hover:bg-secondary/30'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Case Studies Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredStudies.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No case studies found</div>
          ) : (
            <div className="space-y-12">
              {/* Featured Studies */}
              {filteredStudies.some(cs => cs.featured) && (
                <div>
                  <h2 className="text-3xl font-bold mb-8">Featured</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredStudies.filter(cs => cs.featured).map(study => (
                      <Link
                        key={study.id}
                        href={`/case-studies/${study.slug}`}
                        className="group"
                      >
                        <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-xl transition-all">
                          <div className="h-64 bg-gray-300 overflow-hidden">
                            <img
                              src={study.image_url}
                              alt={study.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-6">
                            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3">
                              {study.industry}
                            </div>
                            <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                              {study.title}
                            </h3>
                            <p className="text-muted-foreground mb-4">{study.description}</p>
                            <div className="flex items-center gap-2 text-primary font-medium">
                              Read Story <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Studies */}
              {filteredStudies.some(cs => !cs.featured) && (
                <div>
                  <h2 className="text-3xl font-bold mb-8">Other Case Studies</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudies.filter(cs => !cs.featured).map(study => (
                      <Link
                        key={study.id}
                        href={`/case-studies/${study.slug}`}
                        className="group"
                      >
                        <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                          <div className="h-40 bg-gray-300 overflow-hidden">
                            <img
                              src={study.image_url}
                              alt={study.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4 flex-1 flex flex-col">
                            <div className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium mb-2 w-fit">
                              {study.industry}
                            </div>
                            <h3 className="font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {study.title}
                            </h3>
                            <p className="text-sm text-muted-foreground flex-1">{study.client_name}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
