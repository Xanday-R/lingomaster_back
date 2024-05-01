import {Global, Module} from '@nestjs/common';
import { LearningController } from './learning.controller';
import {LearningService} from './core/services/learning.service';
import {AiModule} from './modules/ai/ai.module';
import {PracticeModule} from './modules/practice/practice.module';
import {PracticeService} from './core/services/practice.service';
import {AiService} from './core/services/ai.service';
import {VocabularyService} from './core/services/vocabulary.service';

@Global()
@Module({
  imports: [AiModule, PracticeModule],
  controllers: [LearningController],
  providers: [
    {
      provide: 'learning',
      useClass: LearningService
    },
    {
      provide: 'practice',
      useClass: PracticeService
    },
    {
      provide: 'ai',
      useClass: AiService,
    },
    {
      provide: 'vocabulary',
      useClass: VocabularyService
    }
  ],
  exports: ['learning', 'practice', 'ai', 'vocabulary']
})
export class LearningModule {}
