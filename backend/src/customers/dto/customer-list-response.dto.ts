import { CustomerResponseDto } from "./customer-response.dto";

export class CustomerListResponseDto {
  totalCount: number;
  customers: CustomerResponseDto[];
}
