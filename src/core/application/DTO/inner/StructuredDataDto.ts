import { IsString, IsOptional } from 'class-validator';

export class StructuredDataDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  profile?: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  institution?: string;

  @IsOptional()
  @IsString()
  startDateStudy?: string;

  @IsOptional()
  @IsString()
  endDateStudy?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  startDateJob?: string;

  @IsOptional()
  @IsString()
  endDateJob?: string;

  @IsOptional()
  @IsString()
  currentJob?: string;

  @IsOptional()
  @IsString()
  responsibilities?: string;

  @IsOptional()
  @IsString()
  professionalSkills?: string;

  @IsOptional()
  @IsString()
  languages?: string;
}
