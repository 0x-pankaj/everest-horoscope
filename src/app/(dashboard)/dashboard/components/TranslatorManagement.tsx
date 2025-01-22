"use client";
import React, { useState, useEffect } from "react";
import { FaUser, FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { useRouter } from "next/navigation";

interface Translator {
  $id: string;
  name: string;
  user_id: string;
  languages: string[];
}

const initialTranslatorState: Omit<Translator, "$id"> = {
  name: "",
  user_id: "",
  languages: [],
};

export default function TranslatorManagement() {
  const [translators, setTranslators] = useState<Translator[]>([]);
  const [currentTranslator, setCurrentTranslator] = useState<
    Omit<Translator, "$id">
  >(initialTranslatorState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<
    string | null
  >(null);
  const router = useRouter();

  useEffect(() => {
    fetchTranslators();
  }, []);

  const fetchTranslators = async () => {
    try {
      const response = await fetch("/api/translators");
      if (!response.ok) throw new Error("Failed to fetch translators");
      const data = await response.json();
      console.log("data: ", data);
      setTranslators(data);
    } catch (error) {
      console.error("Error fetching translators:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentTranslator((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const values = e.target.value.split(",").map((item) => item.trim());
    setCurrentTranslator((prev) => ({ ...prev, language: values }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = "/api/translators";
      const method = isEditing ? "PUT" : "POST";
      const body = isEditing
        ? { ...currentTranslator, $id: (currentTranslator as Translator).$id }
        : currentTranslator;

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save translator");
      }

      setIsModalOpen(false);
      setCurrentTranslator(initialTranslatorState);
      setIsEditing(false);
      fetchTranslators();
    } catch (error: any) {
      console.error("Error saving translator:", error);
      alert(error.message);
    }
  };

  const deleteTranslator = async (id: string) => {
    try {
      const response = await fetch("/api/translators", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete translator");

      fetchTranslators();
      setDeleteConfirmationId(null);
    } catch (error) {
      console.error("Error deleting translator:", error);
      alert("Failed to delete translator");
    }
  };

  const editTranslator = (translator: Translator) => {
    setCurrentTranslator(translator);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Translator Management
      </h1>

      <button
        onClick={() => {
          setCurrentTranslator(initialTranslatorState);
          setIsEditing(false);
          setIsModalOpen(true);
        }}
        className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
      >
        <FaPlus className="mr-2" />
        Add New Translator
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {translators.map((translator) => (
          <div
            key={translator.$id}
            className="bg-white shadow-lg rounded-lg p-6"
          >
            <div className="flex items-center mb-4">
              <FaUser className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <h2 className="text-xl font-semibold">{translator.name}</h2>
                <p className="text-gray-600">ID: {translator.user_id}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Languages: {translator.languages.join(", ")}
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => editTranslator(translator)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <FaEdit className="mr-2" />
                Edit
              </button>

              <button
                onClick={() => router.push(`/translator/${translator.user_id}`)}
                className="bg-purple-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded inline-flex items-center m-2"
              >
                <FaMessage className="mr-2" />
                Get Translator Messages
              </button>

              <button
                onClick={() => setDeleteConfirmationId(translator.$id)}
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
            <h3 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Translator" : "Add New Translator"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={currentTranslator.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="userId"
                  className="block text-sm font-medium text-gray-700"
                >
                  User ID
                </label>
                <input
                  id="user_id"
                  name="user_id"
                  type="text"
                  value={currentTranslator.user_id}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-gray-700"
                >
                  Languages (comma separated)
                </label>
                <input
                  id="languages"
                  name="languages"
                  type="text"
                  value={currentTranslator.languages.join(", ")}
                  onChange={handleLanguageChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
            <h3 className="text-lg font-semibold mb-4">Delete Confirmation</h3>
            <p className="text-gray-700">
              Are you sure you want to delete this translator?
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setDeleteConfirmationId(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteTranslator(deleteConfirmationId)}
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
