import {Global, MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import {isTakingPracticeMiddleware} from './modules/learning/core/middleware/isTakingPractice.middleware';
import {
  AccountManagementService,
  CookieService,
  EmailService,
  isAuthMiddleware,
  isOwnerTheTextOrWord,
  JWTService, knexManager,
  MiddlewareService
} from './core';
import {ProfileModule} from './modules/profile/profile.module';
import {LearningModule} from './modules/learning/learning.module';
import {isNotAlreadyAuthMiddleWare} from './modules/auth/core/middleware/isNotAlreadyAuth.middleware';
import {isNotTakingPracticeMiddleware} from './modules/learning/core/middleware/isNotTakingPractice.middleware';
import {
  IsInputInPracticeMiddleware
} from './modules/learning/modules/practice/core/middleware/isInputInPractice.middleware';
import {
  IsCheckedAnswersMiddleware
} from './modules/learning/modules/practice/core/middleware/isCheckedAnswers.middleware';
import {
  IsNotCheckedAnswersMiddleware
} from './modules/learning/modules/practice/core/middleware/isNotCheckedAnswers.middleware';
import {IsRightOnThePracticeMiddleware} from './modules/learning/modules/practice/core/middleware/isRightOnThePractice';
import * as cookieParser from 'cookie-parser';

@Global()
@Module({
  imports: [AuthModule, ProfileModule, LearningModule],
  controllers: [AppController],
  providers: [

    {
      provide: 'db',
      useValue: knexManager
    },
    {
      provide: 'account',
      useClass: AccountManagementService
    },
    {
      provide: 'cookie',
      useClass: CookieService
    },
    {
      provide: 'jwt',
      useClass: JWTService
    },
    {
      provide: 'middleware',
      useClass: MiddlewareService
    },
    {
      provide: 'email',
      useClass: EmailService
    }
  ],
  exports: ['account', 'db', 'cookie', 'jwt', 'middleware', 'email']
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer)  {
    consumer.apply(isNotAlreadyAuthMiddleWare).forRoutes('auth');

    consumer.apply(isAuthMiddleware).forRoutes('profile');
    consumer.apply(isAuthMiddleware).forRoutes('learning');

    consumer.apply(isOwnerTheTextOrWord).forRoutes('learning/change-word');
    consumer.apply(isOwnerTheTextOrWord).forRoutes('learning/delete/:table/:id');
    consumer.apply(isOwnerTheTextOrWord).forRoutes('learning/practice/start');

    consumer.apply(isNotTakingPracticeMiddleware).forRoutes('learning/practice/start');

    consumer.apply(isTakingPracticeMiddleware).forRoutes('learning/ai/correct-text');
    consumer.apply(isTakingPracticeMiddleware).forRoutes('learning/ai/translate-text');
    consumer.apply(isTakingPracticeMiddleware).forRoutes('learning/practice/getText');
    consumer.apply(isTakingPracticeMiddleware).forRoutes('learning/practice/setUserInput');
    consumer.apply(isTakingPracticeMiddleware).forRoutes('learning/practice/markUserInputLikeAnotherAnswer');
    consumer.apply(isTakingPracticeMiddleware).forRoutes('learning/practice/confirmCheckAnswers');
    consumer.apply(isTakingPracticeMiddleware).forRoutes('learning/practice/essay-correction');
    consumer.apply(isTakingPracticeMiddleware).forRoutes('learning/practice/saveEssay');
    consumer.apply(isTakingPracticeMiddleware).forRoutes('learning/practice/finish');

    consumer.apply(IsInputInPracticeMiddleware).forRoutes('learning/practice/setUserInput');
    consumer.apply(IsInputInPracticeMiddleware).forRoutes('learning/practice/markUserInputLikeAnotherAnswer');

    consumer.apply(IsCheckedAnswersMiddleware).forRoutes('learning/practice/markUserInputLikeAnotherAnswer');
    consumer.apply(IsCheckedAnswersMiddleware).forRoutes('learning/practice/saveEssay');
    consumer.apply(IsCheckedAnswersMiddleware).forRoutes('learning/practice/essay-correction');

    consumer.apply(IsNotCheckedAnswersMiddleware).forRoutes('learning/practice/setUserInput');
    consumer.apply(IsNotCheckedAnswersMiddleware).forRoutes('learning/practice/confirmCheckAnswers');

    consumer.apply(IsRightOnThePracticeMiddleware).forRoutes('learning/practice/archive/:id_practice');

    consumer.apply(cookieParser()).forRoutes('*');
  }
}
