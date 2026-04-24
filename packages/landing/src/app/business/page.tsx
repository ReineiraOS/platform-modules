import TopBanner from '@/components/landing/TopBanner'
import BusinessHeader from '@/components/business/BusinessHeader'
import BusinessHero from '@/components/business/BusinessHero'
import ForWhoSection from '@/components/business/ForWhoSection'
import ModernTeamsSection from '@/components/business/ModernTeamsSection'
import PrivacyInfraSection from '@/components/business/PrivacyInfraSection'
import ComplianceSection from '@/components/business/ComplianceSection'
import TrustStats from '@/components/business/TrustStats'
import BusinessFAQ from '@/components/business/BusinessFAQ'
import BusinessCTA from '@/components/business/BusinessCTA'
import Footer from '@/components/landing/Footer'

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-black">
      <TopBanner />
      <BusinessHeader />
      <main>
        <BusinessHero />
        <ForWhoSection />
        <ModernTeamsSection />
        <PrivacyInfraSection />
        <ComplianceSection />
        <TrustStats />
        <BusinessFAQ />
        <BusinessCTA />
      </main>
      <Footer />
    </div>
  )
}
