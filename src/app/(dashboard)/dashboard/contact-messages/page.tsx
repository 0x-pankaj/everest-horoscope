"use client";
import React, { useEffect, useState } from "react";
import { database } from "@/appwrite/clientConfig";
import { Query } from "appwrite";
import conf from "@/conf/conf";
import { format } from "date-fns";

interface ContactMessage {
  $id: string;
  name: string;
  email: string;
  number: string;
  message: string;
  $createdAt: string;
}

const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const messagesPerPage = 20;

  const fetchMessages = async (page: number) => {
    try {
      setLoading(true);
      const offset = (page - 1) * messagesPerPage;

      const response = await database.listDocuments(
        conf.appwriteHoroscopeDatabaseId,
        conf.appwriteContactUsMessageCollectionId,
        [
          Query.orderDesc("$createdAt"),
          Query.limit(messagesPerPage),
          Query.offset(offset),
        ] 
      );

    //   console.log("contact information: ", response);

      setMessages(response.documents as unknown as ContactMessage[]);
      setTotalMessages(response.total);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalMessages / messagesPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contact Messages</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Received
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.map((message) => (
                  <tr key={message.$id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {message.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {message.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {message.number}
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs overflow-hidden text-ellipsis">
                        {message.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">
                          {format(new Date(message.$createdAt), "MMM dd, yyyy")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(message.$createdAt), "hh:mm a")}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ContactMessages;