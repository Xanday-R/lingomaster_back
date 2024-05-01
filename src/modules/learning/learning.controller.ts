import {Body, Controller, Get, Inject, Param, Patch, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import {LearningService} from './core/services/learning.service';
import {getAllTableDto, saveTextDto, changeWordDto, addWordDto, deleteTextOrWordDto} from './core/dto/learning.dto';
import {Tables, User, UserData} from '../../core';
import {PracticeService} from './core/services/practice.service';


@Controller('learning')
export class LearningController {
  constructor(@Inject('learning') private readonly learningService: LearningService, @Inject('practice') private readonly practiceService: PracticeService) {}

  @Post('/add-word')
  @UsePipes(new ValidationPipe())
  async addWord(@Body() dto: addWordDto, @UserData() userData: User ) {
    await this.learningService.addWord(userData.id, dto.language_word, dto.word, dto.translation);
    return {statusCode: 200, error: '', message: 'success'};
  }

  @Get('/get-all/:table')
  @UsePipes(new ValidationPipe())
  async getTexts(@Param() dto: getAllTableDto, @UserData() userData: User) {
    const result = await this.learningService.getWordsOrTexts(dto.table as Tables.texts | Tables.words, userData.id);
    return {statusCode: 200, error: '', message: 'success', data: result};
  }

  @Post('/change-word')
  @UsePipes(new ValidationPipe())
  async changeWord(@Body() dto: changeWordDto) {
    await this.learningService.changeWord(dto.id, dto.word, dto.translation);
    return {statusCode: 200, error: '', message: 'success'};
  }

  @Post('/delete/:table/:id')
  @UsePipes(new ValidationPipe())
  async deleteTextOrWord(@Param() dto:deleteTextOrWordDto) {
    await this.learningService.removeWordOrText(dto.table as Tables.texts | Tables.words, dto.id);
    if(dto.table === Tables.texts) await this.practiceService.finishPractice(dto.id);
    return {statusCode: 200, error: '', message: 'success'};
  }

}
