/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { ClubEntity } from '../club/club.entity';
import { MemberEntity } from '../member/member.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClubMemberService } from './club-member.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ClubMemberService', () => {
  let service: ClubMemberService;
  let clubRepository: Repository<ClubEntity>;
  let memberRepository: Repository<MemberEntity>;
  let club: ClubEntity;
  let membersList: MemberEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubMemberService],
    }).compile();

    service = module.get<ClubMemberService>(ClubMemberService);
    clubRepository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    memberRepository = module.get<Repository<MemberEntity>>(getRepositoryToken(MemberEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    memberRepository.clear();
    clubRepository.clear();

    membersList = [];
    for (let i = 0; i < 5; i++) {
      const member: MemberEntity = await memberRepository.save({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        birthdate: faker.date.past().toISOString(),
      });
      membersList.push(member);
    }

    club = await clubRepository.save({
      name: faker.company.name(),
      foundationDate: faker.date.past().toISOString(),
      image: faker.image.url(),
      description: faker.lorem.sentence(),
      members: membersList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMemberToClub should add a member to a club', async () => {
    const newMember: MemberEntity = await memberRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.past().toISOString(),
    });

    const newClub: ClubEntity = await clubRepository.save({
      name: faker.company.name(),
      foundationDate: faker.date.past().toISOString(),
      image: faker.image.url(),
      description: faker.lorem.sentence(),
    });

    const result: ClubEntity = await service.addMemberToClub(newClub.id, newMember.id);

    expect(result.members.length).toBe(1);
    expect(result.members[0]).not.toBeNull();
    expect(result.members[0].username).toBe(newMember.username);
    expect(result.members[0].email).toBe(newMember.email);
    expect(result.members[0].birthdate).toBe(newMember.birthdate);
  });

  it('addMemberToClub should throw an exception for an invalid member', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      name: faker.company.name(),
      foundationDate: faker.date.past().toISOString(),
      image: faker.image.url(),
      description: faker.lorem.sentence(),
    });

    await expect(() => service.addMemberToClub(newClub.id, "0")).rejects.toHaveProperty("message", "The member with the given id was not found");
  });

  it('addMemberToClub should throw an exception for an invalid club', async () => {
    const newMember: MemberEntity = await memberRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.past().toISOString(),
    });

    await expect(() => service.addMemberToClub("0", newMember.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('findMembersFromClub should return members from a club', async () => {
    const result: MemberEntity[] = await service.findMembersFromClub(club.id);

    expect(result.length).toBe(5);
  });

  it('findMembersFromClub should throw an exception for an invalid club', async () => {
    await expect(() => service.findMembersFromClub("0")).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('findMemberFromClub should return a member from a club', async () => {
    const member: MemberEntity = membersList[0];
    const result: MemberEntity = await service.findMemberFromClub(club.id, member.id);

    expect(result).not.toBeNull();
    expect(result.username).toBe(member.username);
    expect(result.email).toBe(member.email);
    expect(result.birthdate).toBe(member.birthdate);
  });

  it('findMemberFromClub should throw an exception for an invalid member', async () => {
    await expect(() => service.findMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "The member with the given id is not associated to the club");
  });

  it('findMemberFromClub should throw an exception for a non-associated member', async () => {
    const newMember: MemberEntity = await memberRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.past().toISOString(),
    });

    await expect(() => service.findMemberFromClub(club.id, newMember.id)).rejects.toHaveProperty("message", "The member with the given id is not associated to the club");
  });

  it('updateMembersFromClub should update members list for a club', async () => {
    const newMembersList: MemberEntity[] = [];
    for (let i = 0; i < 3; i++) {
      const member: MemberEntity = await memberRepository.save({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        birthdate: faker.date.past().toISOString(),
      });
      newMembersList.push(member);
    }

    const updatedClub: ClubEntity = await service.updateMembersFromClub(club.id, newMembersList);

    expect(updatedClub.members.length).toBe(3);
    expect(updatedClub.members[0].username).toBe(newMembersList[0].username);
    expect(updatedClub.members[1].username).toBe(newMembersList[1].username);
    expect(updatedClub.members[2].username).toBe(newMembersList[2].username);
  });

  it('updateMembersFromClub should throw an exception for an invalid club', async () => {
    const newMembersList: MemberEntity[] = [];
    for (let i = 0; i < 3; i++) {
      const member: MemberEntity = await memberRepository.save({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        birthdate: faker.date.past().toISOString(),
      });
      newMembersList.push(member);
    }

    await expect(() => service.updateMembersFromClub("0", newMembersList)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('updateMembersFromClub should throw an exception for an invalid member in the list', async () => {
    const newMembersList: MemberEntity[] = membersList;
    newMembersList[0].id = "0";

    await expect(() => service.updateMembersFromClub(club.id, newMembersList)).rejects.toHaveProperty("message", "The member with the given id was not found");
  });

  it('deleteMemberFromClub should remove a member from a club', async () => {
    const member: MemberEntity = membersList[0];

    await service.deleteMemberFromClub(club.id, member.id);

    const storedClub: ClubEntity = await clubRepository.findOne({ where: { id: club.id }, relations: ['members'] });
    const deletedMember: MemberEntity = storedClub.members.find(m => m.id === member.id);

    expect(deletedMember).toBeUndefined();
  });

  it('deleteMemberFromClub should thrown an exception for an invalid member', async () => {
    await expect(() => service.deleteMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "The member with the given id was not found");
  });

  it('deleteMemberFromClub should thrown an exception for an invalid club', async () => {
    const member: MemberEntity = membersList[0];
    await expect(() => service.deleteMemberFromClub("0", member.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });

  it('deleteMemberFromClub should thrown an exception for a non-associated member', async () => {
    const newMember: MemberEntity = await memberRepository.save({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      birthdate: faker.date.past().toISOString(),
    });

    await expect(() => service.deleteMemberFromClub(club.id, newMember.id)).rejects.toHaveProperty("message", "The member with the given id is not associated to the club");
  });
});
