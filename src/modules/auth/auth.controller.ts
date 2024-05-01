import {Body, Controller, Get, Headers, Inject, Post, Query, Res, UsePipes, ValidationPipe} from '@nestjs/common';
import {authDto, registerDto} from './core/dto/auth.dto';
import {RecoveryService} from './core/services/recovery.service';
import {RequestCodeDto, sendCodeDto} from './core/dto/recovery.dto';
import {AccountManagementService, CookieService, JWTService} from '../../core';


@Controller('auth')
export class AuthController {
  constructor(
      @Inject('account') private readonly accountManagement: AccountManagementService,
      @Inject('cookie') private readonly cookieService: CookieService,
      @Inject('jwt') private readonly jwtService: JWTService,
      private readonly recoveryService: RecoveryService
  ) {}

  @Post('/sign-up')
  @UsePipes(new ValidationPipe())
  async signUp(@Res({passthrough: true}) res:Response, @Body() dto:registerDto) {
    const result = await this.accountManagement.register(dto.email, dto.login, dto.native_language, btoa(dto.password));
    //this.cookieService.addJWT(res, this.jwtService.createJWT(result[0].id, dto.email, btoa(dto.password)));
    return {statusCode: 200, error: '', message: 'success', token: this.jwtService.createJWT(result[0].id, dto.email, btoa(dto.password))};
  }

  @Post('/log-in')
  @UsePipes(new ValidationPipe())
  async logIn(@Res({passthrough: true}) res:Response, @Body() dto:authDto) {
    const result = await this.accountManagement.auth(dto.email, btoa(dto.password));
    if(!result.length) return {statusCode: 401, error: 'Unauthorized', message: ['Unright email or password']};
    //this.cookieService.addJWT(res, this.jwtService.createJWT(result[0].id, dto.email, btoa(dto.password)));
    return {statusCode: 200, error: '', message: 'success', token: this.jwtService.createJWT(result[0].id, dto.email, btoa(dto.password))};

  }

  @Post('/recovery/request-code')
  @UsePipes(new ValidationPipe())
  async requestCode(@Body() dto: RequestCodeDto) {
    if(await this.accountManagement.isEmailFree(dto.email)) {
      return {statusCode: 406, error: 'Not Acceptable', message: ['Email is not signed up']};
    }
    if(await this.recoveryService.isPincodeHasAlreadyBeenSended(dto.email))
      return {statusCode: 406, error: 'Not Acceptable', message: ['Pincode has already sended']};

    await this.recoveryService.sendPin(dto.email);
    return {statusCode: 200, error: '', message: 'success'};
  }

  @Get('/recovery/send-code')
  async sendCode(@Query() dto: sendCodeDto) {
    if(!(await this.recoveryService.isRightPin(dto.email, dto.pincode))) {
      return {statusCode: 406, error: 'Not Acceptable', message: ['Pincode is not right or five mitutes timed out'] }
    }
    await this.recoveryService.confirmRecovery(dto.email, dto.pincode);
    return {statusCode: 200, error: '', message: 'success'};
  }

}
