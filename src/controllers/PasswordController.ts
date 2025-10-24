import { Request, Response } from "express";
import AuthService from "../services/AuthService";

class PasswordController{
    async forgotPassword (req: Request, res: Response): Promise<Response> {
        const { email } = req.body;
        try{
            await AuthService.forgotPassword(email);
            return res.status(204).send();
        }catch(error){
            let errorMessage: string;

            if (error instanceof Error) {
                errorMessage = error.message;
            } else {
                errorMessage = "Ocorreu um erro inesperado.";
            }
            return res.status(500).json({ error: errorMessage });
        }
    }
    async resetPassword (req: Request, res: Response): Promise<Response>{
        try{
            const { token, password, password_confirmation } = req.body;
            await AuthService.resetPassword({ token, password, password_confirmation })
            return res.status(204).send();
        }catch(error){
            let errorMessage: string;
            if (error instanceof Error) {
                errorMessage = error.message;
            }else {
                errorMessage = "Ocorreu um erro inesperado.";
            }
            return res.status(400).json({ error: errorMessage });
        }
    }
    
}
export default new PasswordController();