import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSponsorshipStatusDto {
  @ApiProperty({ example: 'CONTACTED', description: 'Next valid status per state machine' })
  @IsString()
  status!: string;

  @ApiPropertyOptional({ example: 'Reached out via email on Sep 10' })
  @IsOptional()
  @IsString()
  note?: string;
}
