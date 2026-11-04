import { BikeResponseDto } from "./bike-response.dto";

export class BikeListResponseDto {
  totalCount: number;
  bikes: BikeResponseDto[];
}
