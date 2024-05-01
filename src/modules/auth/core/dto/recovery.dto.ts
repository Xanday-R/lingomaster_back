import {IsEmail, IsNumberString, Length} from 'class-validator';

export class RequestCodeDto {
    @IsEmail()
    email: string;
}

export class sendCodeDto {
    @Length(6)
    @IsNumberString()
    pincode: number;

    @IsEmail()
    email: string;
}