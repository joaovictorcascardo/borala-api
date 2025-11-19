import { db } from "../database/connection";
import { CreateVehicleDTO, UpdateVehicleDTO, UserVehicleListDTO } from "../dto/VehicleDTO";
import { Vehicle } from "../types/Vehicle";

export class VehicleData {
  async findByLicensePlate(
    license_plate: string
  ): Promise<Vehicle | undefined> {
    try {
      const vehicle = await db("vehicles").where({ license_plate }).first();
      return vehicle;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async findByIdAndUserId(
    id: number,
    user_id: number
  ): Promise<Vehicle | undefined> {
    try {
      const vehicle = await db("vehicles")
        .where({
          id,
          user_id,
        })
        .first();
      return vehicle;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createVehicle({
    brand,
    model,
    color,
    license_plate,
    year,
    seats,
    userId,
  }: CreateVehicleDTO): Promise<Vehicle> {
    try {
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

      return newVehicle;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  async FindByUserId(user_id: number, page: number, limit: number): Promise<UserVehicleListDTO[]> {
    try {
      const offset = (page - 1) * limit;
      const userVehicles = await db("vehicles")
        .where({ user_id })
        .select(
          "id",
          "brand",
          "model",
          "color",
          "license_plate",
          "year",
          "seats"
        )
        .limit(limit)
        .offset(offset);
      return userVehicles;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async update(id: number, data: UpdateVehicleDTO): Promise<Vehicle> {
    try {
      const [updatedVehicle] = await db("vehicles")
        .where({ id })
        .update(data)
        .returning("*");
      return updatedVehicle;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await db("vehicles").where({ id }).delete();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async findById(id: number): Promise<Vehicle | undefined> {
    try {
      const vehicle = await db("vehicles").where({ id }).first();
      return vehicle;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
