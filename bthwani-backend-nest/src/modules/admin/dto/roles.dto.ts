import { IsString, IsOptional, IsArray } from 'class-validator';

export class GetRolesResponseDto {
  data: Array<{
    id: string;
    name: string;
    permissions: string[];
  }>;
}

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}

export class CreateRoleResponseDto {
  success: boolean;
  role: CreateRoleDto;
}

export class UpdateRoleDto {
  @IsString()
  roleId: string;

  updates: any; // TODO: Create specific update DTO
}

export class UpdateRoleResponseDto {
  success: boolean;
  message: string;
}
