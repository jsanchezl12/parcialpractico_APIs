/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ClubDto } from './club.dto';
import { ClubEntity } from './club.entity';
import { ClubService } from './club.service';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubController {
  private readonly logger = new Logger(ClubController.name);
  constructor(private readonly clubService: ClubService) { }

  @Get()
  async findAll() {
    this.logger.debug('findAll');
    return await this.clubService.findAll();
  }

  @Get(':clubId')
  async findOne(@Param('clubId') clubId: string) {
    this.logger.debug('findOne');
    return await this.clubService.findOne(clubId);
  }

  @Post()
  async create(@Body() clubDto: ClubDto) {
    this.logger.debug('create');
    const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
    return await this.clubService.create(club);
  }

  @Put(':clubId')
  async update(@Param('clubId') clubId: string, @Body() clubDto: ClubDto) {
    this.logger.debug('update');
    const club: ClubEntity = plainToInstance(ClubEntity, clubDto);
    return await this.clubService.update(clubId, club);
  }

  @Delete(':clubId')
  @HttpCode(204)
  async delete(@Param('clubId') clubId: string) {
    this.logger.debug('delete');
    return await this.clubService.delete(clubId);
  }
}
