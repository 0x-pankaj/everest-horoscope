"use client";
import React, { useState, useEffect } from "react";
import { FaUser, FaStar, FaChevronLeft, FaClock } from "react-icons/fa";
import axios from "axios";
import { database } from "@/appwrite/clientConfig";
import conf from "@/conf/conf";
import { Query, Models } from "appwrite";

interface Astrologer {
  $id: string;
  name: string;
  user_id: string;
  specialties: string[];
  rating?: number;
}

interface AstroMessage {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $collectionId: string;
  $databaseId: string;
  sender_id: string;
  receiver_id: string;
  body: string;
}

export default function AstrologerChatManagement() {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [selectedAstrologer, setSelectedAstrologer] =
    useState<Astrologer | null>(null);
  const [astroMessages, setAstroMessages] = useState<AstroMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState<number>(0);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Date filter state
  const [dateFilter, setDateFilter] = useState<string>("");

  useEffect(() => {
    fetchAstrologers();
  }, []);

  useEffect(() => {
    if (selectedAstrologer) {
      fetchAstrologerMessages(selectedAstrologer.user_id, currentPage);
    }
  }, [currentPage, dateFilter]); // Refetch when page or date filter changes

  const fetchAstrologers = async () => {
    try {
      const response = await axios.get("/api/astrologers");
      setAstrologers(response.data);
    } catch (error) {
      console.error("Error fetching astrologers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAstrologerMessages = async (
    astrologerId: string,
    page: number,
  ) => {
    setLoading(true);
    try {
      const queries: any[] = [
        Query.equal("sender_id", [astrologerId]),
        Query.equal("is_temp", false),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
        Query.offset(page * limit),
      ];

      // Add date filter if selected
      if (dateFilter) {
        queries.push(Query.lessThanEqual("$createdAt", dateFilter));
      }

      const response = await database.listDocuments<AstroMessage>(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteMessageCollectionId,
        queries,
      );

      setTotal(response.total);
      setTotalPages(Math.ceil(response.total / limit));
      setAstroMessages(response.documents);
    } catch (error) {
      console.error("Error fetching astrologer messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAstrologerSelect = async (astrologer: Astrologer) => {
    setSelectedAstrologer(astrologer);
    setCurrentPage(0); // Reset to first page
    await fetchAstrologerMessages(astrologer.user_id, 0);
  };

  const handleDateFilterChange = (date: string) => {
    setDateFilter(date);
    setCurrentPage(0); // Reset to first page when filter changes
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const renderPagination = () => {
    return (
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
          }
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        {selectedAstrologer ? (
          <>
            <button
              onClick={() => {
                setSelectedAstrologer(null);
                setAstroMessages([]);
                setDateFilter("");
              }}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <FaChevronLeft className="mr-2" />
              Back to Astrologers
            </button>
            <div className="flex items-center gap-4">
              <label className="text-gray-600">Filter by date:</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => handleDateFilterChange(e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
            </div>
          </>
        ) : (
          <h1 className="text-3xl font-bold">Astrologer Management</h1>
        )}
      </div>

      {!selectedAstrologer ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {astrologers.map((astrologer) => (
            <div
              key={astrologer.$id}
              className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleAstrologerSelect(astrologer)}
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <FaUser className="text-purple-500 text-xl" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold">{astrologer.name}</h2>
                  <p className="text-gray-600">ID: {astrologer.user_id}</p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Specialities:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {astrologer.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center"
                    >
                      <FaStar className="mr-1" />
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              {selectedAstrologer.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-gray-600">Total Messages: {total}</p>
              {dateFilter && (
                <p className="text-gray-600">
                  Filtered up to: {new Date(dateFilter).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {astroMessages.map((message) => (
            <div
              key={message.$createdAt}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <FaClock className="mr-1" />
                  {formatDate(message.$createdAt)}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded mb-4">
                <div className="text-gray-800">{message.body}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>Sender: {message.sender_id}</div>
                <div>Receiver: {message.receiver_id}</div>
              </div>
            </div>
          ))}

          {astroMessages.length === 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-500">
              No messages found for this astrologer
            </div>
          )}

          {astroMessages.length > 0 && renderPagination()}
        </div>
      )}
    </div>
  );
}
