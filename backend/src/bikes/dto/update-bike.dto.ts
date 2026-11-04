import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  ValidateIf,
} from "class-validator";

const trimmed = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;
const isProvided = (_object: unknown, value: unknown) => value !== undefined;

export class UpdateBikeDto {
  @ValidateIf(isProvided)
  @Transform(trimmed)
  @IsString()
  @IsNotEmpty()
  brand?: string;

  @ValidateIf(isProvided)
  @Transform(trimmed)
  @IsString()
  @IsNotEmpty()
  model?: string;

  @ValidateIf(isProvided)
  @Transform(trimmed)
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ValidateIf(isProvided)
  @Transform(trimmed)
  @IsString()
  @IsNotEmpty()
  category?: string;

  @ValidateIf(isProvided)
  @Transform(trimmed)
  @IsString()
  @IsNotEmpty()
  frameMaterial?: string;

  @ValidateIf(isProvided)
  @IsNumber()
  @IsPositive()
  frameSizeCm?: number;

  @ValidateIf(isProvided)
  @IsNumber()
  @IsPositive()
  wheelSizeInches?: number;

  @ValidateIf(isProvided)
  @IsInt()
  @IsPositive()
  gearCount?: number;

  @ValidateIf(isProvided)
  @IsNumber()
  @IsPositive()
  weightKg?: number;

  @ValidateIf(isProvided)
  @IsBoolean()
  electric?: boolean;

  @ValidateIf(isProvided)
  @IsInt()
  @Min(0)
  priceCents?: number;
}
