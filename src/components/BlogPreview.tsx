import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  { id: 1, title: "10 Tips for Better Productivity", excerpt: "Boost your productivity with these simple tips...", imageUrl: "/blog1.jpg", slug: "productivity-tips" },
  { id: 2, title: "The Future of Web Development", excerpt: "Exploring upcoming trends in web technologies...", imageUrl: "/blog2.jpg", slug: "future-web-dev" },
  { id: 3, title: "Mastering React Hooks", excerpt: "A comprehensive guide to using React Hooks effectively...", imageUrl: "/blog3.jpg", slug: "react-hooks-guide" },
];

const BlogPreview: React.FC = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Latest from Our Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image src={post.imageUrl} alt={post.title} width={400} height={250} className="w-full h-48 object-cover" />
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
    </section>
  );
};

export default BlogPreview;