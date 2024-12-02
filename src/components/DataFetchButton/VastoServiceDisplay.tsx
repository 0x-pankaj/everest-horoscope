import React, { useState, useEffect } from "react";
import { storage } from "@/appwrite/clientConfig";
import { VastoServiceData } from ".";
import conf from "@/conf/conf";

const ImagePreview = ({ fileId }: { fileId: string }) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const url = storage.getFilePreview(
          conf.appwriteHoroscopeBucket,
          fileId,
          400, // width
          300, // height
          // 'center', // gravity
          // 100, // quality
          // 1, // border
          // '', // output (empty for original format)
          // '', // rotation (empty for no rotation)
        );
        setImageUrl(url.href);
      } catch (err) {
        setError("Failed to load image");
        console.error("Error loading image:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (fileId) {
      loadImage();
    }
  }, [fileId]);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-48 rounded-md"></div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  return (
    <img 
      src={imageUrl} 
      alt="House Map" 
      className="w-full h-48 object-cover rounded-md"
      onError={() => setError("Failed to load image")}
    />
  );
};

const VastoServiceDisplay = ({ data, onClose }: { data: VastoServiceData[], onClose: () => void }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-yellow-500">
        Vasto Service Submissions
      </h2>

      {data.map((service, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">{service.name}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">House Map</label>
              <div className="mt-1">
                <ImagePreview fileId={service.houseMap} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">{service.email}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">{service.location}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Direction</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">{service.direction}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Selected Services</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {service.selectedServices.map((item, i) => (
                <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <div className="mt-1 p-2 bg-gray-50 rounded-md">{service.message}</div>
          </div>
        </div>
      ))}

      <button
        onClick={onClose}
        className="mt-6 w-full bg-gradient-to-r from-purple-600 to-yellow-500 text-white py-2 px-4 rounded-md hover:from-purple-700 hover:to-yellow-600"
      >
        Close
      </button>
    </div>
  );
};

export default VastoServiceDisplay;