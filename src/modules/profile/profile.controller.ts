import {Body, Controller, Get, Inject, Patch, Post, Res, UsePipes, ValidationPipe} from '@nestjs/common';
import {ChangePasswordDto} from './core/dto/changePassword.dto';
import {AccountManagementService, CookieService, JWTService, User, UserData} from '../../core';

@Controller('profile')
export class ProfileController {
  constructor(
      @Inject('account') private readonly accountManagement: AccountManagementService,
      @Inject('cookie') private readonly cookieService: CookieService,
      @Inject('jwt') private readonly jwtService: JWTService) {}

  // @Get('/sign-out')
  // async signOut(@Res({passthrough: true}) res: Response) {
  //   this.cookieService.removeJWT(res);
  //   return {statusCode: 200, error: '', message: 'success'};
  // }

  @Post('/account-info')
  async accountInfo(@UserData() userData:User) {
      return {statusCode: 200, error: '', message: 'success', info: {login: userData.login, img: userData.img, native_language: userData.native_language, email: userData.email}};
  }

  @Post('/delete-account')
  async deleteAccount(@Res({passthrough: true}) res: Response, @UserData() userData:User) {
    // this.cookieService.removeJWT(res);
    await this.accountManagement.deleteAccount(userData.id);
    return {statusCode: 200, error: '', message: 'success'};
  }

  @Patch('/changePassword')
  @UsePipes(new ValidationPipe())
  async changePassword(@Res({passthrough: true}) res: Response, @Body() dto: ChangePasswordDto, @UserData() userData:User) {
    await this.accountManagement.changePassword(userData.email, btoa(dto.newPassword));
    // this.cookieService.addJWT(res, this.jwtService.createJWT(userData.id, userData.email, btoa(dto.newPassword)));
    return {statusCode: 200, error: '', message: 'success', token: this.jwtService.createJWT(userData.id, userData.email, btoa(dto.newPassword)) };
  }

  // @Patch('/changeImage')
  // async changePassword() {
  //
  // }

}
