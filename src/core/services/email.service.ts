import {Injectable} from '@nestjs/common';
import * as nodemailer from 'nodemailer'

@Injectable()
export class EmailService {
    private transporter = nodemailer.createTransport({
        service: 'outlook',
        auth: {
            user: 'dmytroreshetylo@outlook.com',
            pass: 'ckEr&Ui4%,5Y-vT'
        }
    });

    sendEmail(to:string, subject: string, text:string) {
        let mailOptions = {
            from: 'dmytroreshetylo@outlook.com',
            to: to,
            subject: subject,
            text: text
        };

        this.transporter.sendMail(mailOptions, (error:any, info:any) => {
            if (error) {
                throw new Error(error);
            }
        });
    }
}