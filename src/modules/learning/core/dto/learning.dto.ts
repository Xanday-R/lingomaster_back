import {
    IsEnum,
    IsNotEmpty,
    IsNumber, IsNumberString,
    IsString, Validate,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import {Languages, Tables} from '../../../../core';


@ValidatorConstraint({async: false, name: 'isAvailableTable'})
export class isAvailableTableValidation implements ValidatorConstraintInterface {

    validate(table: any): boolean {
        if(table === 'words' || table === 'texts') return true;
        return false;
    }

    defaultMessage(): string {
        return 'the table doesn\'t exist or you have no right to the table';
    }
}

@ValidatorConstraint({async: false, name: 'isNotAllowChars'})
export class isNotAllowChars implements ValidatorConstraintInterface {

    validate(word: string): boolean {
        const notAllowChars = ['(', ')', '}', '{', '[', ']'];
        if(notAllowChars.find((e) => word.includes(e))) return false;
        return true;
    }

    defaultMessage(): string {
        return 'you mustn\'t write any brackets';
    }
}

export class saveTextDto {
    @IsNumber()
    id:number;
}

export class addWordDto {
    @IsEnum(Languages)
    language_word: string;

    @IsNotEmpty()
    @IsString()
    @Validate(isNotAllowChars)
    word: string;

    @IsNotEmpty()
    @IsString()
    translation: string;
}

export class changeWordDto {
    @IsNumber()
    id:number;

    @IsNotEmpty()
    @IsString()
    @Validate(isNotAllowChars)
    word: string;

    @IsNotEmpty()
    @IsString()
    translation: string;
}

export class getAllTableDto {
    @Validate(isAvailableTableValidation)
    table: Tables;
}

export class deleteTextOrWordDto {
    @Validate(isAvailableTableValidation)
    table: Tables;

    @IsNotEmpty()
    @IsNumberString()
    id:number;
}