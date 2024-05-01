import {ModelsPractice} from '../../../../../../core';

export interface IPracticeInfo {
    id: number,
    id_user: number,
    id_text: number,
    model: ModelsPractice,
    answers: {answer: string, original: string, mustReplacePosition: {begin: number, end: number}, userAnswer: string, isCorrectAnswer: boolean}[],
    essay: string,
    ai_correct_essay: string,
    checkedAnswers: boolean,
    finished: boolean
}