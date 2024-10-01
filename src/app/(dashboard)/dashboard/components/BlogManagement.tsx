"use client"

import React, { useEffect, useState, useRef } from 'react';
import { ID, Query } from 'appwrite';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { Editor } from "@tinymce/tinymce-react";
import { uploadFile } from '@/lib/fileUpload';
import Image from 'next/image';

interface BlogPost {
  $id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  slug: string;
}

const BlogAdmin: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    slug: '',
  });

  const editorRef = useRef<any>(null);

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

  const handleCreate = async () => {
    try {
      const content = editorRef.current?.getContent();
      await database.createDocument(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteBlogCollectionId,
        ID.unique(),
        { ...newPost, content }
      );
      setNewPost({ title: '', excerpt: '', content: '', imageUrl: '', slug: '' });
      fetchBlogPosts();
    } catch (error) {
      console.error('Error creating blog post:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingPost) return;
    try {
      const content = editorRef.current?.getContent();
      await database.updateDocument(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteBlogCollectionId,
        editingPost.$id,
        { ...editingPost, content }
      );
      setEditingPost(null);
      fetchBlogPosts();
    } catch (error) {
      console.error('Error updating blog post:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await database.deleteDocument(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteBlogCollectionId,
        id
      );
      fetchBlogPosts();
    } catch (error) {
      console.error('Error deleting blog post:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, isNewService: boolean) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log("file url: ", file);
      const { fileUrl } = await uploadFile(file);
      if (isNewService) { 
        setNewPost({ ...newPost, imageUrl: fileUrl });
      } else if (editingPost) {
        setEditingPost({ ...editingPost, imageUrl: fileUrl });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Admin</h1>
      
      {/* Create new post form */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Create New Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          placeholder="Slug must be unique and - seperated"
          value={newPost.slug}
          onChange={(e) => setNewPost({ ...newPost, slug: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        {/* <input
          type="text"
          placeholder="Image URL"
          value={newPost.imageUrl}
          onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        /> */}
          <input
          type="file"
          onChange={(e) => handleFileUpload(e, true)}
          className="w-full p-2 mb-2 border rounded"
        />
        {newPost.imageUrl && (
          <Image src={newPost.imageUrl} alt="New Post" width={100} height={100} className="mb-2" />
        )}
        <textarea
          placeholder="Excerpt"
          value={newPost.excerpt}
          onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          rows={3}
        />
        <Editor
          apiKey= {conf.tinymceApiKey}
          onInit={(evt, editor) => editorRef.current = editor}
          initialValue="<p>Write your blog post content here.</p>"
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
        />
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
        >
          Create Post
        </button>
      </div>

      {/* List of existing posts */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Posts</h2>
        {blogPosts.map((post) => (
          <div key={post.$id} className="mb-4 p-4 border rounded">
            <h3 className="font-bold">{post.title}</h3>
            <p className="text-sm text-gray-500 mb-2">Slug: {post.slug}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingPost(post)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.$id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`mx-1 px-4 py-2 rounded ${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-white text-blue-500 hover:bg-blue-100'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Edit post modal */}
      {editingPost && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
    <div className="bg-white rounded-lg p-8 max-w-2xl w-full my-8">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        <input
          type="text"
          value={editingPost.title}
          onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          value={editingPost.slug}
          onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          value={editingPost.imageUrl}
          onChange={(e) => setEditingPost({ ...editingPost, imageUrl: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          value={editingPost.excerpt}
          onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
          rows={3}
        />
        <Editor
          apiKey="YOUR_TINYMCE_API_KEY"
          onInit={(evt, editor) => editorRef.current = editor}
          initialValue={editingPost.content}
          init={{
            height: 400, // Reduced height
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
        />
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={handleUpdate}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Save Changes
        </button>
        <button
          onClick={() => setEditingPost(null)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default BlogAdmin;