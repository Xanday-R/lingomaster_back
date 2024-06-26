import { Injectable } from '@nestjs/common';
import { Hercai } from 'hercai';
import {generationTextDto, translationTextDto} from '../../modules/ai/core/dto/ai.dto';
import {Languages} from '../../../../core';
import { translate } from 'bing-translate-api';

/* Available Models */
/* 'v3' , 'v3-32k' , 'turbo' , 'turbo-16k' , 'gemini' */
/* Default Model; 'v3' */
/* Premium Parameter; personality => Optional */

@Injectable()
export class AiService {
    private herc = new Hercai();

    async generateText(input: generationTextDto):Promise<string>  {
        const result = await this.herc.question({
            model: 'v3',
            content: `Generate interesting ${input.format} more than 10 sentences on a topic '${input.topic}' in ${input.language} level ${input.level} using words: ${input.words.join(', ')}, these words don't must not have repeats and must be in brackets, but you shouldn't save their word's forms. In reply must be only the ${input.format} and all the words and have brackets which I wrote.`,
        });
        return result.reply;
    }

    async translateText(input: translationTextDto) {
        const result = await translate(input.text, input.languageText, input.languageTranslate);
        return result.translation;
    }

    async translateWordsInContext(arr: {sentence: string, wordOrPhrase: string}[],  languageSentence: Languages, languageTranslation: Languages) {
        const result = await this.herc.question({
            model: 'v3',
            content: `Translate each property "wordOrPhrase" in their sentence. 
            Data is JSON, reply must have {sentence,  wordOrPhrase, translation} style in 
            ONLY JSON(without \`\`\`json and others) format like array. Data: ${JSON.stringify(arr)}. language sentences is ${languageSentence}, language translation is ${languageTranslation}`
        })

        return JSON.parse(result.reply) as {word:string,translation:string, sentence: string}[];
    }

    async correctText(input: {essay: string,languageExplanation: string}) {
        const result = await this.herc.question({model: 'turbo-16k', content:`Correct mistakes in the essay '${input.essay}' in format 'wrong sentence - right sentence - explanation'. The explanation must be in ${input.languageExplanation}` })
        return result.reply;
    }

}
