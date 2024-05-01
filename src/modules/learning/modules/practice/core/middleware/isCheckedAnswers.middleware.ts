import {Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction} from 'express';

@Injectable()
export class IsCheckedAnswersMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        if(!req.practiceInfo.checkedAnswers) {
            //@ts-ignore
            res.send({statusCode: 403, error: 'Forbidden', message: 'At first, you must check answers'});
            return 0;
        }
        next();
    }
}