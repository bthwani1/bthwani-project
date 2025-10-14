import { IsOptional, IsString, IsNumber } from 'class-validator';

export class GetWithdrawalsQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  userModel?: string;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 20;
}

export class GetWithdrawalsResponseDto {
  data: any[]; // TODO: Create Withdrawal DTO
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetPendingWithdrawalsResponseDto {
  data: any[]; // TODO: Create Withdrawal DTO
  total: number;
}

export class ApproveWithdrawalDto {
  @IsString()
  withdrawalId: string;

  @IsString()
  adminId: string;

  @IsOptional()
  @IsString()
  transactionRef?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class RejectWithdrawalDto {
  @IsString()
  withdrawalId: string;

  @IsString()
  reason: string;

  @IsString()
  adminId: string;
}
