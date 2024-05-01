import {Inject, Injectable} from '@nestjs/common';
import {knex} from 'knex';
import {IPracticeInfo, ModelsPractice} from '../../../../core';

@Injectable()
export class PracticeService {

    constructor(@Inject('db') private readonly knexManager: knex.Knex<any, unknown[]>) {
    }

    async startPractice(id_user:number, id_text:number, model: ModelsPractice, answers: IPracticeInfo['answers']) {
        const JSONAnswers = JSON.stringify(answers);
        await this.knexManager('log_practice').insert({id_user, id_text, model, answers: JSONAnswers, finished: false});
    }

    async getText(id:number) {
        const result = await this.knexManager('texts').select('*').where({id});
        result[0].words = JSON.parse(result[0].words);
        return result[0];
    }

    async isTakingPractice(id_user:number) {
        const result = await this.knexManager('log_practice').select('*').where({id_user, finished: false});
        return result;
    }

    async finishPractice(id:number) {
        await this.knexManager('log_practice').where({id, finished: false}).update({finished: true});
    }

    async setUserInput(id:number, answers: IPracticeInfo['answers']) {
        await this.knexManager('log_practice').where({id}).update({answers: JSON.stringify(answers)});
    }

    async confirmCheckAnswers(id:number) {
        await this.knexManager('log_practice').where({id}).update({checkedAnswers: true});
    }

    async saveEssay(id:number, essay:string) {
        await this.knexManager('log_practice').where({id}).update({essay});
    }

    async saveAiCorrection(id:number, ai_correct_essay:string) {
        await this.knexManager('log_practice').where({id}).update({ai_correct_essay});
    }

    async isOwnerArchivePractice(id_user:number, id_practice:number) {
        const result = await this.knexManager('log_practice').select('*').where({id_user, id: id_practice, finished: true});
        if(!!result.length) {
            result[0].answers = JSON.parse(result[0].answers);
        }
        return result;
    }
}
