import TopBanner from '@/components/landing/TopBanner'
import Header from '@/components/landing/Header'
import MobileHero from '@/components/mobile/MobileHero'
import MobileFeatures from '@/components/mobile/MobileFeatures'
import HowItWorks from '@/components/landing/HowItWorks'
import MobileFAQ from '@/components/mobile/MobileFAQ'
import MobileCTA from '@/components/mobile/MobileCTA'
import Footer from '@/components/landing/Footer'

export default function MobilePage() {
  return (
    <div className="min-h-screen bg-black">
      <TopBanner />
      <Header />
      <main>
        <MobileHero />
        <MobileFeatures />
        <HowItWorks />
        <MobileFAQ />
        <MobileCTA />
      </main>
      <Footer />
    </div>
  )
}
