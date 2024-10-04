'use client'

import React, { useState, useEffect } from 'react';

interface Testimonial {
  $id: string;
  text: string;
  author: string;
}

const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newTestimonial, setNewTestimonial] = useState({ text: '', author: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      const data = await response.json();
      setTestimonials(data);
      setIsLoading(false);
    } catch (err) {
      setError('Error loading testimonials');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonial),
      });
      if (!response.ok) {
        throw new Error('Failed to add testimonial');
      }
      await fetchTestimonials();
      setNewTestimonial({ text: '', author: '' });
      alert('Testimonial added successfully');
    } catch (error) {
      alert('Failed to add testimonial');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/testimonials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete testimonial');
      }
      await fetchTestimonials();
      alert('Testimonial deleted successfully');
    } catch (error) {
      alert('Failed to delete testimonial');
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading testimonials...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Testimonials</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newTestimonial.text}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
          placeholder="Testimonial text"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <input
          type="text"
          value={newTestimonial.author}
          onChange={(e) => setNewTestimonial({ ...newTestimonial, author: e.target.value })}
          placeholder="Author"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Testimonial
        </button>
      </form>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <div key={testimonial.$id} className="border rounded p-4">
            <h3 className="font-bold">{testimonial.author}</h3>
            <p className="mt-2">{testimonial.text}</p>
            <button
              onClick={() => handleDelete(testimonial.$id)}
              className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTestimonials;