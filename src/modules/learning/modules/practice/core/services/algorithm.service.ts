import {Inject, Injectable} from '@nestjs/common';
import {IPracticeInfo, Languages, ModelsPractice} from '../../../../../../core';
import {AiService} from '../../../../core/services/ai.service';
import {VocabularyService} from '../../../../core/services/vocabulary.service';

@Injectable()
export class AlgorithmService {

    constructor(@Inject('ai') private aiService: AiService, @Inject('vocabulary') private vocabularyService: VocabularyService) {
    }
    async start(model: ModelsPractice, text:string, languageText:Languages, languageTranslate: Languages, id_text: number) {
        if(model === ModelsPractice.insertingWordTranslation || model === ModelsPractice.writingWordTranslation) return this.generateContentForWordTranslation(text, languageText, languageTranslate, id_text);
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

    private async generateContentForWordTranslation(text:string, languageText:Languages, languageTranslate: Languages, id_text:number) {

        const answers:IPracticeInfo['answers'] = [];
        let translatedWords = await this.vocabularyService.getData(id_text);

        const result  = this.findWordPosition(text);

        if(!translatedWords) {
            const arr = result.reduce((acc, currentValue) => {
                acc.push(currentValue.original, currentValue.sentence);
                return acc;
            }, [])

            translatedWords = await this.aiService.translateWordsInContext(arr, languageText, languageTranslate);

            await this.vocabularyService.add(translatedWords, id_text, languageText, languageTranslate);
        }

        result.forEach((e, i) => {
            answers.push({answer: translatedWords[i].translation,original: e.original, mustReplacePosition: e.mustReplacePosition, userAnswer: '', isCorrectAnswer: false})
        });

        return answers;
    }
}