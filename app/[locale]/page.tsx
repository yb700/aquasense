import { useTranslations } from 'next-intl';
import { LandingNav } from '@/components/landing/LandingNav';
import { HeroSection } from '@/components/landing/HeroSection';
import { StorySection } from '@/components/landing/StorySection';
import { ProductShowcase } from '@/components/landing/ProductShowcase';
import { Footer } from '@/components/design-system/Footer';
import { Sunrise, Waves, AlertCircle, Moon } from 'lucide-react';

export default function Home() {
  const tHero = useTranslations('landing.hero');
  const tStory = useTranslations('landing.story');
  const tShowcase = useTranslations('landing.showcase');
  const tAuth = useTranslations('auth');
  
  // Define operational stages for the story section
  const operationalStages = [
    {
      time: tStory('morning.time'),
      title: tStory('morning.title'),
      description: tStory('morning.description'),
      icon: <Sunrise className="w-8 h-8" />,
    },
    {
      time: tStory('daytime.time'),
      title: tStory('daytime.title'),
      description: tStory('daytime.description'),
      icon: <Waves className="w-8 h-8" />,
    },
    {
      time: tStory('incident.time'),
      title: tStory('incident.title'),
      description: tStory('incident.description'),
      icon: <AlertCircle className="w-8 h-8" />,
    },
    {
      time: tStory('closing.time'),
      title: tStory('closing.title'),
      description: tStory('closing.description'),
      icon: <Moon className="w-8 h-8" />,
    },
  ];
  
  // Define device mockups for ProductShowcase
  const deviceMockups = [
    {
      device: 'mobile' as const,
      screenshot: '/screenshots/dashboard.svg',
      alt: tShowcase('dashboard'),
      position: 'left' as const,
    },
    {
      device: 'tablet' as const,
      screenshot: '/screenshots/incidents.svg',
      alt: tShowcase('incidents'),
      position: 'right' as const,
    },
  ];
  
  return (
    <>
      {/* Landing Page Navigation */}
      <LandingNav loginText={tAuth('login')} />
      
      <main>
        {/* Hero Section */}
        <HeroSection
          headline={tHero('headline')}
          subheadline={tHero('subheadline')}
          ctaText={tHero('ctaText')}
          ctaHref="/login"
          secondaryCtaText={tHero('secondaryCtaText')}
          secondaryCtaHref="#story"
          backgroundVariant="default"
        />
        
        {/* Story Section - Operational Journey */}
        <StorySection
          id="story"
          title={tStory('title')}
          subtitle={tStory('subtitle')}
          stages={operationalStages}
        />
        
        {/* Product Showcase - Device Mockups */}
        <ProductShowcase
          title={tShowcase('title')}
          subtitle={tShowcase('subtitle')}
          mockups={deviceMockups}
        />
      </main>
      
      {/* Footer */}
      <Footer />
    </>
  );
}
