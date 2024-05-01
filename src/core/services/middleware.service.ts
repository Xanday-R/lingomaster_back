import {Inject, Injectable} from '@nestjs/common';
import {Tables} from '../enums/tables.enum';
import {AccountManagementService} from './account-management.service';
import {CookieService} from './cookie.service';
import {JWTService} from './jwt.service';
import {knex} from 'knex';

@Injectable()
export class MiddlewareService {
    constructor(
        @Inject('account') private readonly accountManagement: AccountManagementService,
        @Inject('cookie')  private readonly cookieService: CookieService,
        @Inject('jwt') private readonly jwtService: JWTService,
        @Inject('db') private readonly knexManager:  knex.Knex<any, unknown[]>) {
    }
    async checkIsOwnerTextOrWord(id:number, table: Tables.words | Tables.texts, id_user: number) {
        const result = await this.knexManager(table).select('*').where({id, id_user});
        return !!result.length;
    }

    async checkIsAuth(req:Request) {
        const token = this.cookieService.getJWT(req);
        if(!token)  return false;
        const result = this.jwtService.verify(token);
        if(!result ) return false
        const result2 = await this.accountManagement.auth(result.email, result.password);
        if(!result2.length) return false;
        return result2[0];
    }
}