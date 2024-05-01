import {Inject, Injectable} from '@nestjs/common';
import {IPracticeInfo, Languages, ModelsPractice} from '../../../../../../core';
import {AiService} from '../../../../core/services/ai.service';
import {VocabularyService} from '../../../../core/services/vocabulary.service';

@Injectable()
export class AlgorithmService {

    constructor(@Inject('ai') private aiService: AiService, @Inject('vocabulary') private vocabularyService: VocabularyService) {
    }
    async start(model: ModelsPractice, text:string, languageText:Languages, languageTranslate: Languages) {
        if(model === ModelsPractice.insertingWordTranslation || model === ModelsPractice.writingWordTranslation) return this.generateContentForWordTranslation(text, languageText, languageTranslate);
        else return this.generateContentForMissWords(text);
    }

    private defineSentence(splittedText:string[], position: number):string {
        let checkedLength = 0
        for(let i = 0; i < splittedText.length; i++ ) {
            if(position < checkedLength+splittedText[i].length+1) return splittedText[i];
            else checkedLength += splittedText[i].length+1;
        }
        return '';
    }

    private findWordPosition(text:string) {
        const brackets = (text.indexOf('{') != -1) ? '{}' : (text.indexOf('(') != -1) ? '()' : '[]';
        const result:{original: string, mustReplacePosition: {begin: number, end: number}, sentence: string}[] = [];
        const splittedText = text.split('.');
        let lastPos:number = 0;
        for(; true; ) {
            const begin = text.indexOf(brackets[0], lastPos)+1;
            let temp = {original: '', mustReplacePosition: {begin: begin, end: text.indexOf(brackets[1], lastPos)}, sentence: this.defineSentence(splittedText, begin)};
            if(!(temp.mustReplacePosition.begin)) return result;
            temp.original = text.slice(temp.mustReplacePosition.begin, temp.mustReplacePosition.end);
            lastPos = temp.mustReplacePosition.end+1;
            if(!(temp.mustReplacePosition.end)) return result.slice(0, result.length-2);
            result.push(temp);
        }
    }

    private generateContentForMissWords(text:string) {
        const answers:IPracticeInfo['answers'] = [];
        const result  = this.findWordPosition(text);
        result.forEach((e) => {
            answers.push({answer: e.original, original: e.original, mustReplacePosition: e.mustReplacePosition, userAnswer: '', isCorrectAnswer: false});
        });
        return answers;
    }

    private async generateContentForWordTranslation(text:string, languageText:Languages, languageTranslate: Languages) {
        const answers:IPracticeInfo['answers'] = [];
        const result  = this.findWordPosition(text);
        for (const e of result) {
            let answer = await this.vocabularyService.getTranslation(e.original, languageText, languageTranslate, e.sentence);
            if(!answer) {
                answer = await this.aiService.translateWordOrPhrase(e.sentence, e.original, languageText, languageTranslate);
                await this.vocabularyService.add(languageText, languageTranslate, e.original, answer, e.sentence);
            }

            answers.push({answer: answer,original: e.original, mustReplacePosition: e.mustReplacePosition, userAnswer: '', isCorrectAnswer: false});
        }
        return answers;
    }
}