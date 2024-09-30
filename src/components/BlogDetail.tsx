"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Query } from 'appwrite';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';

interface BlogPost {
  $id: string;
  title: string;
  content: string;
  imageUrl: string;
  slug: string;
}

const BlogDetail: React.FC = () => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const { slug } = useParams();

  useEffect(() => {
    fetchBlogPost();
  }, [slug]);

  const fetchBlogPost = async () => {
    try {
      const response = await database.listDocuments(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteBlogCollectionId,
        [Query.equal('slug', slug)]
      );
      if (response.documents.length > 0) {
        setPost(response.documents[0] as unknown as BlogPost);
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-yellow-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <article className="bg-white rounded-lg shadow-md overflow-hidden max-w-3xl mx-auto">
          <div className="relative h-64">
            <Image 
              src={post.imageUrl} 
              alt={post.title} 
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4 text-yellow-900">{post.title}</h1>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;