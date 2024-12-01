'use client';

import DataFetchButton from "@/components/DataFetchButton";
import { useAstroStore } from "@/store/astroStore";
import { useAuthStore } from "@/store/Auth";


export default function Test() {
  const user = useAuthStore(state => state.user)
  return (
    <div>
      <h1 className="text-center text-4xl font-bold mt-8">Everest Astro</h1>
      {/* <DataFetchButton userId={user.$id ||  ""} /> */}
    </div>
  );
}