import { Request, Response } from "express";
import AuthService from '../services/AuthService';

class SessionController{
    async createSession(req: Request, res: Response) : Promise<Response> {
        const { email, password } = req.body;
        try{
            const { user, token  } = await AuthService.login({ email, password });
            return res.status(200).json({ user, token });
        }catch(error){
            let errorMessage: string;
            if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = "Ocorreu um erro inesperado.";
            }
            return res.status(401).json({ error: errorMessage });
        }
    }
}
export default new SessionController();