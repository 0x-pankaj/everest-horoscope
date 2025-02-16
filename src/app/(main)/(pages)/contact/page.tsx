"use client";
import React, { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import toast from "react-hot-toast";
import { database } from "@/appwrite/clientConfig"; // Import databases from your Appwrite config
import { ID } from "appwrite"; // Import ID from appwrite
import conf from "@/conf/conf";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create document in Appwrite collection 
      await database.createDocument(
        conf.appwriteHoroscopeDatabaseId, // Your database ID
        conf.appwriteContactUsMessageCollectionId, // Your contact collection ID
        ID.unique(),
        {
          name: formData.name,
          email: formData.email,
          number: formData.number,
          message: formData.message,
          // createdAt: new Date().toISOString(),
        }
      );

      toast.success("Message sent successfully!");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        number: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-indigo-900 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Have questions about astrology readings or our services? We're here to
          help you find the guidance you seek.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-6">
              Get in Touch
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Mail className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">astroeverest@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Phone</h3>
                  <p className="text-gray-600">+977 9761662499</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Location</h3>
                  <p className="text-gray-600">
                    Bhudhanilakantha, Kathmandu, Nepal
                  </p>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                Working Hours
              </h3>
              <div className="space-y-2">
                <p className="text-gray-600">
                  Monday - Friday: 9:00 AM - 6:00 PM
                </p>
                <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                <p className="text-gray-600">Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-indigo-800 mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >   
                
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Number
                </label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition duration-300"
              >
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
