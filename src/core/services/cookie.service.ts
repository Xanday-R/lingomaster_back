import {Injectable} from '@nestjs/common';

@Injectable()
export class CookieService {
    // addJWT(res:Response, jwt: string) {
    //     //@ts-ignore
    //     // res.cookie('Set-Cookie', `jwt=${jwt}; Path=/; Max-Age=${86400000*60}`);
    //     // res.cookie('jwt', jwt, {
    //     //     secure: true,
    //     //     httpOnly: true,
    //     //     path: '/',
    //     //     sameSite: 'none',
    //     // });
    //     // res.cookie('jwt', jwt);
    //     //@ts-ignore
    //     // res.setHeader('Set-Cookie', `__Host-name=${jwt}; Secure; Path=/; SameSite=None; Partitioned;`);
    // }
    //
    // removeJWT(res:Response) {
    //     //@ts-ignore
    //     res.clearCookie('jwt');
    // }

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