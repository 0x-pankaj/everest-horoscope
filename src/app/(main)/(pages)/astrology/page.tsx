import React from "react";

export default function Astrology() {
  const astrologyData = [
    {
      planet: "Sun",
      familial: "Father",
      political: "King",
      personal: "Soul, power",
      bodyPart: "Bone",
      color: "Red",
      direction: "East",
      place: "Place of god",
      taste: "Spicy",
      metal: "Copper",
    },
    {
      planet: "Moon",
      familial: "Mother",
      political: "Queen",
      personal: "Mind, thinking",
      bodyPart: "Eyes",
      color: "White",
      direction: "North west",
      place: "Place of water",
      taste: "Salty",
      metal: "Diamond",
    },
    {
      planet: "Mars",
      familial: "Brother",
      political: "Army",
      personal: "Courage, bravery",
      bodyPart: "Blood",
      color: "Pink",
      direction: "South",
      place: "Place of fire",
      taste: "Bitter",
      metal: "Gold",
    },
    {
      planet: "Mercury",
      familial: "Children",
      political: "Prince princess",
      personal: "Speech, cleaver",
      bodyPart: "Skin",
      color: "Green",
      direction: "North",
      place: "Place of athletic",
      taste: "Mix",
      metal: "Gold",
    },
    {
      planet: "Jupiter",
      familial: "Guardians",
      political: "Advisor",
      personal: "Knowledge, wisdom",
      bodyPart: "Muscle",
      color: "Yellow",
      direction: "North east",
      place: "Place of store",
      taste: "Sugar",
      metal: "Silver",
    },
    {
      planet: "Venus",
      familial: "Sister",
      political: "Minister",
      personal: "Happiness, love",
      bodyPart: "Sperm ova",
      color: "Gray",
      direction: "South east",
      place: "Place for relief rest",
      taste: "Acidic",
      metal: "Pearl",
    },
    {
      planet: "Saturn",
      familial: "Worker",
      political: "Bureaucrat",
      personal: "Agony, suffer",
      bodyPart: "Nerve",
      color: "Black",
      direction: "West",
      place: "Barren place",
      taste: "Bitter",
      metal: "Pearl",
    },
    {
      planet: "Rahu",
      familial: "Out family member",
      political: "Diplomatist",
      personal: "Matter of Upheaval",
      bodyPart: "Blood",
      color: "Brown",
      direction: "South west",
      place: "Place for animal",
      taste: "Acidic",
      metal: "Iron",
    },
    {
      planet: "Ketu",
      familial: "Person to create Quarrel",
      political: "Matter of interfere",
      personal: "Enlightenment, salvation",
      bodyPart: "Nerve",
      color: "Blue",
      direction: "Center",
      place: "Place for salvation",
      taste: "Sugar",
      metal: "Glass",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Introduction Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Understanding Astrology
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-6">
              Astrology is an ancient practice that studies the movements and
              relative positions of celestial bodies, such as the sun, moon,
              planets, and stars, believing that they influence human affairs
              and terrestrial events.
            </p>
            <p className="text-lg text-gray-600">
              This ancient art examines how the placement of celestial bodies at
              the time of one's birth, along with their ongoing movements, can
              influence personality traits, relationships, career paths, and
              life events. Each planet is believed to govern different aspects
              of life, from personal characteristics to family dynamics and
              societal roles.
            </p>
          </div>
        </div>
      </div>

      {/* Astrology Chart Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="lg:text-center mb-12">
          <h2 className="text-3xl font-bold text-indigo-600">
            Planetary Influences in Astrology
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Each planet governs specific aspects of life, from personal
            characteristics to worldly matters.
          </p>
        </div>

        <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(astrologyData[0]).map((header) => (
                    <th
                      key={header}
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {astrologyData.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {Object.values(item).map((value, valueIndex) => (
                      <td
                        key={valueIndex}
                        className="px-3 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
