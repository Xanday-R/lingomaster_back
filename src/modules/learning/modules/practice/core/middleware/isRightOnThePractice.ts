import {Inject, Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction} from 'express';
import {PracticeService} from '../../../../core/services/practice.service';

@Injectable()
export class IsRightOnThePracticeMiddleware implements NestMiddleware {

    constructor(@Inject('practice') private practiceService: PracticeService) {
    }
    async use(req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        const url = req.baseUrl;
        //@ts-ignore
        const result = await this.practiceService.isOwnerArchivePractice(req.userData.id, url.split('/')[url.split('/').length-1]);
        //@ts-ignore
        if(!result.length) {
            //@ts-ignore
            res.send({statusCode: 403, error: 'Forbidden', message: 'You have no right to the archive practice'});
            return 0;
        }
        //@ts-ignore
        req.archiveInfo = result[0];
        next();
    }
}