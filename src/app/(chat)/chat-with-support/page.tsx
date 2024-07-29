"use client"

import { useAstroStore } from "@/store/astroStore"
import { useAuthStore } from "@/store/Auth";
import { useAdminStore } from "@/store/teamStore";

export default function() {
    const {user} = useAuthStore();
    const {loading, astrologers} = useAstroStore();
    const {fetchAdmin, admin} = useAdminStore();
    console.log("admin: ", admin);
    console.log("astro: ", loading)
    console.log("user: ", user)
    console.log("astrologers: done: ", astrologers);
    return (
        <div>
            suppot

            <div>
                <button onClick={fetchAdmin}>get admin</button>
            </div>
        </div>
    )
}