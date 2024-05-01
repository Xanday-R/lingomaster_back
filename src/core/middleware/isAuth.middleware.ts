import {NextFunction} from 'express';
import {Inject, Injectable, NestMiddleware, Request} from '@nestjs/common';
import {MiddlewareService} from '../services/middleware.service';

@Injectable()
export class isAuthMiddleware implements NestMiddleware {

    constructor(@Inject('middleware') private readonly middlewareService: MiddlewareService) {
    }
    async use(req: Request, res: Response, next: NextFunction) {
        const result = await this.middlewareService.checkIsAuth(req);
        if(!result) {
            (res as any).send({statusCode: 401, error: 'Unauthorized', message: ['You must log in']});
            return 0;
        }
        (req as any).userData = result;
        next();
    }
}