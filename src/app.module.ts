import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from './member/member.module';
import { ClubModule } from './club/club.module';
import { MemberEntity } from './member/member.entity';
import { ClubEntity } from './club/club.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubMemberModule } from './club-member/club-member.module';

@Module({
  imports: [
    MemberModule,
    ClubModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'mclubapi',
      entities: [MemberEntity, ClubEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    ClubMemberModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
