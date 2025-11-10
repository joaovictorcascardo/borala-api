import { db } from "../database/connection";
import { ReviewDTO, CreateReviewDTO } from "../dto/ReviewDTO"

export class ReviewData {
    async getReviews(reviewee_id: number): Promise<null | ReviewDTO[]> {
        try{
            const reviews = await db("reviews").select('reviewer_id', 'rating', 'comment').where({ reviewee_id });
            if (reviews.length === 0) {
                return null;
            }
            return reviews
        }catch(error: any){
            throw new Error(error.message);
        }
    }
    async createReview(dataReview: CreateReviewDTO){
        try {
            const review = await db("reviews")
                .insert({
                    ride_id: dataReview.ride_id, 
                    reviewer_id: dataReview.reviewer_id,
                    reviewee_id: dataReview.reviewee_id,
                    rating: dataReview.rating,
                    comment: dataReview.comment,
                })
                .returning([
                    "ride_id",
                    "reviewer_id", 
                    "reviewee_id", 
                    "rating",
                    "comment"
                ]);
            return review;
        }catch(error: any){
            throw new Error(error.message);
        }
    }
}