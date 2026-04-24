'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { m, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight } from '@phosphor-icons/react'
import { site } from '@/content/site'

export default function BlogGrid() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const prefersReducedMotion = useReducedMotion()
  const posts = site.blog.grid.posts.length > 0 ? site.blog.grid.posts : site.home.blog.posts

  if (posts.length === 0) {
    return (
      <section ref={sectionRef} className="pb-24 sm:pb-32 lg:pb-36 bg-black">
        <div className="container text-center text-white/40 text-sm">[LOREM: no blog posts yet — populate site.blog.grid.posts]</div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="pb-24 sm:pb-32 lg:pb-36 bg-black">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {posts.map((post) => (
            <m.article
              key={post.slug}
              className="group flex flex-col rounded-2xl border border-white/10 border-t-2 border-t-accent-teal/20 overflow-hidden hover:border-white/20 transition-all duration-300 cursor-pointer bg-[var(--color-surface-elevated)] hover:bg-[var(--color-surface-card)]"
              initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Link href={`/blog/${post.slug}`} className="p-6 sm:p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="px-3 py-1 text-xs font-medium rounded-full"
                    style={{
                      background: 'var(--accent-teal-bg)',
                      color: 'var(--accent-teal)',
                      border: '1px solid var(--accent-teal-border)',
                    }}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-white/50">{post.readTime}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-medium text-white leading-[1.25] tracking-[-0.02em] mb-3 group-hover:text-white/90 transition-colors">
                  {post.title}
                </h2>
                <p className="text-[15px] text-white/50 leading-[1.65] mb-5 flex-1">{post.description}</p>
                <div className="flex items-center justify-between pt-5 border-t border-white/[0.06]">
                  <span className="text-sm text-white/50">{post.date}</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-teal">
                    Read
                    <ArrowRight size={14} weight="regular" className="shrink-0" />
                  </span>
                </div>
              </Link>
            </m.article>
          ))}
        </div>
      </div>
    </section>
  )
}
