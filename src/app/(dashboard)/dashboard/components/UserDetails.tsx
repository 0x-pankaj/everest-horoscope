"use client";
import React, { useEffect, useState } from "react";
import { User } from "@/types/user";
import { useChatStore } from "@/store/chatStore";
import { FaPaperPlane } from "react-icons/fa";
import {
  updateUserEmail,
  updateUserName,
  updateUserPhone,
  updateUserPassword,
  updateUserLabels,
  updateUserStatus,
  updateUserEmailVerification,
  updateUserPhoneVerification,
  deleteUser,
  listUserSessions,
  deleteUserSessions,
  deleteUserSession,
  listUserLogs,
  fetchUserById,
} from "@/lib/api/users";
import { users } from "@/appwrite/serverConfig";

interface UserDetailsProps {
  user: User;
  onClose: () => void;
  onUpdate: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  user,
  onClose,
  onUpdate,
}) => {
  const [editedUser, setEditedUser] = useState(user);
  const [userPrefs, setUserPrefs] = useState<any>({});
  const { sendMessage } = useChatStore();
  const [hasNepaliDate, setHasNepaliDate] = useState<boolean>(false);

  useEffect(() => {
    fetchUserPrefs();
  }, [user.$id]);

  const fetchUserPrefs = async () => {
    try {
      const prefs = await users.getPrefs(user.$id);
      setUserPrefs(prefs);
      // Check if nepaliDob exists
      setHasNepaliDate(!!prefs.nepaliDob);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  };

  const refreshUserData = async () => {
    try {
      const updatedUser = await fetchUserById(user.$id);
      if (updatedUser) {
        setEditedUser(updatedUser);
        setUserPrefs(updatedUser.prefs);
        setHasNepaliDate(!!updatedUser.prefs?.nepaliDob);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePrefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserPrefs((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleNepaliDateVisibility = () => {
    if (!hasNepaliDate) {
      // If enabling Nepali date, initialize with empty value if it doesn't exist
      if (!userPrefs.nepaliDob) {
        setUserPrefs((prev: any) => ({
          ...prev,
          nepaliDob: "",
        }));
      }
    } else {
      // If disabling Nepali date, handle removal during update rather than here
    }
    setHasNepaliDate(!hasNepaliDate);
  };

  const handleLabelChange = (label: string) => {
    const newLabels = editedUser.labels.includes(label)
      ? editedUser.labels.filter((l) => l !== label)
      : [...editedUser.labels, label];
    setEditedUser((prev) => ({ ...prev, labels: newLabels }));
  };

  const updateField = async (field: string, value: any) => {
    console.log("prefs: ", userPrefs);
    try {
      switch (field) {
        case "name":
          await updateUserName(user.$id, value);
          break;
        case "email":
          await updateUserEmail(user.$id, value);
          break;
        case "phone":
          await updateUserPhone(user.$id, value);
          break;
        case "status":
          await updateUserStatus(user.$id, value);
          break;
        case "emailVerification":
          await updateUserEmailVerification(user.$id, value);
          break;
        case "phoneVerification":
          await updateUserPhoneVerification(user.$id, value);
          break;
        case "labels":
          await updateUserLabels(user.$id, value);
          break;
        case "nepaliDob":
          // Handle enabling/disabling of Nepali DOB
          if (hasNepaliDate) {
            const updatedPrefs = { ...userPrefs, [field]: value };
            await users.updatePrefs(user.$id, updatedPrefs);
            setUserPrefs(updatedPrefs);
          } else {
            // Remove nepaliDob field if checkbox is unchecked
            const { nepaliDob, ...remainingPrefs } = userPrefs;
            await users.updatePrefs(user.$id, remainingPrefs);
            setUserPrefs(remainingPrefs);
          }
          break;
        default:
          // For preferences
          const updatedPrefs = { ...userPrefs, [field]: value };
          await users.updatePrefs(user.$id, updatedPrefs);
          setUserPrefs(updatedPrefs);
          break;
      }
      await refreshUserData();
      onUpdate();
      alert(`${field} updated successfully`);
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      alert(`Error updating ${field}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(user.$id);
        onClose();
        onUpdate();
        alert("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user");
      }
    }
  };

  const handleUpdatePassword = async () => {
    const newPassword = prompt("Enter new password:");
    if (newPassword) {
      try {
        await updateUserPassword(user.$id, newPassword);
        alert("Password updated successfully");
      } catch (error) {
        console.error("Error updating password:", error);
        alert("Error updating password");
      }
    }
  };

  const handleViewSessions = async () => {
    try {
      const sessions = await listUserSessions(user.$id);
      alert(JSON.stringify(sessions, null, 2));
    } catch (error) {
      console.error("Error fetching sessions:", error);
      alert("Error fetching sessions");
    }
  };

  const handleDeleteAllSessions = async () => {
    if (window.confirm("Are you sure you want to delete all sessions?")) {
      try {
        await deleteUserSessions(user.$id);
        alert("All sessions deleted successfully");
      } catch (error) {
        console.error("Error deleting all sessions:", error);
        alert("Error deleting all sessions");
      }
    }
  };

  const handleDeleteSession = async () => {
    const sessionId = prompt("Enter session ID to delete:");
    if (sessionId) {
      try {
        await deleteUserSession(user.$id, sessionId);
        alert("Session deleted successfully");
      } catch (error) {
        console.error("Error deleting session:", error);
        alert("Error deleting session");
      }
    }
  };

  const handleViewLogs = async () => {
    try {
      const logs = await listUserLogs(user.$id);
      alert(JSON.stringify(logs, null, 2));
    } catch (error) {
      console.error("Error fetching logs:", error);
      alert("Error fetching logs");
    }
  };

  const renderField = (
    label: string,
    name: string,
    type: string = "text",
    isPreference: boolean = false,
  ) => {
    const value = isPreference
      ? userPrefs[name]
      : editedUser[name as keyof User];
    const onChange = isPreference ? handlePrefChange : handleInputChange;

    return (
      <div className="mb-4">
        <label className="block mb-2">{label}:</label>
        <div className="flex">
          <input
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            className="w-full p-2 border rounded mr-2"
          />
          <button
            onClick={() =>
              updateField(name, isPreference ? userPrefs[name] : value)
            }
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>
    );
  };
  const astrologers = [
    {
      id: "66bc549e002495fbc0f1",
      name: "bigyan",
    },
    {
      id: "3",
      name: "rahul",
    },
  ];
  const [inputMessage, setInputMessage] = useState("");
  const [selectedAstrologer, setSelectedAstrologer] = useState(astrologers[0]);

  async function handleSendMessage(e: any) {
    e.preventDefault();
    if (inputMessage.trim() === "") return;

    await sendMessage(
      // "66bc549e002495fbc0f1",
      selectedAstrologer.id,
      user.$id,
      inputMessage.trim(),
      user?.name,
      user.prefs.preferredLanguage,
      user.prefs.preferredLanguage,
      false,
    );

    setInputMessage("");
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">User Details</h2>
      <div>
        <div className="mb-4">
          <label className="block mb-2">ID:</label>
          <input
            type="text"
            value={user.$id}
            readOnly
            className="w-full p-2 border rounded"
          />
          <div className="bg-white border-t border-gray-200 px-4 py-3 sticky bottom-0 left-0 right-0">
            <label className="block mb-2"> Select Astrologer</label>
            <div className="relative mb-4">
              <select
                value={selectedAstrologer.id}
                onChange={(e) => {
                  const selected = astrologers.find(
                    (astro) => astro.id === e.target.value,
                  );

                  if (selected) {
                    setSelectedAstrologer(selected);
                  }
                }}
                className="w-full p-2 border rounded appearance-none bg-white pr-8"
              >
                {astrologers.map((astro) => (
                  <option key={astro.id} value={astro.id}>
                    {astro.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="relative">
              <form onSubmit={handleSendMessage} className="flex items-center">
                <input
                  // ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-grow bg-gray-100 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your message..."
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FaPaperPlane className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
        {renderField("Name", "name")}
        {renderField("Email", "email", "email")}
        {renderField("Phone", "phone", "tel")}
        {renderField("Date of Birth", "dob", "text", true)}

        {/* Nepali Date of Birth Section */}
        <div className="mb-4 border-l-4 border-blue-200 pl-3">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="hasNepaliDate"
              checked={hasNepaliDate}
              onChange={toggleNepaliDateVisibility}
              className="mr-2"
            />
            <label htmlFor="hasNepaliDate" className="font-medium">
              Nepali Date of Birth (Bikram Sambat)
            </label>
          </div>

          {hasNepaliDate && (
            <div className="ml-6">
              {renderField(
                "Nepali Date (YYYY-MM-DD)",
                "nepaliDob",
                "text",
                true,
              )}
              <p className="text-xs text-gray-500 mt-1">
                Format: YYYY-MM-DD (e.g., 2060-05-15 for Shrawan 15, 2060 B.S.)
              </p>
            </div>
          )}
        </div>

        {renderField("Country", "birthCountry", "text", true)}
        {renderField("State", "birthState", "text", true)}
        {renderField("District", "birthDistrict", "text", true)}
        {renderField("City", "birthCity", "text", true)}

        <div className="mb-4">
          <label className="block mb-2">Status:</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="status"
              checked={editedUser.status}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span>Active</span>
            <button
              onClick={() => updateField("status", editedUser.status)}
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
            >
              Update
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Email Verification:</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="emailVerification"
              checked={editedUser.emailVerification}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span>Verified</span>
            <button
              onClick={() =>
                updateField("emailVerification", editedUser.emailVerification)
              }
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
            >
              Update
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Phone Verification:</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              name="phoneVerification"
              checked={editedUser.phoneVerification}
              onChange={handleInputChange}
              className="mr-2"
            />
            <span>Verified</span>
            <button
              onClick={() =>
                updateField("phoneVerification", editedUser.phoneVerification)
              }
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
            >
              Update
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Labels:</label>
          {["admin", "astro", "user", "translator"].map((label) => (
            <label key={label} className="mr-2">
              <input
                type="checkbox"
                checked={editedUser.labels.includes(label)}
                onChange={() => handleLabelChange(label)}
                className="mr-1"
              />
              {label}
            </label>
          ))}
          <button
            onClick={() => updateField("labels", editedUser.labels)}
            className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
          >
            Update Labels
          </button>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
        >
          Delete User
        </button>
        <button
          onClick={handleUpdatePassword}
          className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
        >
          Update Password
        </button>
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
          Delete Session
        </button>
        <button
          onClick={handleViewLogs}
          className="bg-teal-500 text-white px-4 py-2 rounded mr-2"
        >
          View Logs
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
