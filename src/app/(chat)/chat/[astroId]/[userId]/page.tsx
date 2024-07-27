
import ChatRoom from '@/components/ChatRoom';
import React from 'react';


export default function ChatRoomPage({
  params,
}: {
  params: { astroId: string; userId: string };
}) {
  return (< ChatRoom astroId={params.astroId} userId={params.userId}/>);
}