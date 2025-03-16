import { ElegantShape } from "@/components/Home/elegant-shape";
import { ExamplesSection } from "@/components/Home/examples-section";
import { FeaturesSection } from "@/components/Home/features-section";
import { Footer } from "@/components/Home/footer";
import { HeroContent } from "@/components/Home/hero-content";
import { HomeHeader } from "@/components/Home/home-header";
import { Separator } from "@/components/ui/separator";

const HomePage = () => {
  const badge = "Habivita";
  const title1 = "Your Personal";
  const title2 = "Journey Companion";

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-[#0a0518]">
      <HomeHeader />

      {/* Hero Content */}
      <div className="flex-grow flex items-center justify-center py-12 sm:py-16 md:py-24 border-b-4 border-white/10">
        <div className="absolute inset-0 bg-gradient-to-tl from-primary via-transparent to-secondary blur-3xl opacity-80" />

        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={600}
            height={140}
            rotate={12}
            gradient="from-teal-500/[0.15]"
            className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
          />
          <ElegantShape
            delay={0.5}
            width={500}
            height={120}
            rotate={-15}
            gradient="from-purple-500/[0.15]"
            className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
          />
          <ElegantShape
            delay={0.4}
            width={300}
            height={80}
            rotate={-8}
            gradient="from-emerald-500/[0.15]"
            className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
          />
          <ElegantShape
            delay={0.6}
            width={200}
            height={60}
            rotate={20}
            gradient="from-indigo-500/[0.15]"
            className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
          />
          <ElegantShape
            delay={0.7}
            width={220}
            height={40}
            rotate={-25}
            gradient="from-blue-500/[0.15]"
            className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
          />
        </div>

        <HeroContent badge={badge} title1={title1} title2={title2} />

        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-[#0e0525c2] pointer-events-none" />
      </div>

      <FeaturesSection />

      <Separator />

      <ExamplesSection />
      <Footer />
    </div>
  );
};

export default HomePage;
