"use client"

import { client, database } from "@/appwrite/clientConfig";
import MessageHome from "@/components/MessageHome";
import conf from "@/conf/conf";
import { useChatStore } from "@/store/chatStore";
import { useEffect } from "react";



async function updateDocumentWithArrayAttribute() {
  try {
    console.log("clicked")
      const response = await database.updateDocument(
          conf.appwriteHoroscopeDatabaseId,  // Your Database ID
          conf.appwriteAstroCollectionId, // Your Collection ID
          '66a56e6e000365ae71f3',  // Document ID to update
          {
            specialties: "marriage specialites" // Array attribute
          }
      );
      console.log('Document updated successfully:', response);
  } catch (error) {
      console.error('Error updating document:', error);
  }
}

// updateDocumentWithArrayAttribute();
/*
export default function () {
  return (
    <div>
      updateDocument
 //      <button onClick={updateDocumentWithArrayAttribute} >array</button> 
      <button >admin list</button>
    </div>
  )
}
*/



// In your page or parent component
const YourComponent = () => {
  const currentUserId = 'user123'; // Replace with actual user ID logic

// useEffect(() => {
//   client.subscribe(`databases.$${conf.appwriteHoroscopeDatabaseId}.collections${conf.appwriteMessageCollectionId}.documents`, (response) => {
//     console.log("realtime response : ", response);
//   })
// },[]);
const {messages} = useChatStore();
console.log("messages: ", messages);
  return (
    <div className="your-layout-class">
   
      <div className="w-64"> 
        hello
        {/* <MessageHome senderId={currentUserId} /> */}
      </div>
    
    </div>
  );
};
export default YourComponent;