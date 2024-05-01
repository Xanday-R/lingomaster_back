import {
    IsEmail, IsEnum,
    IsString,
    MaxLength,
    MinLength, Validate, ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import {Inject, Injectable} from '@nestjs/common';
import {AccountManagementService, Languages} from '../../../../core';

@Injectable()
@ValidatorConstraint({async: true, name: 'IsEmailFree'})
export class IsEmailFreeValidation implements ValidatorConstraintInterface {
    constructor(@Inject('account') private readonly accountManagement: AccountManagementService) {
    }

    async validate(email:string) {
        return await this.accountManagement.isEmailFree(email);
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'email is busy'
    }
}

export class registerDto {
    @IsEmail()
    @Validate(IsEmailFreeValidation)
    email: string;

    @MinLength(8)
    @MaxLength(255)
    login: string;

    @IsEnum(Languages)
    native_language: Languages;

    @MinLength(8)
    @MaxLength(255)
    password: string;
}

export class authDto {
    @IsEmail()
    email: string;

    @MinLength(8)
    @MaxLength(255)
    password: string;
}
