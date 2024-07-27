"use client"

import { database } from "@/appwrite/clientConfig";
import conf from "@/conf/conf";
import { AppwriteException, ID, Models } from "appwrite";
import React, { useState, useEffect, useRef } from "react";

export default function ChatSection() {

  const [message, setMessage] = useState("");
  const isFetched = useRef(false);
  const [chatState, setChatState] = useState<Models.Document>([]);

    const senderId = "669aa5590004d5bfeddc";
    const receiverId = "66a1dd8fc75e72c30b8e"

  useEffect(() => {
    if (!isFetched.current) {
      fetchMessage();
      isFetched.current = true;
    }
  }, []);

  // * To handle submit
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    database
      .createDocument(conf.appwriteHoroscopeDatabaseId, conf.appwriteMessageCollectionId, ID.unique(), {
        sender_id: senderId,
        receiver_id: receiverId,
        body: message,
      })
      .then((res) => {
            console.log("response: ", res);
            setChatState(res)
        setMessage("");
      })
      .catch((err: AppwriteException) => {
        console.log("error while adding message: ", err);
      });
  };

  //   * Fetch all messages
  const fetchMessage = () => {
    database
      .listDocuments(conf.appwriteHoroscopeDatabaseId, conf.appwriteMessageCollectionId)
      .then((res) => {
        console.log("response: ", res);
        setChatState(res.documents)
      })
      .catch((err: AppwriteException) => {
        console.log("while fetching message for first time: ", err)
      });
  };

  return (
    <div>
      <div className="h-screen w-screen">
        <div className="flex flex-col">
          {/* Display all messages */}
          <div className="flex-1 p-4 mb-20">
            {chatState.length > 0 &&
              chatState.map((item) =>
                item["user_id"] === user.$id ? (
                  <div className="flex justify-end mb-2" key={item.$id}>
                    <div className="bg-purple-400 px-4 py-2 max-w-lg rounded-xl">
                      <h1 className="font-bold">{item["name"]}</h1>
                      <h1>{item["message"]}</h1>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start mb-2" key={item.$id}>
                    <div className="bg-green-400 px-4 py-2 max-w-lg rounded-xl">
                      <h1 className="font-bold">{item["name"]}</h1>
                      <h1>{item["message"]}</h1>
                    </div>
                  </div>
                )
              )}
          </div>

          {/* Input Box */}
          <div
            className="p-4 bottom-0 left-0 right-0 bg-white"
            style={{ position: "fixed" }}
          >
            <form onSubmit={handleSubmit}>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  label="Type message..."
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}