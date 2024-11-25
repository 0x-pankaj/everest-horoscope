'use client'
import { useAuthStore } from "@/store/Auth"

export default function Test() {
  const {user} = useAuthStore();
  const roll = user?.labels;

  console.log("label: ", user?.labels)
  return (
    <div>
      {roll}
    </div>
  )
}