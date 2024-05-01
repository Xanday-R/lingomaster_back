import {Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import {IsEmailFreeValidation} from './core/dto/auth.dto';
import {RecoveryService} from './core/services/recovery.service';
@Module({
  controllers: [AuthController],
  providers: [
      IsEmailFreeValidation,
      RecoveryService
  ]

})
export class AuthModule {
}
