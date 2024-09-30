import React from 'react';
// import HomeCarousel from '@/components/HomeCarousel';
import InterActionCard from '@/components/InterActionCard';
import BlogPreview from '@/components/BlogPreview';
import Testimonials from '@/components/Testimonials';
import ZodiacHoroscope from '@/components/ZodiacHoroscope';
import WeatherComponent from '@/components/Weather';
import HowItWorks from '@/components/HowItWork';
import OurServices from '@/components/OurService';
import QuestionsComponent from '@/components/Questions';
import PanchangHome from '@/components/TodaysPanchang';
import ResponsiveCarousel from '@/components/ResponsiveCarousel';


export default function Home() {
  return (
    <div className='min-h-screen flex flex-col bg-yellow-50'>
      <main className="container mx-auto px-2 py-8 space-y-8">
        {/* <HomeCarousel /> */}
        <ResponsiveCarousel />
        <QuestionsComponent />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <WeatherComponent />
          <PanchangHome />
        </div>
          <ZodiacHoroscope />

        <OurServices />
        <HowItWorks />
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