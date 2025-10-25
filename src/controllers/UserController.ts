import { Request, Response } from "express";
import UserService from "../services/UserService";

class UserController {
  async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email, password, birth_date, phone } = request.body;

      const user = await UserService.create({
        name,
        email,
        password,
        phone,
        birth_date: new Date(birth_date),
      });

      return response.status(201).json(user);
    } catch (error: any) {
      if (error.message === "Este e-mail já está em uso.") {
        return response.status(409).json({ error: error.message });
      }
      console.error(error);
      return response
        .status(500)
        .json({ error: "Ocorreu um erro interno ao criar o usuário." });
    }
  }
}

export default new UserController();
