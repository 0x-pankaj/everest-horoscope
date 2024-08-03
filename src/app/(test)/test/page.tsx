"use client"

import { teams } from "@/appwrite/clientConfig";
import toast, { Toaster } from "react-hot-toast";

export default function() {


 async function getTeam() {

  const listTeam = await teams.list();

  console.log("listTeam: ", listTeam);

  const getTeam = await teams.get("66a1dd07001af27e0259"
   
  )
  console.log("getTeam: ", getTeam);

  const listTeamMember = await teams.listMemberships(
    '66a1dd07001af27e0259',
  )
  console.log("teamMemberShip: ", listTeamMember);



  }



  return (
    <div className="flex flex-col" >  
      Test team

      <button onClick={getTeam}>
         get team
      </button>
    </div>
  )
}