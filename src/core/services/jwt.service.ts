import {Injectable} from '@nestjs/common';

@Injectable()
export class JWTService {
    private jwt = require('jsonwebtoken');
    createJWT(id:number, email:string, password:string) {
        const token = this.jwt.sign({ email, password, id }, '84856856956i', { algorithm: 'HS256', expiresIn: '60d' });
        return token;
    }
    verify(token:string) {
        try {
            const decoded = this.jwt.verify(token, '84856856956i', { algorithms: 'HS256' });
            return decoded;
        }catch(err:any) {
            return false;
        }
    }
}