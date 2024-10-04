"use client"

import React, { useEffect, useState } from 'react';
import Image from "next/legacy/image";
import Link from 'next/link';
import { Query } from 'appwrite';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';

interface BlogPost {
  $id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  slug: string;
}

const BlogList: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchBlogPosts();
  }, [currentPage]);

  const fetchBlogPosts = async () => {
    try {
      const response = await database.listDocuments(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteBlogCollectionId,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(10),
          Query.offset((currentPage - 1) * 10)
        ]
      );
      setBlogPosts(response.documents as unknown as BlogPost[]);
      setTotalPages(Math.ceil(response.total / 10));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    }
  };

  const truncateExcerpt = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
  }

  return (
    <div className="bg-yellow-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-yellow-800">Our Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <h2 className="text-2xl font-semibold mb-2 text-yellow-900">{post.title}</h2>
                <p className="text-gray-600 mb-4">{truncateExcerpt(post.excerpt, 150)}</p>
                <Link href={`/blog/${post.slug}`} className="text-yellow-600 hover:text-yellow-700 transition-colors duration-300">
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`mx-1 px-4 py-2 rounded ${
                currentPage === page
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white text-yellow-500 hover:bg-yellow-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;