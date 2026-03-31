import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { ClanMember } from '../../clan-members/entities/clan-member.entity';

@Entity('clans')
export class Clan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column({ default: true })
  is_public: boolean;

  @Column({ nullable: true })
  created_by: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(() => Profile, (profile) => profile.created_clans)
  @JoinColumn({ name: 'created_by' })
  creator: Profile;

  @OneToMany(() => ClanMember, (clanMember) => clanMember.clan)
  members: ClanMember[];
}
