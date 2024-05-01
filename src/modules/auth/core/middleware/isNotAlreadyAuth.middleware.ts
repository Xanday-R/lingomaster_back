import {Inject, Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction} from 'express';
import {MiddlewareService} from '../../../../core';


@Injectable()
export class isNotAlreadyAuthMiddleWare implements NestMiddleware {
    constructor(@Inject('middleware') private readonly middlewareService: MiddlewareService) {
    }
    async use(req: Request, res: Response, next: NextFunction) {
        if((await this.middlewareService.checkIsAuth(req))) {
            // @ts-ignore
            res.send({statusCode: 406, error: 'Not acceptable', message: ['You have already logged in']});
            return 0;
        }
        next();

    }
}