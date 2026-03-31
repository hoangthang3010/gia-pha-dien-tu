import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Clan } from '../../clans/entities/clan.entity';
import { Profile } from '../../profiles/entities/profile.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamptz' })
  start_at: Date;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ default: 'event' })
  type: string;

  @Column({ type: 'uuid', nullable: true })
  creator_id: string;

  @ManyToOne(() => Profile, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'creator_id' })
  creator: Profile;

  @Column({ type: 'uuid', nullable: true })
  clan_id: string;

  @ManyToOne(() => Clan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clan_id' })
  clan: Clan;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
