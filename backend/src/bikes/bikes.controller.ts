import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { PaginationQueryDto } from "../shared/pagination/pagination-query.dto";
import { BikesService } from "./bikes.service";
import { BikeListResponseDto } from "./dto/bike-list-response.dto";
import { BikeResponseDto } from "./dto/bike-response.dto";
import { CreateBikeDto } from "./dto/create-bike.dto";
import { UpdateBikeDto } from "./dto/update-bike.dto";
import type { CreateBikeModel, UpdateBikeModel } from "./models/bike.model";

@Controller("bikes")
export class BikesController {
  constructor(@Inject(BikesService) private readonly service: BikesService) {}

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<BikeListResponseDto> {
    const page = await this.service.findAll(query);
    return {
      totalCount: page.totalCount,
      bikes: page.items.map((model) => BikeResponseDto.fromModel(model)),
    };
  }

  @Post()
  async create(@Body() dto: CreateBikeDto): Promise<BikeResponseDto> {
    const input: CreateBikeModel = { ...dto };
    return BikeResponseDto.fromModel(await this.service.create(input));
  }

  @Get(":id")
  async findById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<BikeResponseDto> {
    return BikeResponseDto.fromModel(await this.service.findById(id));
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateBikeDto,
  ): Promise<BikeResponseDto> {
    const input: UpdateBikeModel = { ...dto };
    return BikeResponseDto.fromModel(await this.service.update(id, input));
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    await this.service.delete(id);
  }
}
