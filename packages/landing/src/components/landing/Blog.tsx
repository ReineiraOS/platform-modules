'use client'

import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'
import { site } from '@/content/site'

export default function Blog() {
  const blog = site.home.blog

  if (blog.posts.length === 0) return null

  return (
    <section id="blog" className="py-24 sm:py-32 lg:py-36 bg-black border-t border-white/10">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16 lg:mb-20">
          <div>
            {blog.eyebrow ? (
              <p className="text-sm sm:text-base font-semibold tracking-widest uppercase mb-3 sm:mb-4 text-[var(--accent-teal)]">
                {blog.eyebrow}
              </p>
            ) : null}
            <h2 className="text-[32px] sm:text-[40px] lg:text-[48px] font-medium text-white leading-[1.1] tracking-[-0.03em]">
              {blog.title}
            </h2>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors shrink-0"
          >
            View all posts
            <ArrowRight size={14} weight="regular" className="shrink-0" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {blog.posts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col bg-[var(--color-surface-elevated)] rounded-2xl border border-white/[0.06] border-t-2 border-t-accent-teal/20 overflow-hidden hover:border-white/20 hover:bg-[var(--color-surface-card)] transition-all duration-300 cursor-pointer"
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

                <h3 className="text-xl sm:text-2xl font-medium text-white leading-[1.25] tracking-[-0.02em] mb-3 group-hover:text-white/90 transition-colors">
                  {post.title}
                </h3>

                <p className="text-[15px] text-white/50 leading-[1.65] mb-5 flex-1">{post.description}</p>

                <div className="flex items-center justify-between pt-5 border-t border-white/[0.06]">
                  <span className="text-sm text-white/50">{post.date}</span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors text-accent-teal">
                    Read
                    <ArrowRight size={14} weight="regular" className="shrink-0" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
