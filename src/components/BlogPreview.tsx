"use client"


import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {  Query } from 'appwrite';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';

interface BlogPost {
  $id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  slug: string;
}

const BlogPreview: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await database.listDocuments(
          conf.appwriteHoroscopeDatabaseId,
          conf.appwriteBlogCollectionId,
          [
            Query.orderDesc('$createdAt'),
            Query.limit(20) // Increased limit for more posts
          ]
        );
        setBlogPosts(response.documents as unknown as BlogPost[]);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchBlogPosts();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });

      // Update current index
      const newIndex = direction === 'left' ? Math.max(0, currentIndex - 1) : Math.min(blogPosts.length - 1, currentIndex + 1);
      setCurrentIndex(newIndex);
    }
  };

  const truncateExcert = (text: string, maxLength: number) => {
    if(text.length <= maxLength) return text;
    return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
  }

  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Latest from Our Blog</h2>
        <div className="relative">
          <div 
            ref={scrollRef}
            className="overflow-x-auto flex snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {blogPosts.map((post, index) => (
              <div 
                key={post.$id} 
                className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 snap-start px-4"
              >
                <article className="bg-white rounded-lg shadow-md overflow-hidden h-full">
                  <div className="relative h-48">
                    <Image 
                      src={post.imageUrl} 
                      alt={post.title} 
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{truncateExcert(post.excerpt, 100)}</p>
                    <Link href={`/blog/${post.slug}`} className="text-blue-500 hover:text-blue-600 transition-colors duration-300">
                      Read More →
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button 
            onClick={() => scroll('left')} 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
            disabled={currentIndex === 0}
          >
            <FiChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
            disabled={currentIndex === blogPosts.length - 1}
          >
            <FiChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;






/*
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Client, Databases, Query } from 'appwrite';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';

interface BlogPost {
  $id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  slug: string;
}

const BlogPreview: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);



  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await database.listDocuments(
          conf.appwriteHoroscopeDatabaseId,
          conf.appwriteBlogCollectionId,
          [
            Query.orderDesc('$createdAt'),
            Query.limit(10)
          ]
        );
        console.log("blogPost: ", response);
        setBlogPosts(response.documents as unknown as BlogPost[]);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Latest from Our Blog</h2>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white pointer-events-none" />
          <div className="overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
              {blogPosts.map((post) => (
                <article key={post.$id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48">
                    <Image 
                      src={post.imageUrl} 
                      alt={post.title} 
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="text-blue-500 hover:text-blue-600 transition-colors duration-300">
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;

*/