
// import React, { useState, useEffect } from 'react';
// import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
// // import { database, storage } from '@/appwrite/clientConfig';
// import { database } from '@/appwrite/clientConfig';
// import conf from '@/conf/conf';
// import { ID, Query } from 'appwrite';

// interface Blog {
//   $id: string;
//   title: string;
//   excerpt: string;
//   slug: string;
//   imageUrl: string;
// }

// const initialBlogState: Omit<Blog, '$id'> = {
//   title: '',
//   excerpt: '',
//   slug: '',
//   imageUrl: '',
// };

// export default function BlogManagement() {
//     const [blogs, setBlogs] = useState<Blog[]>([]);
//     const [currentBlog, setCurrentBlog] = useState<Omit<Blog, '$id'>>(initialBlogState);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isEditing, setIsEditing] = useState(false);
//     const [imageFile, setImageFile] = useState<File | null>(null);

//     useEffect(() => {
//         fetchBlogs();
//     }, []);

//     const fetchBlogs = async () => {
//         try {
//             const response = await database.listDocuments(
//                 conf.appwriteHoroscopeDatabaseId,
//                 conf.appwriteBlogCollectionId,
//                 [Query.orderDesc('$createdAt')]
//             );
//             setBlogs(response.documents as unknown as Blog[]);
//         } catch (error) {
//             console.error('Error fetching blogs:', error);
//         }
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setCurrentBlog(prev => ({ ...prev, [name]: value }));
//     };

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             setImageFile(e.target.files[0]);
//         }
//     };

//     const uploadImage = async (): Promise<string> => {
//         if (!imageFile) return '';

//         try {
//             const response = await storage.createFile(
//                 conf.appwriteBlogBucketId,
//                 ID.unique(),
//                 imageFile
//             );
//             const fileUrl = storage.getFileView(conf.appwriteBlogBucketId, response.$id);
//             return fileUrl.href;
//         } catch (error) {
//             console.error('Error uploading image:', error);
//             return '';
//         }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         try {
//             let imageUrl = currentBlog.imageUrl;
//             if (imageFile) {
//                 imageUrl = await uploadImage();
//             }

//             const blogData = { ...currentBlog, imageUrl };

//             if (isEditing) {
//                 await database.updateDocument(
//                     conf.appwriteBlogDatabaseId,
//                     conf.appwriteBlogCollectionId,
//                     currentBlog.slug,
//                     blogData
//                 );
//             } else {
//                 await database.createDocument(
//                     conf.appwriteBlogDatabaseId,
//                     conf.appwriteBlogCollectionId,
//                     ID.unique(),
//                     blogData
//                 );
//             }
//             setIsModalOpen(false);
//             setCurrentBlog(initialBlogState);
//             setIsEditing(false);
//             setImageFile(null);
//             fetchBlogs();
//         } catch (error) {
//             console.error('Error saving blog:', error);
//         }
//     };

//     const deleteBlog = async (id: string) => {
//         try {
//             await database.deleteDocument(
//                 conf.appwriteBlogDatabaseId,
//                 conf.appwriteBlogCollectionId,
//                 id
//             );
//             fetchBlogs();
//         } catch (error) {
//             console.error('Error deleting blog:', error);
//         }
//     };

//     const editBlog = (blog: Blog) => {
//         setCurrentBlog(blog);
//         setIsEditing(true);
//         setIsModalOpen(true);
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-8 text-center">Blog Management</h1>
            
//             <div className="mb-4 text-right">
//                 <button
//                     onClick={() => {
//                         setCurrentBlog(initialBlogState);
//                         setIsEditing(false);
//                         setIsModalOpen(true);
//                     }}
//                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
//                 >
//                     <FaPlus className="mr-2" />
//                     Add New Blog
//                 </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {blogs.map((blog) => (
//                     <div key={blog.$id} className="bg-white shadow-lg rounded-lg overflow-hidden">
//                         <img src={blog.imageUrl} alt={blog.title} className="w-full h-48 object-cover" />
//                         <div className="p-6">
//                             <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
//                             <p className="text-gray-600 mb-4">{blog.excerpt}</p>
//                             <p className="text-gray-500 mb-4">Slug: {blog.slug}</p>
//                             <div className="flex justify-between">
//                                 <button
//                                     onClick={() => editBlog(blog)}
//                                     className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
//                                 >
//                                     <FaEdit className="mr-2" />
//                                     Edit
//                                 </button>
//                                 <button
//                                     onClick={() => deleteBlog(blog.$id)}
//                                     className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
//                                 >
//                                     <FaTrash className="mr-2" />
//                                     Delete
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
//                     <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
//                         <h3 className="text-lg font-semibold mb-4">{isEditing ? 'Edit Blog' : 'Add New Blog'}</h3>
//                         <form onSubmit={handleSubmit}>
//                             <input
//                                 type="text"
//                                 name="title"
//                                 placeholder="Title"
//                                 value={currentBlog.title}
//                                 onChange={handleInputChange}
//                                 className="w-full p-2 mb-4 border rounded"
//                                 required
//                             />
//                             <textarea
//                                 name="excerpt"
//                                 placeholder="Excerpt"
//                                 value={currentBlog.excerpt}
//                                 onChange={handleInputChange}
//                                 className="w-full p-2 mb-4 border rounded"
//                                 required
//                             />
//                             <input
//                                 type="text"
//                                 name="slug"
//                                 placeholder="Slug"
//                                 value={currentBlog.slug}
//                                 onChange={handleInputChange}
//                                 className="w-full p-2 mb-4 border rounded"
//                                 required
//                             />
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleImageChange}
//                                 className="w-full p-2 mb-4 border rounded"
//                             />
//                             {currentBlog.imageUrl && (
//                                 <img src={currentBlog.imageUrl} alt="Current" className="w-full h-32 object-cover mb-4" />
//                             )}
//                             <div className="flex justify-end">
//                                 <button
//                                     type="button"
//                                     onClick={() => setIsModalOpen(false)}
//                                     className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                                 >
//                                     {isEditing ? 'Update' : 'Add'} Blog
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

export default function BlogManagement() {
    return (
        <div>
            Blog BlogManagement
        </div>
    )
}