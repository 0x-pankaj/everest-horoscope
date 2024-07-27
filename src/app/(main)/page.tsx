// app/(default)/page.tsx
import React from 'react';

import FeaturedAstrologers from '@/components/FeaturedAstrologers';
import HomeCarousel from '@/components/HomeCarousel';
import InterActionCard from '@/components/InterActionCard';
import BlogPreview from '@/components/BlogPreview';
import Testimonials from '@/components/Testimonials';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col'>
      <main>
      <HomeCarousel />
      {/* <FeaturedAstrologers /> */}
      <InterActionCard />
      <Testimonials />
      <BlogPreview />
      </main>
    </div>
  );
}