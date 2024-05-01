import {Inject, Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction} from 'express';
import {MiddlewareService} from '../services/middleware.service';
import {Tables} from '../enums/tables.enum';

@Injectable()
export class isOwnerTheTextOrWord implements NestMiddleware {
    constructor(@Inject('middleware') private readonly middlewareService: MiddlewareService) {
    }
    async use(req: Request, res: Response, next: NextFunction){
        //@ts-ignore
        const url = req.baseUrl;
        const table:string = url.indexOf('word') != -1 ? Tables.words : Tables.texts

        //@ts-ignore
        const result = await this.middlewareService.checkIsOwnerTextOrWord(!!req.body.id ? req.body.id : (!!req.body.id_text ? req.body.id_text : url.split('/')[url.split('/').length-1]), table, req.userData.id);
        if(!result) {
            // @ts-ignore
            res.send({statusCode: 403, error: 'Forbidden', message: ['You have no right to change or use this']});
            return 0;
        }
        next();
    }
}