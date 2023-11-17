/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, Logger} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MemberDto } from './member.dto';
import { MemberEntity } from './member.entity';
import { MemberService } from './member.service';

@Controller('members')
@UseInterceptors(BusinessErrorsInterceptor)
export class MemberController {
  private readonly logger = new Logger(MemberController.name);
  constructor(private readonly memberService: MemberService) { }

  @Get()
  async findAll() {
    this.logger.debug('findAll');
    return await this.memberService.findAll();
  }

  @Get(':memberId')
  async findOne(@Param('memberId') memberId: string) {
    this.logger.debug('findOne');
    return await this.memberService.findOne(memberId);
  }

  @Post()
  async create(@Body() memberDto: MemberDto) {
    this.logger.debug('create');
    const member: MemberEntity = plainToInstance(MemberEntity, memberDto);
    return await this.memberService.create(member);
  }

  @Put(':memberId')
  async update(@Param('memberId') memberId: string, @Body() memberDto: MemberDto) {
    this.logger.debug('update');
    const member: MemberEntity = plainToInstance(MemberEntity, memberDto);
    return await this.memberService.update(memberId, member);
  }

  @Delete(':memberId')
  @HttpCode(204)
  async delete(@Param('memberId') memberId: string) {
    this.logger.debug('delete');
    return await this.memberService.delete(memberId);
  }
}
