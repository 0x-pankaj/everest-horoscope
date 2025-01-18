import React from "react";
import InterActionCard from "@/components/InterActionCard";
import BlogPreview from "@/components/BlogPreview";
import Testimonials from "@/components/Testimonials";
import ZodiacHoroscope from "@/components/ZodiacHoroscope";
import WeatherComponent from "@/components/Weather";
import HowItWorks from "@/components/HowItWork";
import OurServices from "@/components/OurService";
import QuestionsComponent from "@/components/Questions";
import PanchangHome from "@/components/TodaysPanchang";
import ResponsiveCarousel from "@/components/ResponsiveCarousel";
import DobComponent from "@/components/DobComponent";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-yellow-50">
      <main className="container mx-auto px-2 py-8 space-y-8">
        {/* <HomeCarousel /> */}
        <ResponsiveCarousel />
        <HowItWorks />
        <DobComponent />
        <QuestionsComponent />
        <div className="grid grid-cols-0 gap-1 lg:grid-cols-5 items-start">
          {/* PanchangHome will take up two-thirds width on desktop and full width on mobile */}
          <div className="lg:col-span-3 order-1">
            <PanchangHome />
          </div>

          {/* WeatherComponent will take one-third width on desktop and full width on mobile */}
          <div className="lg:col-span-2 order-2">
            {/* <WeatherComponent /> */}
            <Features />
          </div>
        </div>
        {/* <ZodiacHoroscope /> */}

        {/* <OurServices /> */}
        <FAQ />
        <InterActionCard />
        <Testimonials />
        <BlogPreview />
      </main>
    </div>
  );
}

// // app/(default)/page.tsx
// import React from 'react';
// import HomeCarousel from '@/components/HomeCarousel';
// import InterActionCard from '@/components/InterActionCard';
// import BlogPreview from '@/components/BlogPreview';
// import Testimonials from '@/components/Testimonials';
// import AstroCarouselHome from '@/components/AstroCarouselHome';
// import ZodiacHoroscope from '@/components/ZodiacHoroscope';

// export default function Home() {
//   return (
//     <div className='min-h-screen flex flex-col bg-yellow-50'>
//       <main>
//       <HomeCarousel />
//       {/* <FeaturedAstrologers /> */}
//       <ZodiacHoroscope />
//       <InterActionCard />
//       {/* <AstroCardHome /> */}
//       {/* <AstroCarouselHome /> */}
//       <Testimonials />
//       <BlogPreview />
//       </main>
//     </div>
//   );
// }
