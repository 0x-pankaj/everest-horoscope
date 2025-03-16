// components/AstrologerDetailCard.tsx
//

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/Auth";
import Image from "next/legacy/image";
import { Astrologer } from "@/types/user";

interface AstrologerCardProps {
  astrologer: Astrologer;
}

export const AstrologerDetailCard: React.FC<AstrologerCardProps> = ({
  astrologer,
}) => {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleChatClick = () => {
    if (!user?.$id) {
      router.push("/login");
      return;
    }
    router.push(`/chat/${astrologer.$id}/${user.$id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row md:space-x-6">
        <div className="mb-4 md:mb-0">
          <Image
            height={100}
            width={100}
            src={astrologer.photoUrl || "/default-avatar.png"}
            alt={astrologer.name}
            className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0"
          />

          {astrologer.isOnline && (
            <div className="flex items-center justify-center mt-2 text-green-500">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Online</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{astrologer.name}</h2>
            {/* <div className="text-right">
              <p className="text-xl font-semibold">
                ₹{astrologer.hourlyRate}/hr
              </p>
            </div> */}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Rating</p>
              <p className="font-semibold flex items-center">
                <span className="text-yellow-500 mr-1">⭐</span>
                {astrologer.rating.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Experience</p>
              <p className="font-semibold">{astrologer.experience} years</p>
            </div>
            <div>
              <p className="text-gray-600">Consultations</p>
              <p className="font-semibold">
                {astrologer.totalConsultations || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Satisfaction</p>
              <p className="font-semibold">
                {astrologer.satisfactionRate || 0}%
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {astrologer.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {astrologer.language.map((lang, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-gray-700">{astrologer.bio}</p>
          </div>

          {astrologer.isOnline && (
            <button
              onClick={handleChatClick}
              className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 w-full"
            >
              Start Consultation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
