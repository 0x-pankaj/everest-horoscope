"use client";

import React, { useEffect, useState } from "react";
import { database } from "@/appwrite/clientConfig";
import conf from "@/conf/conf";
import { AstrologerCard } from "@/components/AstrologerCard";
import Navbar from "@/components/Navbar";
import { Astrologer } from "@/types/user";

const AstrologerListPage: React.FC = () => {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAstrologers = async () => {
      try {
        const response = await database.listDocuments(
          conf.appwriteHoroscopeDatabaseId,
          conf.appwriteAstroCollectionId,
        );
        setAstrologers(response.documents as unknown as Astrologer[]);
      } catch (err) {
        console.error("Failed to fetch astrologers:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAstrologers();
  }, []);

  const filteredAstrologers = astrologers.filter(
    (astrologer) =>
      astrologer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      astrologer.specialties.some((specialty) =>
        specialty.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Our Astrologers</h1>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or specialty"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto block px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAstrologers.map((astrologer) => (
            <AstrologerCard key={astrologer.$id} astrologer={astrologer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AstrologerListPage;
