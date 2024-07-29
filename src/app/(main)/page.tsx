// app/(default)/page.tsx
import React from 'react';

import FeaturedAstrologers from '@/components/FeaturedAstrologers';
import HomeCarousel from '@/components/HomeCarousel';
import InterActionCard from '@/components/InterActionCard';
import BlogPreview from '@/components/BlogPreview';
import Testimonials from '@/components/Testimonials';
import AstroCardHome from '@/components/AstroCardHome';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col'>
      <main>
      <HomeCarousel />
      {/* <FeaturedAstrologers /> */}
      <InterActionCard />
      <AstroCardHome />
      <Testimonials />
      <BlogPreview />
      </main>
    </div>
  );
}