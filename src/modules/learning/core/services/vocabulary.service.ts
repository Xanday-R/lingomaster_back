import {Inject, Injectable} from '@nestjs/common';
import {knex} from 'knex';
import { IPracticeInfo, Languages } from '../../../../core';

@Injectable()
export class VocabularyService {

    constructor(@Inject('db') private readonly knexManager: knex.Knex<any, unknown[]>) {
    }

    async add(arr:IPracticeInfo['answers'], id_text: number, languageSentence:Languages,languageTranslation: Languages) {
        await this.knexManager('vocabulary').insert({data: JSON.stringify(arr), id_text, languageSentence, languageTranslation});
    }

    async getData(id_text: number) {
        const result = await this.knexManager('vocabulary').select('*').where({id_text});
        if(!result.length) return false;
        return JSON.parse(result[0].data);
    }
}