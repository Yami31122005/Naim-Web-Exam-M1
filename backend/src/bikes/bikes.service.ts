import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type {
  PageModel,
  PageQueryModel,
} from "../shared/pagination/page.model";
import { BikesRepository } from "./bikes.repository";
import type {
  BikeModel,
  CreateBikeModel,
  UpdateBikeModel,
} from "./models/bike.model";
import {
  BikeInUseError,
  BikeNotFoundError,
} from "./models/persistence-error.model";

@Injectable()
export class BikesService {
  constructor(
    @Inject(BikesRepository) private readonly repository: BikesRepository,
  ) {}

  findAll(query: PageQueryModel): Promise<PageModel<BikeModel>> {
    return this.repository.findAll(query);
  }

  async findById(id: string): Promise<BikeModel> {
    const bike = await this.repository.findById(id);
    if (!bike) throw new NotFoundException("Bike not found");
    return bike;
  }

  create(input: CreateBikeModel): Promise<BikeModel> {
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateBikeModel): Promise<BikeModel> {
    if (!Object.values(input).some((value) => value !== undefined))
      throw new BadRequestException("At least one field must be supplied");
    try {
      return await this.repository.update(id, input);
    } catch (error) {
      this.translateError(error);
    }
  }

  async delete(id: string): Promise<void> {
    if (!(await this.repository.findById(id)))
      throw new NotFoundException("Bike not found");
    if (await this.repository.hasSales(id))
      throw new ConflictException(
        "Bike is linked to a sale and cannot be deleted",
      );
    try {
      if (!(await this.repository.delete(id)))
        throw new NotFoundException("Bike not found");
    } catch (error) {
      this.translateError(error);
    }
  }

  private translateError(error: unknown): never {
    if (error instanceof BikeNotFoundError)
      throw new NotFoundException("Bike not found");
    if (error instanceof BikeInUseError)
      throw new ConflictException(
        "Bike is linked to a sale and cannot be deleted",
      );
    throw error;
  }
}
