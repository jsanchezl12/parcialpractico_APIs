/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MemberEntity } from './member.entity';
import { MemberService } from './member.service';

import { faker } from '@faker-js/faker';

describe('MemberService', () => {
  let service: MemberService;
  let repository: Repository<MemberEntity>;
  let membersList: MemberEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MemberService],
    }).compile();

    service = module.get<MemberService>(MemberService);
    repository = module.get<Repository<MemberEntity>>(getRepositoryToken(MemberEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    membersList = [];
    for (let i = 0; i < 5; i++) {
      const member: MemberEntity = await repository.save({
        username: faker.company.name(),
        email: faker.internet.email(),
        birthdate: faker.date.past().toISOString(),
      })
      membersList.push(member);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all members', async () => {
    const members: MemberEntity[] = await service.findAll();
    expect(members).not.toBeNull();
    expect(members).toHaveLength(membersList.length);
  });

  it('findOne should return a member by id', async () => {
    const storedMember: MemberEntity = membersList[0];
    const member: MemberEntity = await service.findOne(storedMember.id);
    expect(member).not.toBeNull();
    expect(member.username).toEqual(storedMember.username)
    expect(member.email).toEqual(storedMember.email)
    expect(member.birthdate).toEqual(storedMember.birthdate)
  });
  it('findOne should throw an exception for an invalid member', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The member with the given id was not found")
  });

  it('create should return a new member', async () => {
    const member: MemberEntity = {
      id: "",
      username: faker.company.name(),
      email: faker.internet.email(),
      birthdate: faker.date.past().toISOString(),
      clubs: []
    }
    const newMember: MemberEntity = await service.create(member);
    expect(newMember).not.toBeNull();
    const storedMember: MemberEntity = await repository.findOne({ where: { id: newMember.id } })
    expect(storedMember).not.toBeNull();
    expect(storedMember.username).toEqual(newMember.username)
    expect(storedMember.email).toEqual(newMember.email)
    expect(storedMember.birthdate).toEqual(newMember.birthdate)
  });

  it('update should modify a member', async () => {
    const member: MemberEntity = membersList[0];
    member.username = "New username";
    member.email = "New email";

    const updatedMember: MemberEntity = await service.update(member.id, member);
    expect(updatedMember).not.toBeNull();

    const storedMember: MemberEntity = await repository.findOne({ where: { id: member.id } })
    expect(storedMember).not.toBeNull();
    expect(storedMember.username).toEqual(member.username)
    expect(storedMember.email).toEqual(member.email)
  });

  it('update should throw an exception for an invalid member', async () => {
    let member: MemberEntity = membersList[0];
    member = {
      ...member, username: "New username", email: "New email"
    }
    await expect(() => service.update("0", member)).rejects.toHaveProperty("message", "The member with the given id was not found")
  });

  it('delete should remove a member', async () => {
    const member: MemberEntity = membersList[0];
    await service.delete(member.id);
  
    const deletedMember: MemberEntity = await repository.findOne({ where: { id: member.id } })
    expect(deletedMember).toBeNull();
  });

  it('delete should throw an exception for an invalid member', async () => {
    const member: MemberEntity = membersList[0];
    await service.delete(member.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The member with the given id was not found")
  });
});
