import { IsOptional, IsString, IsNumber } from 'class-validator';

export class GetPaymentsQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 20;
}

export class GetPaymentsResponseDto {
  data: any[]; // TODO: Create Payment DTO
  total: number;
  page: number;
  limit: number;
}

export class GetPaymentDetailsResponseDto {
  payment: any; // TODO: Create Payment DTO
}

export class RefundPaymentDto {
  @IsString()
  paymentId: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  adminId?: string;
}

export class RefundPaymentResponseDto {
  success: boolean;
  message: string;
}
