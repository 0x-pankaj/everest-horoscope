// app/(default)/page.tsx
import React from 'react';

import FeaturedAstrologers from '@/components/FeaturedAstrologers';
import HomeCarousel from '@/components/HomeCarousel';
import InterActionCard from '@/components/InterActionCard';

export default function Home() {
  return (
    <>
      <HomeCarousel />
      <FeaturedAstrologers />
      <InterActionCard />
    </>
  );
}