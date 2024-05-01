import { Module } from '@nestjs/common';
import { PracticeController } from './practice.controller';
import {AlgorithmService} from './core/services/algorithm.service';

@Module({
  controllers: [PracticeController],
  providers: [AlgorithmService],
})
export class PracticeModule {}
