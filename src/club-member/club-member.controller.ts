/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, Logger} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MemberEntity } from '../member/member.entity';
import { ClubMemberService } from './club-member.service';
import { MemberDto } from 'src/member/member.dto';

@Controller('clubs')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubMemberController {
  private readonly logger = new Logger(ClubMemberController.name);
  constructor(private readonly clubMemberService: ClubMemberService) {}

  @Post(':clubId/members/:memberId')
  async addMemberToClub(@Param('clubId') clubId: string, @Param('memberId') memberId: string) {
    this.logger.debug('addMemberToClub');
    return await this.clubMemberService.addMemberToClub(clubId, memberId);
  }

  @Get(':clubId/members')
  async findMembersFromClub(@Param('clubId') clubId: string) {
    this.logger.debug('findMembersFromClub');
    return await this.clubMemberService.findMembersFromClub(clubId);
  }

  @Get(':clubId/members/:memberId')
  async findMemberFromClub(@Param('clubId') clubId: string, @Param('memberId') memberId: string) {
    this.logger.debug('findMemberFromClub');
    return await this.clubMemberService.findMemberFromClub(clubId, memberId);
  }

  @Put(':clubId/members')
  async updateMembersFromClub(@Param('clubId') clubId: string, @Body() memberDto: MemberDto[]) {
    this.logger.debug('updateMembersFromClub');
    const member: MemberEntity[] = plainToInstance(MemberEntity, memberDto);
    return await this.clubMemberService.updateMembersFromClub(clubId, member);
  }

  @Delete(':clubId/members/:memberId')
  @HttpCode(204)
  async deleteMemberFromClub(@Param('clubId') clubId: string, @Param('memberId') memberId: string) {
    this.logger.debug('deleteMemberFromClub');
    return await this.clubMemberService.deleteMemberFromClub(clubId, memberId);
  }
}
