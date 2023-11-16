/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import { MemberEntity } from '../member/member.entity';

@Entity()
export class ClubEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  foundationDate: string;

  @Column()
  image: string;

  @Column({ length: 100 })
  description: string;

  @ManyToMany(() => MemberEntity, member => member.clubs)
  @JoinTable()
  members: MemberEntity[];
}
