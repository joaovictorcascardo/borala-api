export interface ReviewDTO{
    reviewer_id: number;
    rating: number;
    comment: string;
}
export interface CreateReviewDTO {
    ride_id: number
    reviewee_id: number;
    reviewer_id: number;
    rating: number;
    comment: string;
}