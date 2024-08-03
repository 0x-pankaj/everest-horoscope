"use client"

import Carousel from "./Carouse"

const carouselImages = [
    'https://cloud.appwrite.io/v1/storage/buckets/66998177000d52ac33b4/files/66adde7d00388ce0dc6a/view?project=6696bcc3003c30b6b228&mode=admin',
    'https://cloud.appwrite.io/v1/storage/buckets/66998177000d52ac33b4/files/66addef10033c79f5525/view?project=6696bcc3003c30b6b228&mode=admin'
  ];

const HomeCarousel: React.FC = () => {
    return (
        <section className="h-screen">
            <Carousel images={carouselImages} />
        </section>
    )
}

export default HomeCarousel;