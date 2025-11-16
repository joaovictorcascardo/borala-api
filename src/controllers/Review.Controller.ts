import { Request, Response } from "express";
import ReviewService from "../services/Review.Service";
import { AuthenticatedRequest } from "../types/Auth";

class ReviewController {
    async getReviews(req: Request, res:Response):Promise<Response>{
        try{
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 5;
            const userId = Number(req.params.id);
            const userReviews = await ReviewService.getReviewsById(userId, page, limit);
            return res.status(200).json(userReviews);
        }catch(error:any){
            if (error.message === "Esta página não possui avaliações."){
                return res.status(404).json({ error: error.message });
            }
            if (error.message === "Nenhuma avaliação foi encontrada para este usuário."){
                return res.status(404).json({ error: error.message });
            } 
            return res.status(500).json({ error: "Ocorreu um erro interno ao buscar reviews." });
        }
               
    }
    async create(req: AuthenticatedRequest, res: Response):Promise<Response>{
        try{
            if (!req.user) {
                return res.status(401).json({ error: "Usuário não autenticado." });
            }
            const reviewCreate = {
                ...req.body,                
                reviewer_id: Number(req.user.id),
                ride_id: Number(req.params.rideId)
            };
            
            const review = await ReviewService.createReview(reviewCreate);
            return res.status(201).json(review);
        }catch(error: any){
            if (error.message === "Carona não encontrada."){
                return res.status(404).json({ error: error.message });
            }else if(error.message === "Usuário avaliado não encontrado."){
                return res.status(404).json({ error: error.message });
            } else if (error.message === "Um usuário não pode avaliar a si mesmo."){
                return res.status(400).json({ error: error.message });
            } else if (error.message === "Você ja avaliou este motorista/passageiro nesta carona."){
                return res.status(400).json({ error: error.message });
            } else if (error.message === "Você só pode avaliar caronas que já foram concluídas."){
                return res.status(403).json({ error: error.message });
            } else if (error.message === "O usuário que você quer avaliar não participou desta carona.") {
                return res.status(403).json({ error: error.message });
            } else if (error.message === "Você não participou desta carona, então não pode avaliá-la.") {
                return res.status(403).json({ error: error.message });
            }
            return res.status(500).json({ error: "Ocorreu um erro interno ao criar review." });
        }
    }
}
export default new ReviewController();
