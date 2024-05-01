import {Inject, Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction} from 'express';
import {PracticeService} from '../services/practice.service';

@Injectable()
export class isTakingPracticeMiddleware implements NestMiddleware {

    constructor(@Inject('practice') private readonly practiceService: PracticeService) {
    }
    async use(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        const result = await this.practiceService.isTakingPractice(req.userData.id);
        if(!result.length ){
            //@ts-ignore
            res.send({statusCode: 403, error: 'Forbidden', message: ['You must take practice that have access in this']});
            return 0;
        }
        result[0].answers = JSON.parse(result[0].answers);
        //@ts-ignore
        req.practiceInfo = result[0];
        next();
    }
}