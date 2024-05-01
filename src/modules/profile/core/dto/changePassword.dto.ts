import { MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @MinLength(8)
    @MaxLength(255)
    newPassword: string;
}