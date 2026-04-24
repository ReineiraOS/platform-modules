import TopBanner from '@/components/landing/TopBanner'
import Header from '@/components/landing/Header'
import BlogHero from '@/components/blog/BlogHero'
import BlogGrid from '@/components/blog/BlogGrid'
import Footer from '@/components/landing/Footer'

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-black">
      <TopBanner />
      <Header />
      <main>
        <BlogHero />
        <BlogGrid />
      </main>
      <Footer />
    </div>
  )
}
