"use client";
import useAuth from "@/context/useAuth";
import { useRouter } from "next/navigation";
import React from "react";
import Login from "@/components/Login";
import { useAuthStore } from "@/store/Auth";

const LoginPage = () => {
    const router = useRouter();
   const useAuth = useAuthStore(); 
    console.log("from start: ", useAuth);

    if(useAuth.session){
        console.log("already logged in");
        router.push("/");
    }

    return(
        <section className="px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
            <Login />
        </section>
    )
}


export default LoginPage;