import {Body, Controller, Get, Inject, Param, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import { PracticeService } from '../../core/services/practice.service';
import {
  archiveDto,
  essayDto,
  markUserInputLikeRightAnswerDto, saveEssayDto,
  setUserInputDto,
  startPracticeDto
} from './core/dto/practice.dto';
import {PracticeInfo} from './core/decorators/practiceInfo.decorator';
import {IPracticeInfo, User, UserData} from '../../../../core';
import {AiService} from '../../core/services/ai.service';
import {AlgorithmService} from './core/services/algorithm.service';
import {ArchiveInfo} from './core/decorators/archiveInfo.decorator';

@Controller('learning/practice')
export class PracticeController {
  constructor(@Inject('practice') private readonly practiceService: PracticeService, @Inject('ai') private readonly aiService: AiService, private alghoritmService: AlgorithmService) {}

  @Post('/start')
  @UsePipes(new ValidationPipe())
  async startPractice(@Body() dto: startPracticeDto, @UserData() userData: User) {
    const result = await this.practiceService.getText(dto.id_text);
    const answers:IPracticeInfo['answers'] = await this.alghoritmService.start(dto.model, result.text, result.language_text, userData.native_language, dto.id_text) ;
    await this.practiceService.startPractice(userData.id, dto.id_text, dto.model, answers);
    return {statusCode: 200, error: '', message: 'success'};
  }

  @Get('/getText')
  async getText(@UserData() userData: User, @PracticeInfo() practiceInfo: IPracticeInfo) {
    const result:any = await this.practiceService.getText(practiceInfo.id_text);
    return {statusCode: 200, error: '', message: 'success', text: result.text, model: practiceInfo.model, words: result.words, answers: practiceInfo.answers, checkedAnswers: practiceInfo.checkedAnswers, essay: practiceInfo.essay, languageText: result.language_text};
  }

  @Post('/finish')
  async finishPractice(@UserData() userData: User, @PracticeInfo() practiceInfo: IPracticeInfo) {
    await this.practiceService.finishPractice(practiceInfo.id);
    return {statusCode: 200, error: '', message: 'success'};
  }

  @Post('/setUserInput')
  @UsePipes(new ValidationPipe())
  async setUserInput(@Body() dto: setUserInputDto, @PracticeInfo() practiceInfo: IPracticeInfo) {
    practiceInfo.answers[dto.id_input].userAnswer = dto.userInput;
    practiceInfo.answers[dto.id_input].isCorrectAnswer = (practiceInfo.answers[dto.id_input].answer === dto.userInput);
    await this.practiceService.setUserInput(practiceInfo.id, practiceInfo.answers);
    return {statusCode: 200, error: '', message: 'success'};
  }

  @Post('/confirmCheckAnswers')
  async confirmCheckAnswers(@UserData() userData: User, @PracticeInfo() practiceInfo: IPracticeInfo) {
    await this.practiceService.confirmCheckAnswers(practiceInfo.id);
    return {statusCode: 200, error: '', message: 'success'};
  }

  @Post('/markUserInputLikeAnotherAnswer')
  @UsePipes(new ValidationPipe())
  async markUserInputLikeRightAnswer(@Body() dto: markUserInputLikeRightAnswerDto, @PracticeInfo() practiceInfo: IPracticeInfo) {
    practiceInfo.answers[dto.id_input].isCorrectAnswer = dto.isCorrectAnswer;
    await this.practiceService.setUserInput(practiceInfo.id, practiceInfo.answers);
    return {statusCode: 200, error: '', message: 'success'};
  }

  @Post('/saveEssay')
  @UsePipes(new ValidationPipe())
  async saveEssay(@Body() dto: saveEssayDto, @UserData() userData: User, @PracticeInfo() practiceInfo: IPracticeInfo) {
    await this.practiceService.saveEssay(practiceInfo.id, dto.essay);
    return {statusCode: 200, error: '', message: 'success'};
  }

  @Post('/essay-correction')
  @UsePipes(new ValidationPipe())
  async essayCorrection(@Body() dto: essayDto, @UserData() userData: User, @PracticeInfo() practiceInfo: IPracticeInfo) {
    await this.practiceService.saveEssay(practiceInfo.id, dto.essay);
    await this.practiceService.saveAiCorrection(practiceInfo.id, await this.aiService.correctText({essay: dto.essay, languageExplanation: userData.native_language}));
    await this.practiceService.finishPractice(practiceInfo.id);
    return {statusCode: 200, error: '', message: 'success', id_text: practiceInfo.id};
  }

  @Get('/archive/:id_practice')
  async getArchivePractice(@Param() dto: archiveDto, @ArchiveInfo() archiveInfo: IPracticeInfo) {
    const result = await this.practiceService.getText(archiveInfo.id_text);
    return {statusCode: 200, error: '', message: 'success1', model: archiveInfo.model, answers: archiveInfo.answers, essay: archiveInfo.essay, ai_correct_essay: archiveInfo.ai_correct_essay, text: result.text}
  }

}
