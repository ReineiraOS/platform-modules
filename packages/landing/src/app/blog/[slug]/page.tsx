import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'
import TopBanner from '@/components/landing/TopBanner'
import Header from '@/components/landing/Header'
import Footer from '@/components/landing/Footer'
import { site } from '@/content/site'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

const allPosts = () =>
  site.blog.grid.posts.length > 0 ? site.blog.grid.posts : site.home.blog.posts

export async function generateStaticParams() {
  const posts = allPosts()
  if (posts.length === 0) return [{ slug: '_placeholder' }]
  return posts.map((post) => ({ slug: post.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = allPosts().find((p) => p.slug === slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    alternates: { canonical: `${site.meta.siteUrl}/blog/${slug}` },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  if (slug === '_placeholder') notFound()
  const post = allPosts().find((p) => p.slug === slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-black">
      <TopBanner />
      <Header />
      <main>
        <article className="pt-28 sm:pt-28 lg:pt-36 pb-24 sm:pb-32 lg:pb-36">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors mb-10 sm:mb-12"
              >
                <ArrowLeft size={14} weight="regular" />
                Back to blog
              </Link>

              <div className="flex items-center gap-3 mb-6">
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
                <span className="text-xs text-white/50">{post.date}</span>
              </div>

              <h1 className="text-[32px] sm:text-[44px] lg:text-[52px] font-semibold text-white leading-[1.1] tracking-[-0.03em] mb-6">
                {post.title}
              </h1>

              <p className="text-white/60 mb-8 text-lg">{post.description}</p>

              <div className="flex items-center gap-3 mb-10 sm:mb-14">
                <span className="text-sm text-white/50">By {post.author}</span>
              </div>

              <div className="border-t border-white/10 pt-10 sm:pt-14 text-white/50">
                <p className="text-base sm:text-lg leading-[1.8]">
                  [LOREM: Blog post body — populate full content via site.blog.grid.posts[].content or extend
                  PostCardSlot with a `body` / `markdown` field.]
                </p>
              </div>

              <div className="mt-16 pt-8 border-t border-white/10">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} weight="regular" />
                  Back to blog
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
