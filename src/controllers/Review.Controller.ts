import { Request, Response } from "express";
import ReviewService from "../services/Review.Service";

class ReviewController {
    async getReviews(req: Request, res:Response):Promise<Response>{
        try{
            const userId = Number(req.params.id);
            const userReviews = await ReviewService.getReviewsById(userId);
            return res.status(200).json(userReviews);
        }catch(error:any){
            if (error.message === "Nenhuma avaliação foi encontrada para este usuário."){
                return res.status(404).json({ error: error.message });
            } 
            return res.status(500).json({ error: "Ocorreu um erro interno ao buscar reviews." });
        }
               
    }
}
export default new ReviewController();
