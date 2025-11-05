import { db } from "../database/connection";
import { CreateVehicleDTO } from "../dto/VehicleDTO";


export class VehicleData{
    async existingVehicle(license_plate: string): Promise<null>{
        try{
            const SearchPlate = await db("vehicles")
                .where({ license_plate })
                .first();
            if (SearchPlate) {
                throw new Error("Veículo com esta placa já cadastrado.");
            }
            return null;
        }catch(error: any){
            throw new Error(error.message);
        }
    }
    async verifyVehicleByIdAndUserId(id: number, user_id: number){
        try{
            const vehicle = await db("vehicles")
                .where({
                    id,
                    user_id,
                })
                .first();
            if (!vehicle) {
                throw new Error("Veículo não encontrado ou não pertence ao motorista.");
            }
            return null;
        }catch(error:any){
            throw new Error(error.message);
        }
    }
    async createVehicle({ brand, model, color, license_plate, year, seats, userId }: CreateVehicleDTO):Promise<CreateVehicleDTO>{
        try{
            const [newVehicle] = await db("vehicles")
                .insert({
                    brand,
                    model,
                    color,
                    license_plate,
                    year,
                    seats,
                    user_id: userId,
                })
                .returning("*");
            delete newVehicle.create_at;
            delete newVehicle.update_at;
            return newVehicle;
        }catch(error: any){
            throw new Error(error.message);
        }
    }
    async FindByUserId(user_id: number): Promise<CreateVehicleDTO[]>{
        try{
            const UserVehicles = await db("vehicles")
                .where({ user_id })
                .select(
                    "id",
                    "brand",
                    "model",
                    "color",
                    "license_plate",
                    "year",
                    "seats"
                );
            if(!UserVehicles){
                throw new Error ("Nenhum veiculo vinculado ao Id informado.");
            }
            return UserVehicles;
        }catch(error: any){
            throw new Error(error.message);
        }
    }
}
