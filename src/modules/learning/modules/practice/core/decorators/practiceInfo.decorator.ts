import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {User} from '../../../../../../core';

export const PracticeInfo = createParamDecorator( (data: unknown, ctx: ExecutionContext) :User  => {
    const request = ctx.switchToHttp().getRequest();
    return request.practiceInfo;
})