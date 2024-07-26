"use client"


import Carousel from "@/components/Carouse";
import ChatCard from "@/components/ChatCard";
import { useAuthStore } from "@/store/Auth";
import logo from "@/assets/images/everest-logo.png"
import team from "@/assets/images/team.jpg"


export default function Home() {
  
  const useAuth = useAuthStore();
  console.log("home authStore", useAuth )
  return (
    
    <div className="min-h-screen w-full bg-gray-100 " >
      <ChatCard />
    <button onClick={async()=> {
      await useAuth.logout();
    }} className="cursor-pointer">Logout</button>
    </div>
    
  );
}
