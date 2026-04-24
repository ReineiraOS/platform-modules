import TopBanner from '@/components/landing/TopBanner'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import TrustStats from '@/components/business/TrustStats'
import Products from '@/components/landing/Products'
import TrustedBy from '@/components/landing/TrustedBy'
import ModernTeamsSection from '@/components/business/ModernTeamsSection'
import PrivacyInfraSection from '@/components/business/PrivacyInfraSection'
import ComplianceSection from '@/components/business/ComplianceSection'
import ForWhoSection from '@/components/business/ForWhoSection'
import Blog from '@/components/landing/Blog'
import PricingPlans from '@/components/pricing/PricingPlans'
import FAQ from '@/components/landing/FAQ'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <TopBanner />
      <Header />
      <Hero />
      <TrustStats />
      <main>
        <Products />
        <TrustedBy />
        <ModernTeamsSection />
        <PrivacyInfraSection />
        <ComplianceSection />
        <Blog />
        <PricingPlans />
        <ForWhoSection />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
