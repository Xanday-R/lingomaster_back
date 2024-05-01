import {Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction} from 'express';

@Injectable()
export class IsInputInPracticeMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        if(req.practiceInfo.answers.length <= req.body.id_input) {
            //@ts-ignore
            res.send({statusCode: 400, error: 'Bad request', message: 'The id_input doesn\'t exist'});
            return 0;
        }
        next();
    }
}