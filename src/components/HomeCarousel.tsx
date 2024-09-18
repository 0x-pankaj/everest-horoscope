"use client"

import { useState, useEffect } from 'react'
import Carousel from './Carouse';


const carouselImages = [
    'https://cloud.appwrite.io/v1/storage/buckets/66998177000d52ac33b4/files/66adde7d00388ce0dc6a/view?project=6696bcc3003c30b6b228&mode=admin',
    'https://cloud.appwrite.io/v1/storage/buckets/66998177000d52ac33b4/files/66addef10033c79f5525/view?project=6696bcc3003c30b6b228&mode=admin'
];

const HomeCarousel: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="h-screen relative">
            <Carousel images={carouselImages} />
            {/* <div className={`absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-center bg-yellow-100 bg-opacity-80 p-8 rounded-lg">
                    <img src="/your-logo.png" alt="Company Logo" className="mx-auto mb-4 w-24 h-24" />
                    <h1 className="text-5xl font-bold text-yellow-800 mb-4">Welcome to Our Company</h1>
                    <p className="text-2xl text-yellow-700 mb-6">Discover the future of astrology with us</p>
                    <div className="space-x-4">
                        <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 transition-colors">
                            Get Started
                        </button>
                        <button className="bg-transparent border-2 border-yellow-500 text-yellow-700 font-bold py-2 px-4 rounded hover:bg-yellow-500 hover:text-white transition-colors">
                            Learn More
                        </button>
                    </div>
                </div>
            </div> */}
        </section>
    )
}

export default HomeCarousel;