"use client"

import Carousel from "./Carouse"

const carouselImages = [
    '/jonatan-pie-3l3RwQdHRHg-unsplash.jpg',
    '/team.jpg'
  ];

const HomeCarousel: React.FC = () => {
    return (
        <section className="h-screen">
            <Carousel images={carouselImages} />
        </section>
    )
}

export default HomeCarousel;