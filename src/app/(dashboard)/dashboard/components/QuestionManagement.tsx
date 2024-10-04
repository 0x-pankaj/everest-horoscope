// app/admin/questions/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaSpinner, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { storage } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';
import { uploadFile } from '@/lib/fileUpload';

interface Section {
  $id: string;
  name: string;
  image: string;
  questions: string[];
}

const AdminQuestionsComponent: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [newSection, setNewSection] = useState<Omit<Section, '$id'>>({ name: '', image: '', questions: [] });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/sections');
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSection = async () => {
    try {
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSection),
      });
      if (response.ok) {
        fetchSections();
        setNewSection({ name: '', image: '', questions: [] });
      }
    } catch (error) {
      console.error('Error creating section:', error);
    }
  };

  const handleUpdateSection = async () => {
    if (!editingSection) return;
    try {
      const { name, image, questions } = editingSection;
      const updatedSection = { name, image, questions };
      
      const response = await fetch(`/api/sections/${editingSection.$id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSection),
      });
      if (response.ok) {
        fetchSections();
        setEditingSection(null);
      } else {
        const errorData = await response.json();
        console.error('Error updating section:', errorData);
      }
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  const handleDeleteSection = async (id: string) => {
    try {
      const response = await fetch(`/api/sections/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchSections();
      }
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, isNewSection: boolean) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const {fileUrl} = await uploadFile(file);
      if(isNewSection) {
        setNewSection({...newSection, image: fileUrl})
      }else if (editingSection) {
        setEditingSection({...editingSection, image: fileUrl})
      }
    } catch (error) {
      console.log("Error uploading file:", error)
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Sections and Questions</h1>

      {/* Create new section */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Add New Section</h2>
        <input
          type="text"
          placeholder="Section Name"
          value={newSection.name}
          onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="file"
          onChange={(e) => handleFileUpload(e, true)}
          className="mb-2"
        />
        {newSection.image && (
          <Image src={newSection.image} alt="New section" width={100} height={100} className="mb-2" />
        )}
        <textarea
          placeholder="Questions (one per line)"
          value={newSection.questions.join('\n')}
          onChange={(e) => setNewSection({ ...newSection, questions: e.target.value.split('\n') })}
          className="w-full p-2 mb-2 border rounded"
          rows={5}
        />
        <button
          onClick={handleCreateSection}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <FaPlus className="inline mr-2" /> Add Section
        </button>
      </div>

      {/* List of existing sections */}
      {sections.map((section) => (
        <div key={section.$id} className="mb-4 p-4 border rounded">
          {editingSection && editingSection.$id === section.$id ? (
            <>
              <input
                type="text"
                value={editingSection.name}
                onChange={(e) => setEditingSection({ ...editingSection, name: e.target.value })}
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="file"
                onChange={(e) => handleFileUpload(e, false)}
                className="mb-2"
              />
              <Image src={editingSection.image} alt={editingSection.name} width={100} height={100} className="mb-2" />
              <textarea
                value={editingSection.questions.join('\n')}
                onChange={(e) => setEditingSection({ ...editingSection, questions: e.target.value.split('\n') })}
                className="w-full p-2 mb-2 border rounded"
                rows={5}
              />
              <button
                onClick={handleUpdateSection}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setEditingSection(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold">{section.name}</h3>
              <Image src={section.image} alt={section.name} width={100} height={100} className="my-2" />
              <ul className="list-disc pl-5 mb-2">
                {section.questions.map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
              </ul>
              <button
                onClick={() => setEditingSection(section)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mr-2"
              >
                <FaEdit className="inline mr-2" /> Edit
              </button>
              <button
                onClick={() => handleDeleteSection(section.$id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                <FaTrash className="inline mr-2" /> Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminQuestionsComponent;