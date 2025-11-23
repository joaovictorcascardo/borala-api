import ReviewService from "../../src/services/Review.Service";
import { ReviewData } from "../../src/data/Review.Data";
import { RideData } from "../../src/data/Ride.Data";
import { UserData } from "../../src/data/User.Data";
import { BookingData } from "../../src/data/Booking.Data";

jest.mock("../../src/data/Review.Data");
jest.mock("../../src/data/Ride.Data");
jest.mock("../../src/data/User.Data");
jest.mock("../../src/data/Booking.Data");

describe("Review Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createReview", () => {
    const reviewDTO = {
      ride_id: 10,
      reviewer_id: 100,
      reviewee_id: 200,
      rating: 5,
      comment: "Excelente!",
    };

    it("deve criar avaliação com sucesso", async () => {
      (RideData.prototype.findById as jest.Mock).mockResolvedValue({
        id: 10,
        status: "COMPLETED",
        driver_id: 200,
      });
      (UserData.prototype.getById as jest.Mock).mockResolvedValue({ id: 200 });

      (BookingData.prototype.isPassenger as jest.Mock).mockResolvedValue(true);

      (ReviewData.prototype.searchReview as jest.Mock).mockResolvedValue(false);
      (ReviewData.prototype.createReview as jest.Mock).mockResolvedValue(
        reviewDTO
      );

      const result = await ReviewService.createReview(reviewDTO);

      expect(result).toEqual(reviewDTO);
    });

    it("deve lançar erro se for autoavaliação", async () => {
      (RideData.prototype.findById as jest.Mock).mockResolvedValue({
        id: 10,
        status: "COMPLETED",
        driver_id: 100,
      });
      (UserData.prototype.getById as jest.Mock).mockResolvedValue({ id: 100 });

      await expect(
        ReviewService.createReview({ ...reviewDTO, reviewee_id: 100 })
      ).rejects.toThrow("Um usuário não pode avaliar a si mesmo.");
    });

    it("deve lançar erro se já houver avaliação", async () => {
      (RideData.prototype.findById as jest.Mock).mockResolvedValue({
        id: 10,
        status: "COMPLETED",
        driver_id: 200,
      });
      (UserData.prototype.getById as jest.Mock).mockResolvedValue({ id: 200 });

      (BookingData.prototype.isPassenger as jest.Mock).mockResolvedValue(true);
      (ReviewData.prototype.searchReview as jest.Mock).mockResolvedValue(true);

      await expect(ReviewService.createReview(reviewDTO)).rejects.toThrow(
        "Você ja avaliou este motorista/passageiro nesta carona."
      );
    });
  });
});
