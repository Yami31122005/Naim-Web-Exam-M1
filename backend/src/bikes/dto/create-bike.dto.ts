import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from "class-validator";

const trimmed = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

export class CreateBikeDto {
  @Transform(trimmed)
  @IsString()
  @IsNotEmpty()
  brand: string;

  @Transform(trimmed)
  @IsString()
  @IsNotEmpty()
  model: string;

  @Transform(trimmed)
  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(trimmed)
  @IsString()
  @IsNotEmpty()
  category: string;

  @Transform(trimmed)
  @IsString()
  @IsNotEmpty()
  frameMaterial: string;

  @IsNumber()
  @IsPositive()
  frameSizeCm: number;

  @IsNumber()
  @IsPositive()
  wheelSizeInches: number;

  @IsInt()
  @IsPositive()
  gearCount: number;

  @IsNumber()
  @IsPositive()
  weightKg: number;

  @IsBoolean()
  electric: boolean;

  @IsInt()
  @Min(0)
  priceCents: number;
}
