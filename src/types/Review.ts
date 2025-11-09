export interface Review{
    id: number;
    ride_id: number;
    reviewer_id: number;
    reviewee_id: number;
    rating: number;
    comment: string;
    created_at: Date;
}