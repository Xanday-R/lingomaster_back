import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {User} from '../../../../../../core';

export const ArchiveInfo = createParamDecorator( (data: unknown, ctx: ExecutionContext) :User  => {
    const request = ctx.switchToHttp().getRequest();
    return request.archiveInfo;
})