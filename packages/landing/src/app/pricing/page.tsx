import TopBanner from '@/components/landing/TopBanner'
import Header from '@/components/landing/Header'
import PricingHero from '@/components/pricing/PricingHero'
import PricingPlans from '@/components/pricing/PricingPlans'
import PricingFeatures from '@/components/pricing/PricingFeatures'
import PricingFAQ from '@/components/pricing/PricingFAQ'
import Footer from '@/components/landing/Footer'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black">
      <TopBanner />
      <Header />
      <main>
        <PricingHero />
        <PricingPlans />
        <PricingFeatures />
        <PricingFAQ />
      </main>
      <Footer />
    </div>
  )
}
