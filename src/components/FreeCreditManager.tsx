import React, { useState } from "react";
import { useAuthStore } from "@/store/Auth";
import toast from "react-hot-toast";
import { X } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface FreeCreditManagerProps {
  userId: string;
  userName?: string;
  initialPosition?: Position;
}

const FreeCreditManager: React.FC<FreeCreditManagerProps> = ({
  userId,
  userName,
  initialPosition = { x: 20, y: 20 },
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [credits, setCredits] = useState<number>(0);
  const [position, setPosition] = useState<Position>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  const { updateFreeMessageCredits } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateFreeMessageCredits(userId, credits);
    if (result.success) {
      toast.success(
        `Successfully added ${credits} free message credits for ${userName || "user"}`,
      );
      setCredits(0);
      setIsOpen(false);
    } else {
      toast.error(result.error || "Failed to update free message credits");
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target instanceof HTMLElement &&
      e.target.classList.contains("modal-header")
    ) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Ensure the modal stays within viewport bounds
      const modalWidth = 320; // Approximate modal width
      const modalHeight = 250; // Approximate modal height
      const maxX = window.innerWidth - modalWidth;
      const maxY = window.innerHeight - modalHeight;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className=" fixed bottom-20 right-16 bg-gradient-to-r from-purple-600 to-yellow-500 hover:from-purple-700 hover:to-yellow-600 text-white rounded-full p-4 shadow-lg"
      >
        Manage Free Credits
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50" onMouseUp={handleMouseUp}>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div
            className="fixed bg-white rounded-lg shadow-xl"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: "320px",
            }}
            onMouseMove={handleMouseMove}
          >
            {/* Draggable Header */}
            <div
              className="modal-header flex justify-between items-center p-4 cursor-move bg-indigo-600 text-white rounded-t-lg"
              onMouseDown={handleMouseDown}
            >
              <h3 className="text-lg font-semibold">Manage Free Credits</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="credits"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Number of Free Messages for {userName || "User"}
                  </label>
                  <input
                    type="number"
                    id="credits"
                    min="0"
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
                  >
                    Update Credits
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            {/* Position Controls */}
            <div className="p-4 border-t">
              <div className="flex space-x-2 text-sm">
                <button
                  onClick={() => setPosition({ ...position, x: 20 })}
                  className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Left
                </button>
                <button
                  onClick={() =>
                    setPosition({ ...position, x: window.innerWidth - 340 })
                  }
                  className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Right
                </button>
                <button
                  onClick={() => setPosition({ ...position, y: 20 })}
                  className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Top
                </button>
                <button
                  onClick={() =>
                    setPosition({ ...position, y: window.innerHeight - 270 })
                  }
                  className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Bottom
                </button>
                <button
                  onClick={() =>
                    setPosition({
                      x: (window.innerWidth - 320) / 2,
                      y: (window.innerHeight - 250) / 2,
                    })
                  }
                  className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Center
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FreeCreditManager;
