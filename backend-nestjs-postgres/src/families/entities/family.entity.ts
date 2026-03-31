import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Clan } from '../../clans/entities/clan.entity';

@Entity('families')
export class Family {
  @PrimaryColumn('text')
  handle: string;

  @Column({ type: 'text', nullable: true })
  father_handle: string;

  @Column({ type: 'text', nullable: true })
  mother_handle: string;

  @Column('text', { array: true, default: '{}' })
  children: string[];

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
