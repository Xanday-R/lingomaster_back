import {Inject, Injectable} from '@nestjs/common';
import {knex} from 'knex';
import {AccountManagementService, EmailService, generatePassword, genPincode, knexManager} from '../../../../core';

@Injectable()
export class RecoveryService {
    constructor(
        @Inject('db') private readonly knexManager:knex.Knex<any, unknown[]>,
        @Inject('account') private readonly accountManagement: AccountManagementService,
        @Inject('email') private readonly emailService: EmailService) {
    }

    async sendPin(email: string) {
        const pincode = genPincode();
        await knexManager('pincodes').insert({expiry: Date.now()+300*1000, email, pincode});
        this.emailService.sendEmail(email, 'Recovery password', `Pincode is ${pincode}, you have 5 minutes\nAlso you can use http://localhost:3000/auth/recovery/send-code?email=${email}&pincode=${pincode}/\nHave a good day!`);
    }

    async isRightPin(email: string, pincode: number) {
        const result = await knexManager('pincodes').select('*').where({pincode, email, used: null}).where('expiry', '>', Date.now());
        return !!result.length
    }

    async isPincodeHasAlreadyBeenSended(email:string) {
        const result = await knexManager('pincodes').select('*').where({email, used: null}).where('expiry', '>', Date.now());
        return !!result.length;
    }

    async confirmRecovery(email: string, pincode: number) {
        await knexManager('pincodes').update({used: true}).where({email, pincode});
        const newPassword =generatePassword(8);
        await this.accountManagement.changePassword(email, btoa(newPassword));
        this.emailService.sendEmail(email, 'New Password', `New password is ${newPassword}\nHave a good day!`);
    }
}