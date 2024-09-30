"use client"
import React, { useState, useEffect } from 'react';
import { FaCalendarPlus, FaEdit, FaTrash } from 'react-icons/fa';

interface PanchangFormData {
  date: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  firstKarana: string;
  secondKarana: string;
  vaar: string;
  rahuKalam: string;
}

interface PanchangDocument extends PanchangFormData {
  $id: string;
}

const AdminPanchangForm: React.FC = () => {
  const [formData, setFormData] = useState<PanchangFormData>({
    date: '',
    tithi: '',
    nakshatra: '',
    yoga: '',
    firstKarana: '',
    secondKarana: '',
    vaar: '',
    rahuKalam: '',
  });
  const [panchangs, setPanchangs] = useState<PanchangDocument[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPanchangs();
  }, [page]);

  const fetchPanchangs = async () => {
    try {
      const response = await fetch(`/api/panchang?page=${page}`);
      if (response.ok) {
        const data = await response.json();
        setPanchangs(data.documents);
        setTotalPages(Math.ceil(data.total / 10));
      } else {
        throw new Error('Failed to fetch panchangs');
      }
    } catch (error) {
      console.error('Error fetching panchangs:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/panchang/${editingId}` : '/api/panchang';
      const method = editingId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert(editingId ? 'Panchang updated successfully!' : 'Panchang added successfully!');
        setFormData({
          date: '',
          tithi: '',
          nakshatra: '',
          yoga: '',
          firstKarana: '',
          secondKarana: '',
          vaar: '',
          rahuKalam: '',
        });
        setEditingId(null);
        fetchPanchangs();
      } else {
        throw new Error(editingId ? 'Failed to update panchang' : 'Failed to add panchang');
      }
    } catch (error) {
      alert('Error processing panchang');
    }
  };

  const handleEdit = (panchang: PanchangDocument) => {
    setFormData({
      date: panchang.date.split('T')[0], // Trim the date
      tithi: panchang.tithi,
      nakshatra: panchang.nakshatra,
      yoga: panchang.yoga,
      firstKarana: panchang.firstKarana,
      secondKarana: panchang.secondKarana,
      vaar: panchang.vaar,
      rahuKalam: panchang.rahuKalam,
    });
    setEditingId(panchang.$id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this panchang?')) {
      try {
        const response = await fetch(`/api/panchang/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Panchang deleted successfully!');
          fetchPanchangs();
        } else {
          throw new Error('Failed to delete panchang');
        }
      } catch (error) {
        alert('Error deleting panchang');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <FaCalendarPlus className="mr-2" />
        {editingId ? 'Edit Panchang' : 'Add Today\'s Panchang'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key}>
            <label htmlFor={key} className="block text-sm font-medium text-gray-700">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              type={key === 'date' ? 'date' : 'text'}
              id={key}
              name={key}
              value={value}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          {editingId ? 'Update Panchang' : 'Add Panchang'}
        </button>
      </form>

      <h3 className="text-xl font-bold mt-8 mb-4">Available Panchangs</h3>
      <div className="space-y-4">
        {panchangs.map((panchang) => (
          <div key={panchang.$id} className="flex items-center justify-between bg-gray-100 p-4 rounded-md">
            <div>
              <p className="font-semibold">{panchang.date.split('T')[0]}</p>
              <p>{panchang.tithi} - {panchang.nakshatra}</p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(panchang)}
                className="mr-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(panchang.$id)}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-purple-600 text-white px-4 py-2 rounded-l-lg disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="bg-purple-100 text-purple-800 px-4 py-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="bg-purple-600 text-white px-4 py-2 rounded-r-lg disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPanchangForm;