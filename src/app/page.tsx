import Banner from "@/components/home/Banner";
import FeaturedSection from "@/components/home/FeaturedSection";
import ImpactSection from "@/components/home/ImpactSection";
import StepsSection from "@/components/home/StepsSection";
import WhyReuseHub from "@/components/home/WhyReuseHub";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Banner />
      <FeaturedSection/>
      <WhyReuseHub />
      <ImpactSection />
      <StepsSection/>
    </div>
  );
}
