import {Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction} from 'express';

@Injectable()
export class IsNotCheckedAnswersMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        if(req.practiceInfo.checkedAnswers) {
            //@ts-ignore
            res.send({statusCode: 403, error: 'Forbidden', message: 'You have already checked right answers, so you can\'t change your answers'});
            return 0;
        }
        next();
    }
}