"use client"

import useAuth from "@/context/useAuth";
import Link from "next/link";

export default function TopBar() {
    const {authStatus} = useAuth();
    return (
        <div className="flex flex-col   lg:flex-row lg: justify-between p-4 bg-slate-500 text-lg" >
            <div className="flex flex-col lg:flex-row lg:items-center" >
                <div className="px-4 mb-2 lg:mb-0">
                    9817820096
                </div>
                <div>
                    <Link href="/chat">Talk to our Astrogers</Link>
                </div>
            </div>
            <div className="hidden space-x-2 lg:block">
                    <Link
                        href={authStatus ? "/profile" : "/signup"}
                        className="rounded-md bg-transparent px-3 py-2 text-md font-semibold text-primary hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        {authStatus ? "Profile" : "Sign up"}
                    </Link>
                    <Link
                        href={authStatus ? "/logout" : "/login"}
                        className="rounded-md border border-primary px-3 py-2 text-md font-semibold text-primary shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        {authStatus ? "Logout" : "Log In"}
                    </Link>
                </div>

        </div>
    )
}