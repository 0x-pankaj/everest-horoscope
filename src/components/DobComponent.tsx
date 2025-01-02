"use client";
import React, { useState, useEffect } from "react";
import { account } from "@/appwrite/clientConfig";
import { useAuthStore } from "@/store/Auth";

const DobComponent: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hidden, setHidden] = useState<boolean>(false);

  // Available languages list
  const availableLanguages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "np", name: "Nepali" },
    { code: "kr", name: "Korean" },
  ];

  useEffect(() => {
    if (user) {
      checkDOBAndBirthPlace();
      // Initialize selected languages from user preferences if they exist
      if (user.prefs?.preferredLanguages) {
        setSelectedLanguages(user.prefs.preferredLanguages);
      }
    }
  }, [user]);

  const checkDOBAndBirthPlace = async () => {
    try {
      if (
        !user?.prefs?.dob ||
        !user?.prefs?.birthCountry ||
        !user?.prefs?.preferredLanguages
      ) {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error checking DOB and BirthPlace:", error);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguages((prev) => {
      if (prev.includes(language)) {
        return prev.filter((lang) => lang !== language);
      } else {
        return [...prev, language];
      }
    });
  };

  const validateFields = () => {
    const missingFields = [];
    if (!year) missingFields.push("Year");
    if (!month) missingFields.push("Month");
    if (!day) missingFields.push("Day");
    if (!time) missingFields.push("Time");
    if (!country) missingFields.push("Country");
    if (!state) missingFields.push("State");
    if (!district) missingFields.push("District");
    if (!city) missingFields.push("City");
    if (selectedLanguages.length === 0)
      missingFields.push("Preferred Language");
    return missingFields;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const missingFields = validateFields();
    if (missingFields.length > 0) {
      setError(`Missing fields: ${missingFields.join(", ")}`);
      return;
    }

    const dob = `${year}-${month}-${day} ${time}`;
    try {
      await account.updatePrefs({
        dob,
        birthCountry: country,
        birthState: state,
        birthDistrict: district,
        birthCity: city,
        preferredLanguages: selectedLanguages,
      });
      setShowModal(false);

      const updatedUser = await account.get();
      console.log("updated user");
      updateUser(updatedUser);
    } catch (error) {
      console.error("Error updating information:", error);
      setError("Failed to update information. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <div className={`${hidden ? "hidden" : "p-4 m-4 overflow-y-scroll "}`}>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-scroll">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold py-4 my-6">
              Set Your Date and Place of Birth
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="number"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Day"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="District"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2 border rounded"
              />

              {/* Language Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Preferred Languages
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableLanguages.map((language) => (
                    <div key={language.code} className="flex items-center">
                      <input
                        type="checkbox"
                        id={language.code}
                        checked={selectedLanguages.includes(language.code)}
                        onChange={() => handleLanguageChange(language.code)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                      />
                      <label
                        htmlFor={language.code}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {language.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                onClick={() => setHidden(!hidden)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DobComponent;
