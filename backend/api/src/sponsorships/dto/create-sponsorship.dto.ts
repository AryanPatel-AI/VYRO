import { IsString, IsArray, IsOptional, IsNumber, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Platform } from '@vyro/shared-types';

export class CreateSponsorshipDto {
  @ApiProperty()
  @IsString()
  brandId!: string;

  @ApiProperty({ example: 'Smartphone Launch Q4' })
  @IsString()
  @MaxLength(200)
  campaignName!: string;

  @ApiProperty({ enum: ['INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'FACEBOOK', 'X_TWITTER', 'LINKEDIN', 'PINTEREST', 'THREADS'], isArray: true })
  @IsArray()
  platforms!: Platform[];

  @ApiPropertyOptional({ example: 75000 })
  @IsOptional()
  @IsNumber()
  budget?: number;

  @ApiPropertyOptional({ default: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: '2026-09-25' })
  @IsOptional()
  @IsString()
  deadline?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
