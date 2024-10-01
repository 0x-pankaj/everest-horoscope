'use client'
import React, { useState, useEffect } from 'react';
import { database, storage } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { Query, ID } from 'appwrite';
import { FaTrash, FaEdit, FaMobile, FaDesktop } from 'react-icons/fa';

interface CarouselImage {
  $id: string;
  mobile: boolean;
  desktop: boolean;
  imageUrl: string;
  imageId: string;
  order: number;
}

const AdminCarouselManager: React.FC = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [editingImage, setEditingImage] = useState<CarouselImage | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [order, setOrder] = useState(0);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await database.listDocuments(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteCrouselCollectionId,
        [Query.orderAsc('order')]
      );
      console.log("response: ", response)
      setImages(response.documents as unknown as CarouselImage[]);
    } catch (err) {
      console.error('Error fetching carousel images:', err);
      setError('Failed to load carousel images');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const addImage = async () => {
    if (!newImage) return;

    try {
      const uploadedFile = await storage.createFile(conf.appwriteHoroscopeBucket, ID.unique(), newImage);
      const imageUrl = storage.getFileView(conf.appwriteHoroscopeBucket, uploadedFile.$id).href;

      await database.createDocument(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteCrouselCollectionId,
        ID.unique(),
        {
          mobile: isMobile,
          desktop: isDesktop,
          imageUrl,
          imageId: uploadedFile.$id,
          order
        }
      );

      fetchImages();
      resetForm();
    } catch (err) {
      console.error('Error adding image:', err);
      setError('Failed to add image');
    }
  };

  const updateImage = async () => {
    if (!editingImage) return;

    try {
      await database.updateDocument(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteCrouselCollectionId,
        editingImage.$id,
        {
          mobile: isMobile,
          desktop: isDesktop,
          order
        }
      );

      fetchImages();
      resetForm();
    } catch (err) {
      console.error('Error updating image:', err);
      setError('Failed to update image');
    }
  };

  const deleteImage = async (image: CarouselImage) => {
    try {
      await storage.deleteFile(conf.appwriteHoroscopeBucket, image.imageId);
      await database.deleteDocument(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteCrouselCollectionId,
        image.$id
      );
      fetchImages();
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image');
    }
  };

  const resetForm = () => {
    setNewImage(null);
    setEditingImage(null);
    setIsMobile(false);
    setIsDesktop(false);
    setOrder(0);
  };

  const startEditing = (image: CarouselImage) => {
    setEditingImage(image);
    setIsMobile(image.mobile);
    setIsDesktop(image.desktop);
    setOrder(image.order);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Carousel Image Manager</h1>
      
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">
          {editingImage ? 'Edit Image' : 'Add New Image'}
        </h2>
        {!editingImage && (
          <input 
            type="file" 
            onChange={handleImageUpload} 
            className="mb-2"
          />
        )}
        <div className="flex items-center mb-2">
          <label className="mr-4">
            <input 
              type="checkbox" 
              checked={isMobile} 
              onChange={(e) => setIsMobile(e.target.checked)}
            /> Mobile
          </label>
          <label>
            <input 
              type="checkbox" 
              checked={isDesktop} 
              onChange={(e) => setIsDesktop(e.target.checked)}
            /> Desktop
          </label>
        </div>
        <input 
          type="number" 
          value={order} 
          onChange={(e) => setOrder(Number(e.target.value))}
          placeholder="Order"
          className="mb-2 p-2 border rounded"
        />
        <button 
          onClick={editingImage ? updateImage : addImage}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          {editingImage ? 'Update' : 'Add'}
        </button>
        {editingImage && (
          <button 
            onClick={resetForm}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.$id} className="border p-4 rounded">
            <img 
              src={image.imageUrl} 
              alt="Carousel image" 
              className="w-full h-40 object-cover mb-2"
            />
            <p>Order: {image.order}</p>
            <div className="flex items-center mb-2">
              <FaMobile className={`mr-2 ${image.mobile ? 'text-green-500' : 'text-gray-300'}`} />
              <FaDesktop className={image.desktop ? 'text-green-500' : 'text-gray-300'} />
            </div>
            <div className="flex justify-between">
              <button 
                onClick={() => startEditing(image)}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                <FaEdit />
              </button>
              <button 
                onClick={() => deleteImage(image)}
                className="bg-red-500 text-white p-2 rounded"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCarouselManager;