import { ReviewData } from "../data/Review.Data";
import { ReviewDTO, CreateReviewDTO } from "../dto/ReviewDTO"
import { RideData } from "../data/Ride.Data";
import { UserData } from "../data/User.Data";
class ReviewService {
    reviewData = new ReviewData();
    rideData = new RideData();
    userData = new UserData();
    async getReviewsById(userId: number, page: number, limit: number): Promise<ReviewDTO[]>{
        try{
            const user = await this.reviewData.getReviews(userId, page, limit);
            if (!user) {
                if (page === 1) {
                    throw new Error("Nenhuma avaliação foi encontrada para este usuário.");
                }
                else {
                    throw new Error("Esta página não possui avaliações.");
                }
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
        const existingReview = await this.reviewData.searchReview(reviewData.ride_id, reviewData.reviewer_id ,reviewData.reviewee_id);
        if (existingReview === true){
            throw new Error("Você ja avaliou este motorista nesta corrida.") ;
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