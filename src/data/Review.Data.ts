import { db } from "../database/connection";
import { ReviewDTO } from "../dto/ReviewDTO"

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
}