"use client"

import { database } from '@/appwrite/clientConfig';
import AstrologerProfileCard from '@/components/AstroCard';
import conf from '@/conf/conf';
import React, { useEffect, useRef } from 'react';

const Chat: React.FC = () => {
  const isAstroFetched = useRef(false);
  // const [astro, setAstro] = useEffect([]);
  /*
  useEffect(()=> {
      if(!isAstroFetched.current){
          ;(async()=> {
              const astro =  await database.listDocuments(conf.appwriteHoroscopeDatabaseId,conf.appwriteAstroCollectionId);
              console.log("astro: ", astro);
              // setAstro(astro.documents);
          })();
      }
       isAstroFetched.current = true;
  
  },[]);
*/

  const astrologer = [{
    name: "Pankaj",
    photoUrl: "https://via.placeholder.com/150",
    bio: "Best astrologer in the market",
    specialties: ["Birth date analysis", "Love and relationships", "Career guidance"],
    rating: 3.4,
    experience: 4,
    onChatClick: () => {
      console.log("Chat initiated");
      // Implement chat initiation logic here
    }
  },
  {
    name: "Pankaj",
    photoUrl: "https://via.placeholder.com/150",
    bio: "Best astrologer in the market",
    specialties: ["Birth date analysis", "Love and relationships", "Career guidance"],
    rating: 3.4,
    experience: 4,
    onChatClick: () => {
      console.log("Chat initiated");
      // Implement chat initiation logic here
    }
  },
  {
    name: "Pankaj",
    photoUrl: "https://via.placeholder.com/150",
    bio: "Best astrologer in the market",
    specialties: ["Birth date analysis", "Love and relationships", "Career guidance"],
    rating: 3.4,
    experience: 4,
    onChatClick: () => {
      console.log("Chat initiated");
      // Implement chat initiation logic here
    }
  },
  {
    name: "Pankaj",
    photoUrl: "https://via.placeholder.com/150",
    bio: "Best astrologer in the market",
    specialties: ["Birth date analysis", "Love and relationships", "Career guidance"],
    rating: 3.4,
    experience: 4,
    onChatClick: () => {
      console.log("Chat initiated");
      // Implement chat initiation logic here
    }
  },
  {
    name: "Pankaj",
    photoUrl: "https://via.placeholder.com/150",
    bio: "Best astrologer in the market",
    specialties: ["Birth date analysis", "Love and relationships", "Career guidance"],
    rating: 3.4,
    experience: 4,
    onChatClick: () => {
      console.log("Chat initiated");
      // Implement chat initiation logic here
    }
  },
  {
    name: "Pankaj",
    photoUrl: "https://via.placeholder.com/150",
    bio: "Best astrologer in the market",
    specialties: ["Birth date analysis", "Love and relationships", "Career guidance"],
    rating: 3.4,
    experience: 4,
    onChatClick: () => {
      console.log("Chat initiated");
      // Implement chat initiation logic here
    }
  }];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {
          astrologer.map((item, i)=> (
            <AstrologerProfileCard
              key={i}
              name={item.name}
              photoUrl={item.photoUrl}
              bio={item.bio}
              specialties={item.specialties}
              rating={item.rating}
              experience={item.experience}
              onChatClick={item.onChatClick}
            />
          ))
        }
      </div>
    </div>
  );
};

export default Chat;
