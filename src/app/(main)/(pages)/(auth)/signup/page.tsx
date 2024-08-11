"use client"

import SignUp from "@/components/Signup";
import { useAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";

export default function SignUpHome () {
    const router = useRouter();
    const useAuth = useAuthStore();
    if(useAuth.session){
        console.log("from signup already have account ", useAuth);
        router.push("/");
    }
    return (
        <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-24" >
            <SignUp />
        </section>
    )
}