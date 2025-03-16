"use client";
import React, { useState, useEffect } from "react";
import { User } from "@/types/user";
import {
  updateUserName,
  updateUserPhone,
  updateUserPassword,
  getUserPrefs,
  updateUserPrefs,
  listUserSessions,
  deleteUserSessions,
  deleteUserSession,
  fetchUserByEmail,
} from "@/lib/api/users";
import { useAuthStore } from "@/store/Auth"; // Assuming you have a user store for global state

const Profile: React.FC = () => {
  const { user } = useAuthStore(); // Get user ID from global state
  const [User, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  const fetchUserData = async (user: any) => {
    // Fetch user data using the userId
    // This is a placeholder. Replace with your actual API call.
    console.log("email: ", user?.email);
    const userData = await fetchUserByEmail(user?.email);
    setUser(userData);
    setEditedUser(userData);
  };

  useEffect(() => {
    if (!user) return;
    // const fetchUserData = async () => {
    //     // Fetch user data using the userId
    //     // This is a placeholder. Replace with your actual API call.
    //     console.log("email: ", user?.email)
    //     const userData = await fetchUserByEmail(user?.email);
    //     console.log("userData: ", userData);
    //     // setUser(userData);
    //     setEditedUser(userData);
    // };

    fetchUserData(user);
  }, []);
  if (!user) return;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async () => {
    if (editedUser) {
      await updateUserName(user?.$id, editedUser.name);
      await updateUserPhone(user?.$id, editedUser.phone);
      setUser(editedUser);
      setEditMode(false);
    }
  };

  const handleUpdatePassword = async () => {
    const newPassword = prompt("Enter new password:");
    if (newPassword) {
      await updateUserPassword(user.$id, newPassword);
      alert("Password updated successfully");
    }
  };

  const handleViewPrefs = async () => {
    const prefs = await getUserPrefs(user.$id);
    alert(JSON.stringify(prefs, null, 2));
  };

  const handleUpdatePrefs = async () => {
    const newPrefs = prompt("Enter new preferences (JSON format):");
    if (newPrefs) {
      try {
        const prefsObj = JSON.parse(newPrefs);
        await updateUserPrefs(user.$id, prefsObj);
        alert("Preferences updated successfully");
      } catch (error) {
        alert("Invalid JSON format");
      }
    }
  };

  const handleViewSessions = async () => {
    const sessions = await listUserSessions(user.$id);
    alert(JSON.stringify(sessions, null, 2));
  };

  const handleDeleteAllSessions = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all sessions? You will be logged out.",
      )
    ) {
      await deleteUserSessions(user.$id);
      alert("All sessions deleted successfully. Please log in again.");
      // Implement logout functionality here
    }
  };

  const handleDeleteSession = async () => {
    const sessionId = prompt("Enter session ID to delete:");
    if (sessionId) {
      await deleteUserSession(user.$id, sessionId);
      alert("Session deleted successfully");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Your Profile</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">ID:</label>
          <input
            type="text"
            value={user.$id}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={editedUser?.name || ""}
            onChange={handleInputChange}
            readOnly={!editMode}
            className={`w-full p-2 border rounded ${!editMode && "bg-gray-100"}`}
          />
        </div>
        <div>
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2">Phone:</label>
          <input
            type="tel"
            name="phone"
            value={editedUser?.phone || ""}
            onChange={handleInputChange}
            readOnly={!editMode}
            className={`w-full p-2 border rounded ${!editMode && "bg-gray-100"}`}
          />
        </div>
        <div>
          <label className="block mb-2">Status:</label>
          <input type="checkbox" checked={user.status} readOnly disabled />
          Active
        </div>
        <div>
          <label className="block mb-2">Email Verification:</label>
          <input
            type="checkbox"
            checked={user.emailVerification}
            readOnly
            disabled
          />
          Verified
        </div>
        <div>
          <label className="block mb-2">Phone Verification:</label>
          <input
            type="checkbox"
            checked={user.phoneVerification}
            readOnly
            disabled
          />
          Verified
        </div>
        <div>
          <label className="block mb-2">Labels:</label>
          {user.labels.join(", ")}
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={() => setEditMode(!editMode)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
        {editMode && (
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Save Changes
          </button>
        )}
        <button
          onClick={handleUpdatePassword}
          className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
        >
          Change Password
        </button>
        <button
          onClick={handleViewPrefs}
          className="bg-purple-500 text-white px-4 py-2 rounded mr-2"
        >
          View Preferences
        </button>
        {/* <button onClick={handleUpdatePrefs} className="bg-indigo-500 text-white px-4 py-2 rounded mr-2">
          Update Preferences
        </button> */}
        <button
          onClick={handleViewSessions}
          className="bg-pink-500 text-white px-4 py-2 rounded mr-2"
        >
          View Sessions
        </button>
        <button
          onClick={handleDeleteAllSessions}
          className="bg-red-700 text-white px-4 py-2 rounded mr-2"
        >
          Delete All Sessions
        </button>
        <button
          onClick={handleDeleteSession}
          className="bg-orange-500 text-white px-4 py-2 rounded mr-2"
        >
          Delete Specific Session
        </button>
      </div>
    </div>
  );
};

export default Profile;

function fetchUserById(userId: string) {
  throw new Error("Function not implemented.");
}
