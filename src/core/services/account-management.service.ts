import {Inject, Injectable} from '@nestjs/common';

import {knex} from 'knex';
import {User} from '../types/user.type';
import {Languages} from '../enums/languages.enum';

@Injectable()
export class AccountManagementService {
    constructor(@Inject('db') private  knexManager:  knex.Knex<any, unknown[]>) {
    }
    async auth(email:string, password:string) {
        const result: User[] = await this.knexManager('users').select('*').where({email, password});
        return result;
    }

    async register(email: string, login: string, native_language: Languages, password: string) {
        const result:User[] = await this.knexManager('users').insert({email, login,native_language, password});
        return result;
    }

    async isEmailFree(email:string) {
        const result:User[] = await this.knexManager('users').select('*').where({email});
        return !result.length;
    }

    async changePassword(email: string, newPassword:string) {
        await this.knexManager('users').where({email}).update({password: newPassword});
    }

    async deleteAccount(id:number) {
        await this.knexManager('users').where({id}).del();
    }

}
