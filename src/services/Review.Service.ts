import { ReviewData } from "../data/Review.Data";
import { ReviewDTO, CreateReviewDTO } from "../dto/ReviewDTO"
import { RideData } from "../data/Ride.Data";
import { UserData } from "../data/User.Data";
class ReviewService {
    reviewData = new ReviewData();
    rideData = new RideData();
    userData = new UserData();
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
    async createReview(reviewData: CreateReviewDTO): Promise<CreateReviewDTO[]>{
        const ride = await this.rideData.findById(reviewData.ride_id);
        if (!ride) {
            throw new Error("Carona não encontrada.");
        }
        const reviewee = await this.userData.getById(reviewData.reviewee_id);
        if (!reviewee) {
            throw new Error("Usuário avaliado não encontrado.");
        }
        if (reviewData.reviewer_id === reviewData.reviewee_id) {
            throw new Error("Um usuário não pode avaliar a si mesmo.");
        }
        try{
            const review = await this.reviewData.createReview(reviewData);
            return review;
        }catch(error:any){
            throw new Error(error.message);   
        }
    }
}
export default new ReviewService();