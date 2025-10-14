import { IsOptional, IsString, IsDateString } from 'class-validator';

export class GetAuditLogsQueryDto {
  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class GetAuditLogsResponseDto {
  data: any[]; // TODO: Create AuditLog DTO
  total: number;
}

export class GetAuditLogDetailsResponseDto {
  log: any; // TODO: Create AuditLog DTO
}
