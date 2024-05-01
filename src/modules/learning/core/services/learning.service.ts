import { Inject, Injectable } from '@nestjs/common';
import { knex } from 'knex';
import { Tables } from '../../../../core/enums/tables.enum';

@Injectable()
export class LearningService {
    constructor(@Inject('db') private knexManager:  knex.Knex<any, unknown[]>) {

    }

    async addWord(id_user:number, language_word:string, word:string, translation: string) {
        await this.knexManager('words').insert({id_user, language_word,word, translation })
    }

    async changeWord(id:number, word:string, translation:string) {
        await this.knexManager('words').where({id}).update({word, translation});
    }

    async addText(id_user: number, language_text: string, name:string, words:string[], text:string) {
        const JSONWords = JSON.stringify(words);
        await this.knexManager('texts').insert({id_user,  language_text, name, words: JSONWords, text});
    }

    async removeWordOrText(table: Tables.words | Tables.texts, id:number) {
        await this.knexManager(table).where({id}).del();
    }

    async getWordsOrTexts(table: Tables.words | Tables.texts, id_user: number) {
        return this.knexManager(table).select('*').where({id_user});
    }

    // applySettingAccessToText() {
    //
    // }
}