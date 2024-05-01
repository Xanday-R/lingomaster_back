import {Body, Controller, Post, UseFilters, UsePipes, ValidationPipe, Get, Inject} from '@nestjs/common';
import { AiService } from '../../core/services/ai.service';
import {generationTextDto, translationTextDto} from './core/dto/ai.dto';
import {LearningService} from '../../core/services/learning.service';
import {User, UserData} from '../../../../core';
@Controller('learning/ai')
export class AiController {
  constructor(@Inject('ai') private readonly aiService: AiService, @Inject('learning') private readonly learningService : LearningService) {}

  @Post('/generate-text')
  @UsePipes(new ValidationPipe())
  async generateText(@Body() dto: generationTextDto, @UserData() userData:User) {
    const result = await this.aiService.generateText(dto);
    await this.learningService.addText(userData.id, dto.language, dto.name, dto.words, result);
    return {statusCode: 200, error: '', message: 'success', generatedText: ''};
  }

  @Post('/translate-text')
  @UsePipes(new ValidationPipe())
  async translateText(@Body() dto: translationTextDto) {
    const result = await this.aiService.translateText(dto);
    return {statusCode: 200, error: '', message: 'success', translatedText: result};
  }

  // @Post('/correct-essay')
  // @UsePipes(new ValidationPipe())
  // async correctText(@Body() dto: correctionTextDto) {
  //   const result = await this.aiService.correctText(dto);
  //   return {statusCode: 200, error: '', message: 'success', correctedText: result};
  // }
}