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
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [hidden, setHidden] = useState<boolean>(false);

  // Generate years (from current year down to 100 years ago)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Months array
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Days array (1-31)
  const days = Array.from({ length: 31 }, (_, i) =>
    (i + 1).toString().padStart(2, "0"),
  );

  // Generate time options (every 15 minutes)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Common countries list
  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Argentina",
    "Australia",
    "Austria",
    "Bangladesh",
    "Belgium",
    "Bhutan",
    "Brazil",
    "Canada",
    "China",
    "Denmark",
    "Egypt",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Japan",
    "Kenya",
    "Malaysia",
    "Mexico",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nigeria",
    "Norway",
    "Pakistan",
    "Philippines",
    "Poland",
    "Portugal",
    "Russia",
    "Saudi Arabia",
    "Singapore",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sweden",
    "Switzerland",
    "Thailand",
    "Turkey",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Vietnam",
  ];

  // Available languages list
  const availableLanguages = [
    { code: "english", name: "English" },
    { code: "hindi", name: "Hindi" },
    { code: "nepali", name: "Nepali" },
    { code: "korean", name: "Korean" },
  ];

  useEffect(() => {
    if (user) {
      // Pre-fill the form with existing data
      if (user.prefs?.dob) {
        try {
          const dobDate = new Date(user.prefs.dob);
          setYear(dobDate.getFullYear().toString());
          setMonth((dobDate.getMonth() + 1).toString().padStart(2, "0"));
          setDay(dobDate.getDate().toString().padStart(2, "0"));
          setTime(dobDate.toTimeString().slice(0, 5)); // Get HH:MM format
        } catch (error) {
          console.error("Error parsing date:", error);
        }
      }

      // Pre-fill location data
      if (user.prefs?.birthCountry) setCountry(user.prefs.birthCountry);
      if (user.prefs?.birthState) setState(user.prefs.birthState);
      if (user.prefs?.birthDistrict) setDistrict(user.prefs.birthDistrict);
      if (user.prefs?.birthCity) setCity(user.prefs.birthCity);

      // Pre-fill language preference
      if (user.prefs?.preferredLanguage) {
        setSelectedLanguage(user.prefs.preferredLanguage);
      }

      // Check if any required field is missing
      checkDOBAndBirthPlace();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      if (
        user.labels.some((label) =>
          ["admin", "astrologer", "translator"].includes(label),
        )
      ) {
        setShowModal(false);
      }
    }
  }, []);

  const checkDOBAndBirthPlace = async () => {
    try {
      // Show modal if any required field is missing
      if (
        !user?.prefs?.dob ||
        !user?.prefs?.birthCountry ||
        !user?.prefs?.preferredLanguage ||
        !user?.prefs?.birthState ||
        !user?.prefs?.birthDistrict ||
        !user?.prefs?.birthCity
      ) {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error checking DOB and BirthPlace:", error);
    }
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
    if (!selectedLanguage) missingFields.push("Preferred Language");
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
        preferredLanguage: selectedLanguage,
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
              Update Your Information
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Year Dropdown */}
              <div className="w-full">
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Year of Birth
                </label>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Year</option>
                  {years.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Dropdown */}
              <div className="w-full">
                <label
                  htmlFor="month"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Month
                </label>
                <select
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Month</option>
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Day Dropdown */}
              <div className="w-full">
                <label
                  htmlFor="day"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Day
                </label>
                <select
                  id="day"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Day</option>
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Dropdown */}
              <div className="w-full">
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Time of Birth
                </label>
                <select
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Time</option>
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Country Dropdown */}
              <div className="w-full">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* State, District, City as text inputs since they're highly variable */}
              <div className="w-full">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State/Province
                </label>
                <input
                  type="text"
                  id="state"
                  placeholder="State/Province"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  District
                </label>
                <input
                  type="text"
                  id="district"
                  placeholder="District"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* Language Selection */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Preferred Language
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableLanguages.map((language) => (
                    <div key={language.code} className="flex items-center">
                      <input
                        type="radio"
                        id={language.code}
                        name="language"
                        value={language.code}
                        checked={selectedLanguage === language.code}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="h-4 w-4 text-blue-600 border-gray-300"
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

              <div className="flex space-x-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
                  onClick={() => setHidden(!hidden)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DobComponent;
