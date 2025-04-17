import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { client, database } from "@/appwrite/clientConfig";
import conf from "@/conf/conf";
import { Models } from "appwrite";
import { useAuthStore } from "@/store/Auth";
import toast from "react-hot-toast";

interface ReviewProps {
  astrologerId: string;
  userId: string;
  onClose?: () => void;
  onReviewSubmit?: () => void;
}

// Component for showing and submitting reviews
const ReviewSystem: React.FC<ReviewProps> = ({
  astrologerId,
  userId,
  onClose,
  onReviewSubmit,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [userReviews, setUserReviews] = useState<Models.Document[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuthStore();

  // Fetch existing reviews for this astrologer
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await database.listDocuments(
          conf.appwriteHoroscopeDatabaseId,
          conf.appwriteReviewsCollectionId,
        );

        const astrologerReviews = response.documents.filter(
          (doc) => doc.astrologer_id === astrologerId,
        );

        setUserReviews(astrologerReviews);

        // Calculate average rating
        if (astrologerReviews.length > 0) {
          const sum = astrologerReviews.reduce(
            (acc, review) => acc + review.rating,
            0,
          );
          setAverageRating(sum / astrologerReviews.length);
        }

        // Check if current user has already reviewed this astrologer
        const userReview = astrologerReviews.find(
          (review) => review.user_id === userId,
        );

        if (userReview) {
          setHasReviewed(true);
          setRating(userReview.rating);
          setComment(userReview.comment);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    if (astrologerId && userId) {
      fetchReviews();
    }
  }, [astrologerId, userId]);

  const handleSubmitReview = async () => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    try {
      if (hasReviewed) {
        // Find the user's existing review
        const existingReview = userReviews.find(
          (review) => review.user_id === userId,
        );

        if (existingReview) {
          // Update the existing review
          await database.updateDocument(
            conf.appwriteHoroscopeDatabaseId,
            conf.appwriteReviewsCollectionId,
            existingReview.$id,
            {
              rating,
              comment,
              // updated_at: new Date().toISOString(),
            },
          );

          toast.success("Review updated successfully");
        }
      } else {
        console.log("creating new review ");
        // Create a new review
        const response = await database.createDocument(
          conf.appwriteHoroscopeDatabaseId,
          conf.appwriteReviewsCollectionId,
          "unique()",
          {
            user_id: userId,
            user_name: user?.name || "Anonymous",
            astrologer_id: astrologerId,
            rating,
            comment,
          },
        );

        console.log("response: ", response);

        toast.success("Review submitted successfully");
        setHasReviewed(true);
      }

      if (onReviewSubmit) {
        onReviewSubmit();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Reviews & Ratings</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-4">Loading reviews...</div>
      ) : (
        <>
          {/* Average Rating Display */}
          <div className="mb-6 text-center">
            <div className="text-2xl font-bold">
              {averageRating.toFixed(1)}/5
            </div>
            <div className="flex justify-center my-2">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <FaStar
                    key={index}
                    size={24}
                    color={
                      starValue <= Math.round(averageRating)
                        ? "#FFD700"
                        : "#e4e5e9"
                    }
                  />
                );
              })}
            </div>
            <div className="text-sm text-gray-500">
              Based on {userReviews.length} review
              {userReviews.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Review Submission Form */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">
              {hasReviewed ? "Update Your Review" : "Write a Review"}
            </h3>
            <div className="flex mb-3">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <label key={index}>
                    <input
                      type="radio"
                      name="rating"
                      className="hidden"
                      value={starValue}
                      onClick={() => setRating(starValue)}
                    />
                    <FaStar
                      size={24}
                      color={
                        starValue <= (hover || rating) ? "#FFD700" : "#e4e5e9"
                      }
                      onMouseEnter={() => setHover(starValue)}
                      onMouseLeave={() => setHover(0)}
                      className="cursor-pointer mr-1"
                    />
                  </label>
                );
              })}
            </div>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Share your experience with this astrologer..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={handleSubmitReview}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {hasReviewed ? "Update Review" : "Submit Review"}
            </button>
          </div>

          {/* List of Reviews */}
          <div>
            <h3 className="font-medium mb-2">User Reviews</h3>
            {userReviews.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                No reviews yet. Be the first to review!
              </div>
            ) : (
              userReviews.map((review) => (
                <div key={review.$id} className="border-b border-gray-100 py-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{review.user_name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex my-1">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        size={16}
                        color={index < review.rating ? "#FFD700" : "#e4e5e9"}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewSystem;
