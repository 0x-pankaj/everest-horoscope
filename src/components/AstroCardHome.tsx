"use client"

import { useAstroStore } from "@/store/astroStore"
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AstrologerProfileCard from "./AstroCard";

export default function AstroCardHome() {
    const { astrologers, loading, error, fetchAstrologers } = useAstroStore();
    const {user} = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        fetchAstrologers();
      }, [fetchAstrologers]);
    
      const handleChatClick = (astrologerId: string) => {
        router.push(`/chat/${astrologerId}/${user?.$id}`);
      };
    
    const filteredAstrologers = astrologers;
    console.log("astrologers: ", astrologers);
    return (
        <div className="bg-blue-100">        
        <div className="container mx-auto px-4 py-3">
            <div className="grid grid-cols-1  justify-items-center md:grid-cols-2  lg:grid-cols-3 gap-6">
        {filteredAstrologers.map((astrologer) => (
          <AstrologerProfileCard
            key={astrologer.$id}
            id={astrologer.$id}
            user_id={astrologer.user_id}
            name={astrologer.name}
            photoUrl={astrologer.photoUrl}
            bio={astrologer.bio}
            specialties={astrologer.specialties}
            rating={astrologer.rating}
            experience={astrologer.experience}
            hourlyRate={astrologer.hourlyRate}
            isOnline={astrologer.isOnline}
            onChatClick={handleChatClick}
          />
        ))}
        </div>
        </div>
        </div>
    )
}