import { IsString } from 'class-validator';

export class ExportAllDataResponseDto {
  success: boolean;
  url: string;
}

export class ImportDataDto {
  data: any; // TODO: Define import data structure

  @IsString()
  type: string;
}

export class ImportDataResponseDto {
  success: boolean;
  imported: number;
}
