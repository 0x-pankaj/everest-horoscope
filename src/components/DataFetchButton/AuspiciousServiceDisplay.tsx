import React, { useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { AuspiciousFormData } from "../VastoForm";

interface AuspiciousFormData {
  id?: string;
  category: string; // Note: This might be a typo, should it be "category"?
  auspiciousPurpose: string;
  startDate: string;
  endDate: string;
}

interface AuspiciousServiceDisplayProps {
  data: AuspiciousFormData[];
  onClose: () => void;
}

const AuspiciousServiceDisplay: React.FC<AuspiciousServiceDisplayProps> = ({
  data,
  onClose,
}) => {
  // useEffect(() => {
  //   console.log("AuspiciousServiceDisplay mounted");
  //   console.log("Received data:", data);
  //   console.log("Data type:", typeof data);
  //   console.log("Is array:", Array.isArray(data));
  // }, [data]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "No date provided";
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  // Early return with debugging information if data is invalid
  if (!data) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <p className="text-red-500">No data provided</p>
      </div>
    );
  }

  // if (!Array.isArray(data)) {
  //   return (
  //     <div className="w-full max-w-4xl mx-auto p-4">
  //       <p className="text-red-500">Invalid data format: expected an array</p>
  //       <pre className="mt-2 p-2 bg-gray-100 rounded">
  //         {JSON.stringify(data, null, 2)}
  //       </pre>
  //     </div>
  //   );
  // }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-purple-600">
            Auspicious Service Submissions
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        <ScrollArea className="h-[60vh]">
          <div className="space-y-4 p-4">
            {data.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No auspicious service submissions found
              </p>
            ) : (
              data.map((submission, index) => (
                <Card key={submission.id || index} className="w-full">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-purple-600 mb-2">
                          Category
                        </h3>
                        <p className="text-gray-700">
                          {submission.category || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-purple-600 mb-2">
                          Purpose
                        </h3>
                        <p className="text-gray-700">
                          {submission.auspiciousPurpose || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-purple-600 mb-2">
                          Start Date
                        </h3>
                        <p className="text-gray-700">
                          {formatDate(submission.startDate)}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-purple-600 mb-2">
                          End Date
                        </h3>
                        <p className="text-gray-700">
                          {formatDate(submission.endDate)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      Submission ID: {submission.id || `temp-${index}`}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AuspiciousServiceDisplay;
