'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { uploadFile } from '@/lib/fileUpload';

interface Service {
  $id?: string;
  name: string;
  image: string;
  description: string;
}

const ServicesManagement: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<Service>({ name: '', image: '', description: '' });
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const response = await fetch('/api/services');
    const data = await response.json();
    setServices(data);
  };

  const handleCreate = async () => {
    await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newService),
    });
    setNewService({ name: '', image: '', description: '' });
    fetchServices();
  };

  const handleUpdate = async () => {
    if (!editingService || !editingService.$id) return;
    await fetch(`/api/services/${editingService.$id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingService),
    });
    setEditingService(null);
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    fetchServices();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, isNewService: boolean) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log("file url: ", file);
      const { fileUrl } = await uploadFile(file);
      if (isNewService) { 
        setNewService({ ...newService, image: fileUrl });
      } else if (editingService) {
        setEditingService({ ...editingService, image: fileUrl });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Services</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Add New Service</h2>
        <input
          placeholder="Name"
          value={newService.name}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="file"
          onChange={(e) => handleFileUpload(e, true)}
          className="w-full p-2 mb-2 border rounded"
        />
        {newService.image && (
          <Image src={newService.image} alt="New service" width={100} height={100} className="mb-2" />
        )}
        <textarea
          placeholder="Description"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <button 
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Add Service
        </button>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Services</h2>
        {services.map((service) => (
          <div key={service.$id} className="mb-4 p-4 border rounded">
            <h3 className="font-bold">{service.name}</h3>
            <Image src={service.image} alt={service.name} width={100} height={100} className="my-2" />
            <p>{service.description}</p>
            <div className="mt-2">
              <button 
                onClick={() => setEditingService(service)} 
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors mr-2"
              >
                Edit
              </button>
              <button 
                onClick={() => service.$id && handleDelete(service.$id)} 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2">Edit Service</h2>
            <input
              value={editingService.name}
              onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="file"
              onChange={(e) => handleFileUpload(e, false)}
              className="w-full p-2 mb-2 border rounded"
            />
            <Image src={editingService.image} alt={editingService.name} width={100} height={100} className="mb-2" />
            <textarea
              value={editingService.description}
              onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
              className="w-full p-2 mb-2 border rounded"
            />
            <button 
              onClick={handleUpdate} 
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors mr-2"
            >
              Save
            </button>
            <button 
              onClick={() => setEditingService(null)} 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;