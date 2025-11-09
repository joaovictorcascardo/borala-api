import { ReviewData } from "../data/Review.Data";
import { ReviewDTO } from "../dto/ReviewDTO"
class ReviewService {
    reviewData = new ReviewData();
    async getReviewsById(userId: number): Promise<ReviewDTO[]>{
        try{
            const user = await this.reviewData.getReviews(userId);
            if (!user){
                throw new Error("Nenhuma avaliação foi encontrada para este usuário.")
            }
            return user;
        }catch(error: any){
            throw new Error(error.message);   
        }
    }
}
export default new ReviewService();