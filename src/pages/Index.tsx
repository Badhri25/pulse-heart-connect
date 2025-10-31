import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import DemoSection from "@/components/DemoSection";
import HowItWorks from "@/components/HowItWorks";
import TestimonialsSection from "@/components/TestimonialsSection";
import RoadmapSection from "@/components/RoadmapSection";
import WaitlistSection from "@/components/WaitlistSection";
import ShareSection from "@/components/ShareSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <DemoSection />
      <HowItWorks />
      <TestimonialsSection />
      <RoadmapSection />
      <WaitlistSection />
      <ShareSection />
      <Footer />
    </div>
  );
};

export default Index;
