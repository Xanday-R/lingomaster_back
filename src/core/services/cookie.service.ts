import {Injectable} from '@nestjs/common';

@Injectable()
export class CookieService {
    getJWT(req:Request) {
        try {
            //@ts-ignore
            const rawHeaders = (req.rawHeaders as string[]);
            let index = rawHeaders.indexOf('Authorization');
            if(index === -1) index = rawHeaders.indexOf('authorization');
            for(let i of rawHeaders[index+1].split('; ')) {
                if(i.indexOf('Bearer jwt=') != -1) {
                    return i.replace('Bearer jwt=', '');
                }
            }
        }catch(err:any){}
        return '';
    }
}