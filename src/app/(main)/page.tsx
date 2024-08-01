// app/(default)/page.tsx
import React from 'react';
import HomeCarousel from '@/components/HomeCarousel';
import InterActionCard from '@/components/InterActionCard';
import BlogPreview from '@/components/BlogPreview';
import Testimonials from '@/components/Testimonials';
import AstroCarouselHome from '@/components/AstroCarouselHome';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col'>
      <main>
      <HomeCarousel />
      {/* <FeaturedAstrologers /> */}
      <InterActionCard />
      {/* <AstroCardHome /> */}
      <AstroCarouselHome />
      <Testimonials />
      <BlogPreview />
      </main>
    </div>
  );
}