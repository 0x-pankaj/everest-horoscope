// File: app/api/getAstrologerRating/[id]/route.ts
import { database } from "@/appwrite/serverConfig";
import conf from "@/conf/conf";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const astrologerId = params.id;

    // Get all reviews for this astrologer
    const response = await database.listDocuments(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteReviewsCollectionId,
    );

    // Filter reviews for the specific astrologer
    const astrologerReviews = response.documents.filter(
      (doc) => doc.astrologer_id === astrologerId,
    );

    // Calculate average rating
    let averageRating = 0;
    if (astrologerReviews.length > 0) {
      const sum = astrologerReviews.reduce(
        (acc, review) => acc + review.rating,
        0,
      );
      averageRating = sum / astrologerReviews.length;
    }

    return NextResponse.json({
      averageRating,
      totalReviews: astrologerReviews.length,
    });
  } catch (error) {
    console.error("Error fetching astrologer rating:", error);
    return NextResponse.json(
      { error: "Failed to fetch astrologer rating" },
      { status: 500 },
    );
  }
}
