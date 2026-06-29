import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Clan } from '../../clans/entities/clan.entity';
import { Profile } from '../../profiles/entities/profile.entity';

@Entity('people')
export class Person {
  @PrimaryColumn('text')
  handle: string;

  @Column({ type: 'text', nullable: true })
  gramps_id: string;

  @Column({ type: 'int', default: 1 })
  gender: number; // 1=Nam, 2=Nữ

  @Column('text')
  display_name: string;

  @Column({ type: 'text', nullable: true })
  surname: string;

  @Column({ type: 'text', nullable: true })
  first_name: string;

  @Column({ type: 'int', default: 1 })
  generation: number;

  @Column({ type: 'int', nullable: true })
  chi: number;

  @Column({ type: 'int', nullable: true })
  birth_year: number;

  @Column({ type: 'text', nullable: true })
  birth_date: string;

  @Column({ type: 'text', nullable: true })
  birth_place: string;

  @Column({ type: 'int', nullable: true })
  death_year: number;

  @Column({ type: 'text', nullable: true })
  death_date: string;

  @Column({ type: 'text', nullable: true })
  death_place: string;

  @Column({ default: true })
  is_living: boolean;

  @Column({ default: false })
  is_privacy_filtered: boolean;

  @Column({ default: true })
  is_patrilineal: boolean; // true=chính tộc, false=ngoại tộc

  @Column('text', { array: true, default: '{}' })
  families: string[]; // family handles where this person is parent

  @Column('text', { array: true, default: '{}' })
  parent_families: string[]; // family handles where this person is child

  @Column({ type: 'text', nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  zalo: string;

  @Column({ type: 'text', nullable: true })
  facebook: string;

  @Column({ type: 'text', nullable: true })
  current_address: string;

  @Column({ type: 'text', nullable: true })
  hometown: string;

  @Column({ type: 'text', nullable: true })
  occupation: string;

  @Column({ type: 'text', nullable: true })
  company: string;

  @Column({ type: 'text', nullable: true })
  education: string;

  @Column({ type: 'text', nullable: true })
  nick_name: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'uuid', nullable: true })
  clan_id: string;

  @ManyToOne(() => Clan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clan_id' })
  clan: Clan;

  @Column({ type: 'uuid', nullable: true })
  created_by: string;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'created_by' })
  creator: Profile;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
