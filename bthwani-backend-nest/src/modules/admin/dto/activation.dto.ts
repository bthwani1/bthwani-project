import { IsOptional, IsString, IsNumber } from 'class-validator';

export class GenerateActivationCodesDto {
  @IsNumber()
  count: number;

  @IsOptional()
  @IsNumber()
  expiryDays?: number;

  @IsOptional()
  @IsString()
  userType?: string;

  @IsOptional()
  @IsString()
  adminId?: string;
}

export class GenerateActivationCodesResponseDto {
  success: boolean;
  codes: string[];
  count: number;
}

export class GetActivationCodesQueryDto {
  @IsOptional()
  @IsString()
  status?: string;
}

export class GetActivationCodesResponseDto {
  data: any[]; // TODO: Create ActivationCode DTO
  total: number;
}
