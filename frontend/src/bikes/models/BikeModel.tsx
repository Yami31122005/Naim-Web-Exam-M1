export type BikeModel = {
  id: string;
  brand: string;
  model: string;
  description: string;
  category: string;
  frameMaterial: string;
  frameSizeCm: number;
  wheelSizeInches: number;
  gearCount: number;
  weightKg: number;
  electric: boolean;
  // Prices are stored in cents by the API
  priceCents: number;
};

export type CreateBikeModel = Omit<BikeModel, "id">;

// Only the fields sent are changed
export type UpdateBikeModel = Partial<CreateBikeModel>;
