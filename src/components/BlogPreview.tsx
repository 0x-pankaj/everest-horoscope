"use client"

import React, { useEffect, useState, useRef } from 'react';
import Image from "next/legacy/image";
import Link from 'next/link';
import { Query } from 'appwrite';
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
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await database.listDocuments(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteBlogCollectionId,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(20)
        ]
      );
      setBlogPosts(response.documents as unknown as BlogPost[]);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });

      const newIndex = direction === 'left' ? Math.max(0, currentIndex - 1) : Math.min(blogPosts.length - 1, currentIndex + 1);
      setCurrentIndex(newIndex);
    }
  };

  const truncateExcerpt = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
  }

  return (
    <section className="py-12 relative bg-yellow-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-yellow-800">Latest from Our Blog</h2>
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
                    <h3 className="text-xl font-semibold mb-2 text-yellow-900">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{truncateExcerpt(post.excerpt, 100)}</p>
                    <Link href={`/blog/${post.slug}`} className="text-yellow-600 hover:text-yellow-700 transition-colors duration-300">
                      Read More →
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => scroll('left')} 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-yellow-600"
            disabled={currentIndex === 0}
          >
            <FiChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md text-yellow-600"
            disabled={currentIndex === blogPosts.length - 1}
          >
            <FiChevronRight size={24} />
          </button>
        </div>
        <div className="text-center mt-8">
          <Link href="/blog" className="bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-600 transition-colors duration-300">
            See All Posts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;