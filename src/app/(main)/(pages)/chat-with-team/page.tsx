
"use client"

import React, { useEffect, useState } from 'react';
import { Query } from 'appwrite';
import TeamMemberCard from '@/components/TeamMemberCard';
import { database } from '@/appwrite/clientConfig';
import conf from '@/conf/conf';


interface TeamMember {
  $id: string;
  user_id: string;
  photoUrl: string;
  name: string;
}

const ChatWithTeam: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await database.listDocuments(
          conf.appwriteHoroscopeDatabaseId,
          conf.appwriteTeamMemberCollectionId,
          [
            Query.limit(40), // Adjust this number based on your needs
          ]
        );
        console.log("team member: ", response);
        setTeamMembers(response.documents as unknown as TeamMember[]);
      } catch (err) {
        setError('Failed to fetch team members');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Chat with Our Team</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {teamMembers.map((member) => (
          <TeamMemberCard
          onChatClick={()=> console.log("chat clicked")}
            key={member.$id}
            id={member.$id}
            name={member.name}
            photoUrl={member.photoUrl}
            userId={member.user_id}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatWithTeam;