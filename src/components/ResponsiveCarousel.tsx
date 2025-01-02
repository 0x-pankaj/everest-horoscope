"use client";
import React, { useState, useEffect } from "react";
import { database } from "@/appwrite/clientConfig";
import conf from "@/conf/conf";
import { Query, Models } from "appwrite";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/legacy/image";
import Loadder from "./Loadder";

interface CarouselImage {
  mobile: boolean;
  desktop: boolean;
  imageUrl: string;
  imageId: string;
  order: number;
}

const ResponsiveCarousel = () => {
  const [mobileImages, setMobileImages] = useState<string[]>([]);
  const [desktopImages, setDesktopImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await database.listDocuments(
          conf.appwriteHoroscopeDatabaseId,
          conf.appwriteCrouselCollectionId,
          [Query.orderAsc("order")],
        );

        const mobileUrls: string[] = [];
        const desktopUrls: string[] = [];

        response.documents.forEach((doc: Models.Document) => {
          const carouselImage = doc as unknown as CarouselImage;
          if (carouselImage.mobile && carouselImage.imageUrl) {
            mobileUrls.push(carouselImage.imageUrl);
          }
          if (carouselImage.desktop && carouselImage.imageUrl) {
            desktopUrls.push(carouselImage.imageUrl);
          }
        });

        setMobileImages(mobileUrls);
        setDesktopImages(desktopUrls);
      } catch (err) {
        console.error("Error fetching carousel images:", err);
        setError("Failed to load carousel images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex + 1) %
          (isDesktop ? desktopImages.length : mobileImages.length),
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [isDesktop, desktopImages.length, mobileImages.length]);

  const images = isDesktop ? desktopImages : mobileImages;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  if (loading) return <Loadder />;
  if (error) return <div>Error: {error}</div>;
  if (images.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className={`relative ${isDesktop ? "h-[460px]" : "h-[386px]"}`}
        style={{
          width: isDesktop ? "1600px" : "864px",
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              layout="fill"
              objectFit="cover"
              priority={index === currentIndex}
            />
          </div>
        ))}
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          onClick={prevSlide}
        >
          <FaChevronLeft />
        </button>
        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
          onClick={nextSlide}
        >
          <FaChevronRight />
        </button>
      </div>
    </section>
  );
};

export default ResponsiveCarousel;
