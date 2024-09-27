// src/components/UserManagement/UserDetails.tsx
import React, { useState } from 'react';
import { User } from '@/types/user';
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
  getUserPrefs,
  updateUserPrefs,
  listUserSessions,
  deleteUserSessions,
  deleteUserSession,
  listUserLogs,
} from '@/lib/api/users';

interface UserDetailsProps {
  user: User;
  onClose: () => void;
  onUpdate: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, onClose, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleLabelChange = (label: string) => {
    const newLabels = editedUser.labels.includes(label)
      ? editedUser.labels.filter((l) => l !== label)
      : [...editedUser.labels, label];
    setEditedUser((prev) => ({ ...prev, labels: newLabels }));
  };

  const handleSave = async () => {
    await updateUserEmail(user.$id, editedUser.email);
    await updateUserName(user.$id, editedUser.name);
    await updateUserPhone(user.$id, editedUser.phone);
    await updateUserLabels(user.$id, editedUser.labels);
    await updateUserStatus(user.$id, editedUser.status);
    await updateUserEmailVerification(user.$id, editedUser.emailVerification);
    await updateUserPhoneVerification(user.$id, editedUser.phoneVerification);
    setEditMode(false);
    onUpdate();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(user.$id);
      onClose();
      onUpdate();
    }
  };

  const handleUpdatePassword = async () => {
    const newPassword = prompt('Enter new password:');
    if (newPassword) {
      await updateUserPassword(user.$id, newPassword);
      alert('Password updated successfully');
    }
  };

  const handleViewPrefs = async () => {
    const prefs = await getUserPrefs(user.$id);
    alert(JSON.stringify(prefs, null, 2));
  };

  const handleUpdatePrefs = async () => {
    const newPrefs = prompt('Enter new preferences (JSON format):');
    if (newPrefs) {
      try {
        const prefsObj = JSON.parse(newPrefs);
        await updateUserPrefs(user.$id, prefsObj);
        alert('Preferences updated successfully');
      } catch (error) {
        alert('Invalid JSON format');
      }
    }
  };

  const handleViewSessions = async () => {
    const sessions = await listUserSessions(user.$id);
    alert(JSON.stringify(sessions, null, 2));
  };

  const handleDeleteAllSessions = async () => {
    if (window.confirm('Are you sure you want to delete all sessions?')) {
      await deleteUserSessions(user.$id);
      alert('All sessions deleted successfully');
    }
  };

  const handleDeleteSession = async () => {
    const sessionId = prompt('Enter session ID to delete:');
    if (sessionId) {
      await deleteUserSession(user.$id, sessionId);
      alert('Session deleted successfully');
    }
  };

  const handleViewLogs = async () => {
    const logs = await listUserLogs(user.$id);
    alert(JSON.stringify(logs, null, 2));
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">User Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">ID:</label>
          <input type="text" value={user.$id} readOnly className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={editedUser.name}
            onChange={handleInputChange}
            readOnly={!editMode}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Email:</label>
          <input
            type="email"
            name="email"
            value={editedUser.email}
            onChange={handleInputChange}
            readOnly={!editMode}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Phone:</label>
          <input
            type="tel"
            name="phone"
            value={editedUser.phone}
            onChange={handleInputChange}
            readOnly={!editMode}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Status:</label>
          <input
            type="checkbox"
            name="status"
            checked={editedUser.status}
            onChange={handleInputChange}
            disabled={!editMode}
          />
          Active
        </div>
        <div>
          <label className="block mb-2">Email Verification:</label>
          <input
            type="checkbox"
            name="emailVerification"
            checked={editedUser.emailVerification}
            onChange={handleInputChange}
            disabled={!editMode}
          />
          Verified
        </div>
        <div>
          <label className="block mb-2">Phone Verification:</label>
          <input
            type="checkbox"
            name="phoneVerification"
            checked={editedUser.phoneVerification}
            onChange={handleInputChange}
            disabled={!editMode}
          />
          Verified
        </div>
        <div>
          <label className="block mb-2">Labels:</label>
          {['admin', 'astro', 'user', 'translator'].map((label) => (
            <label key={label} className="mr-2">
              <input
                type="checkbox"
                checked={editedUser.labels.includes(label)}
                onChange={() => handleLabelChange(label)}
                disabled={!editMode}
              />
              {label}
            </label>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <button
          onClick={() => setEditMode(!editMode)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          {editMode ? 'Cancel' : 'Edit'}
        </button>
        {editMode && (
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
            Save
          </button>
        )}
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
          Delete User
        </button>
        <button onClick={handleUpdatePassword} className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">
          Update Password
        </button>
        <button onClick={handleViewPrefs} className="bg-purple-500 text-white px-4 py-2 rounded mr-2">
          View Preferences
        </button>
        <button onClick={handleUpdatePrefs} className="bg-indigo-500 text-white px-4 py-2 rounded mr-2">
          Update Preferences
        </button>
        <button onClick={handleViewSessions} className="bg-pink-500 text-white px-4 py-2 rounded mr-2">
          View Sessions
        </button>
        <button onClick={handleDeleteAllSessions} className="bg-red-700 text-white px-4 py-2 rounded mr-2">
          Delete All Sessions
        </button>
        <button onClick={handleDeleteSession} className="bg-orange-500 text-white px-4 py-2 rounded mr-2">
          Delete Session
        </button>
        <button onClick={handleViewLogs} className="bg-teal-500 text-white px-4 py-2 rounded mr-2">
          View Logs
        </button>
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default UserDetails;