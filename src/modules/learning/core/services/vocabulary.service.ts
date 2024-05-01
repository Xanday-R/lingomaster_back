import {Inject, Injectable} from '@nestjs/common';
import {knex} from 'knex';
import {Languages} from '../../../../core';

@Injectable()
export class VocabularyService {

    constructor(@Inject('db') private readonly knexManager: knex.Knex<any, unknown[]>) {
    }

    async add(languageWord:Languages,languageTranslate:Languages,word:string,translation:string, sentence: string) {
        await this.knexManager('vocabulary').insert({languageWord, languageTranslate, word, translation, sentence});
    }

    async getTranslation(word: string, languageWord:Languages,languageTranslate:Languages, sentence: string) {
        const result = await this.knexManager('vocabulary').select('*').where({languageWord, languageTranslate, word, sentence});
        if(!result.length) return false;
        return result[0].translation;
    }
}