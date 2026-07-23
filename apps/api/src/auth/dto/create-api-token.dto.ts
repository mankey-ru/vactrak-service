import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateApiTokenDto {
	@IsOptional()
	@IsString()
	@MaxLength(120)
	label?: string;
}
