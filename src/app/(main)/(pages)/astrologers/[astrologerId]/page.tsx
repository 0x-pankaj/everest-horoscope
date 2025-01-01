"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { database } from "@/appwrite/clientConfig";
import conf from "@/conf/conf";
import { AstrologerDetailCard } from "@/components/AstrologerDetailCard";
import Navbar from "@/components/Navbar";
import { Astrologer } from "@/types/user";

const AstrologerDetailPage: React.FC = () => {
  const { astrologerId } = useParams();
  console.log("astroloderId: ", astrologerId);
  const [astrologer, setAstrologer] = useState<Astrologer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAstrologer = async () => {
      try {
        const response = await database.getDocument(
          conf.appwriteHoroscopeDatabaseId,
          conf.appwriteAstroCollectionId,
          astrologerId as string,
        );
        setAstrologer(response as unknown as Astrologer);
      } catch (err) {
        console.error("Failed to fetch astrologer:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (astrologerId) {
      fetchAstrologer();
    }
  }, [astrologerId]);

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (!astrologer)
    return <div className="text-center py-8">Astrologer not found.</div>;

  return (
    <div>
      {/* <Navbar /> */}
      <div className="container mx-auto px-4 py-8">
        <AstrologerDetailCard astrologer={astrologer} />
      </div>
    </div>
  );
};

export default AstrologerDetailPage;
