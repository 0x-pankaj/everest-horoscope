"use client"


import { useAuthStore } from "@/store/Auth";


export default function Home() {
  const useAuth = useAuthStore();
  console.log("home authStore", useAuth )
  return (
    <div className="min-h-screen w-full bg-gray-100 " >
    
    <button onClick={async()=> {
      await useAuth.logout();
    }} className="cursor-pointer">Logout</button>
    </div>
  );
}
