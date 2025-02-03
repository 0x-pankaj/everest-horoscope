"use client";
import React, { useState, useEffect } from "react";
import { FaUser, FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import Image from "next/legacy/image";
import { uploadFile } from "@/lib/fileUpload";

interface Astrologer {
  $id: string;
  name: string;
  email: string;
  photoUrl: string;
  bio: string;
  specialties: string[];
  rating?: number;
  experience?: number;
  hourlyRate?: number;
  isOnline: boolean;
  language: string[];
  user_id?: string;
}

const initialAstrologerState: Omit<Astrologer, "$id"> = {
  name: "",
  photoUrl: "",
  bio: "",
  rating: 0,
  experience: 0,
  hourlyRate: 0,
  isOnline: false,
  specialties: [],
  language: [],
  email: "",
  user_id: "",
};

export default function AstroManagement() {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [currentAstrologer, setCurrentAstrologer] = useState<
    Omit<Astrologer, "$id">
  >(initialAstrologerState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<
    string | null
  >(null);
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    fetchAstrologers();
  }, []);

  const fetchAstrologers = async () => {
    try {
      const response = await fetch("/api/astrologers");
      if (!response.ok) throw new Error("Failed to fetch astrologers");
      const data = await response.json();
      setAstrologers(data);
    } catch (error) {
      console.error("Error fetching astrologers:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCurrentAstrologer((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "specialties" | "language",
  ) => {
    const values = e.target.value.split(",").map((item) => item.trim());
    setCurrentAstrologer((prev) => ({ ...prev, [field]: values }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { fileUrl } = await uploadFile(file);
      setCurrentAstrologer((prev) => ({ ...prev, photoUrl: fileUrl }));
      setPreviewImage(URL.createObjectURL(file)); // Show local preview
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = "/api/astrologers";
      const method = isEditing ? "PUT" : "POST";
      const body = isEditing
        ? { ...currentAstrologer, $id: (currentAstrologer as Astrologer).$id }
        : currentAstrologer;

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save astrologer");
      }

      setIsModalOpen(false);
      setCurrentAstrologer(initialAstrologerState);
      setIsEditing(false);
      setPreviewImage("");
      fetchAstrologers();
    } catch (error: any) {
      console.error("Error saving astrologer:", error);
      alert(error.message);
    }
  };

  const deleteAstrologer = async (id: string) => {
    try {
      const response = await fetch("/api/astrologers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete astrologer");

      fetchAstrologers();
      setDeleteConfirmationId(null);
    } catch (error) {
      console.error("Error deleting astrologer:", error);
      alert("Failed to delete astrologer");
    }
  };

  const editAstrologer = (astro: Astrologer) => {
    setCurrentAstrologer(astro);
    setIsEditing(true);
    setPreviewImage(astro.photoUrl);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-yellow-50">
      <h1 className="text-3xl font-bold mb-8 text-center text-yellow-800">
        Astrologer Management
      </h1>

      <button
        onClick={() => {
          setCurrentAstrologer(initialAstrologerState);
          setIsEditing(false);
          setPreviewImage("");
          setIsModalOpen(true);
        }}
        className="mb-4 w-full md:w-auto bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
      >
        <FaPlus className="mr-2" />
        Add New Astrologer
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {astrologers.map((astro) => (
          <div
            key={astro.$id}
            className="bg-white shadow-lg rounded-lg p-6 border border-yellow-200"
          >
            <div className="flex items-center mb-4">
              <div className="relative w-16 h-16 mr-4">
                <Image
                  src={astro.photoUrl}
                  alt={astro.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-yellow-800">
                  {astro.name}
                </h2>
                <p className="text-yellow-600">Email: {astro.email}</p>
                <p> UserId: {astro.user_id}</p>
              </div>
            </div>
            <p className="text-yellow-700 mb-2">{astro.bio}</p>
            <p className="text-yellow-700 mb-2">
              Specialties: {astro.specialties.join(", ")}
            </p>
            <p className="text-yellow-700 mb-2">Rating: {astro.rating}</p>
            <p className="text-yellow-700 mb-2">
              Experience: {astro.experience} years
            </p>
            <p className="text-yellow-700 mb-2">
              Hourly Rate: ${astro.hourlyRate}
            </p>
            <p className="text-yellow-700 mb-2">
              Status: {astro.isOnline ? "Online" : "Offline"}
            </p>
            <p className="text-yellow-700 mb-4">
              Languages: {astro.language.join(", ")}
            </p>
            <div className="flex justify-between">
              ``
              <button
                onClick={() => editAstrologer(astro)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <FaEdit className="mr-2" />
                Edit
              </button>
              <button
                onClick={() => setDeleteConfirmationId(astro.$id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <FaTrash className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800">
              {isEditing ? "Edit Astrologer" : "Add New Astrologer"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-yellow-700">
                  Profile Photo
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-yellow-700
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-yellow-50 file:text-yellow-700
                    hover:file:bg-yellow-100"
                />
                {(previewImage || currentAstrologer.photoUrl) && (
                  <div className="mt-2 relative w-32 h-32">
                    <Image
                      src={previewImage || currentAstrologer.photoUrl}
                      alt="Preview"
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-yellow-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={currentAstrologer.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="user_id"
                  className="block text-sm font-medium text-yellow-700"
                >
                  User ID
                </label>
                <input
                  id="user_id"
                  name="user_id"
                  type="text"
                  value={currentAstrologer.user_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-yellow-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={currentAstrologer.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="photoUrl"
                  className="block text-sm font-medium text-yellow-700"
                >
                  Photo URL
                </label>
                <input
                  id="photoUrl"
                  name="photoUrl"
                  type="text"
                  value={currentAstrologer.photoUrl}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-yellow-700"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={currentAstrologer.bio}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="specialties"
                  className="block text-sm font-medium text-yellow-700"
                >
                  Specialties (comma separated)
                </label>
                <input
                  id="specialties"
                  name="specialties"
                  type="text"
                  value={currentAstrologer.specialties.join(", ")}
                  onChange={(e) => handleArrayInputChange(e, "specialties")}
                  className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-yellow-700"
                >
                  Rating
                </label>
                <input
                  id="rating"
                  name="rating"
                  type="number"
                  value={currentAstrologer.rating}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-medium text-yellow-700"
                >
                  Experience (years)
                </label>
                <input
                  id="experience"
                  name="experience"
                  type="number"
                  value={currentAstrologer.experience}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="hourlyRate"
                  className="block text-sm font-medium text-yellow-700"
                >
                  Hourly Rate ($)
                </label>
                <input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  value={currentAstrologer.hourlyRate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="isOnline"
                  className="block text-sm font-medium text-yellow-700"
                >
                  Is Online?
                </label>
                <input
                  id="isOnline"
                  name="isOnline"
                  type="checkbox"
                  checked={currentAstrologer.isOnline}
                  onChange={(e) =>
                    setCurrentAstrologer((prev) => ({
                      ...prev,
                      isOnline: e.target.checked,
                    }))
                  }
                  className="mt-1 rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-yellow-700"
                >
                  Languages (comma separated)
                </label>
                <input
                  id="language"
                  name="language"
                  type="text"
                  value={currentAstrologer.language?.join(", ") || ""}
                  onChange={(e) => handleArrayInputChange(e, "language")}
                  className="mt-1 block w-full rounded-md border-yellow-300 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
                />
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setPreviewImage("");
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                >
                  {isEditing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmationId && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-semibold mb-4 text-yellow-800">
              Delete Confirmation
            </h3>
            <p className="text-yellow-700">
              Are you sure you want to delete this astrologer?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setDeleteConfirmationId(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteAstrologer(deleteConfirmationId)}
                className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
