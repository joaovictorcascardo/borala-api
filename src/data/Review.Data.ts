import { db } from "../database/connection";
import { ReviewDTO, CreateReviewDTO } from "../dto/ReviewDTO"

export class ReviewData {
    async getReviews(reviewee_id: number, page: number, limit: number): Promise<null | ReviewDTO[]> {
        try{
            const offset = (page - 1) * limit;
            const reviews = await db("reviews")
                .select('reviewer_id', 'rating', 'comment')
                .where({ reviewee_id })
                .limit(limit)
                .offset(offset);
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
    async searchReview(ride_id: number, reviewer_id: number, reviewee_id: number):Promise <boolean>{
        try {
            const review = await db("reviews")
                .where({
                    ride_id: ride_id,
                    reviewer_id: reviewer_id,
                    reviewee_id: reviewee_id
                })
                .first();
                if(!review){
                    return false
                }
            return true;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async isPassenger(ride_id: number, user_id: number): Promise<boolean> {
        try {
            const booking = await db("bookings")
                .where({
                    ride_id,
                    passenger_id: user_id,
                    status: "CONFIRMED"
                })
                .first();
            if(!booking){
                return false
            }
            return true;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}
