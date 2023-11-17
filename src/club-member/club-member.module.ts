/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { ClubMemberService } from './club-member.service';
import { ClubEntity } from '../club/club.entity';
import { MemberEntity } from '../member/member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [ClubMemberService],
  imports: [TypeOrmModule.forFeature([MemberEntity, ClubEntity])],
})
export class ClubMemberModule {}
