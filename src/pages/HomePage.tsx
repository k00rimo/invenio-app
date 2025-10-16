import HeroSection from "@/components/layout/homepage/HeroSection";
import ExploreSection from "@/components/layout/homepage/ExploreSection";
import AboutSection from "@/components/layout/homepage/AboutSection";
import CommunitySection from "@/components/layout/homepage/CommunitySection";

const HomePage = () => {    

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <HeroSection />
      <ExploreSection />
      <AboutSection />
      <CommunitySection />
    </div>
  );
}

export default HomePage
