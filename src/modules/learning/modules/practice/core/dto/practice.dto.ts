import {IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsString, MaxLength, MinLength} from 'class-validator';
import {Languages, ModelsPractice} from '../../../../../../core';

export class startPracticeDto {
    @IsNumber()
    id_text:number;

    @IsEnum(ModelsPractice)
    model:ModelsPractice
}

export class setUserInputDto {
    @IsNumber()
    id_input: number;

    @IsString()
    userInput: string;
}

export class markUserInputLikeRightAnswerDto {
    @IsNumber()
    id_input: number;

    @IsBoolean()
    isCorrectAnswer: boolean;
}

export class archiveDto {
    @IsNumberString()
    id_practice: number;
}

export class saveEssayDto {
    @IsString()
    essay: string;
}

export class essayDto {
    @MinLength(108)
    @MaxLength(1024)
    @IsString()
    essay: string;
}