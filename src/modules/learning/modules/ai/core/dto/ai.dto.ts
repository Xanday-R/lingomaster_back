import {ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';
import {Formats, Languages, Levels} from '../../../../../../core';

export class generationTextDto {
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(5)
    words: string[];

    @IsEnum(Formats)
    format: Formats;

    @IsEnum(Levels)
    level: Levels;

    @IsEnum(Languages)
    language: Languages;

    @IsNotEmpty()
    @IsString()
    topic: string;

    @IsNotEmpty()
    @IsString()
    name: string;
}

export class translationTextDto {
    @MinLength(4)
    text: string;

    @IsEnum(Languages)
    languageText: Languages;

    @IsEnum(Languages)
    languageTranslate: Languages;
}

export class correctionTextDto {
    @IsNotEmpty()
    @IsString()
    essay: string;

    @IsEnum(Languages)
    languageExplanation: Languages
}
