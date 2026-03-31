import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Clan } from '../../clans/entities/clan.entity';
import { ClanMember } from '../../clan-members/entities/clan-member.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  hashed_password?: string; // Add hashed password for authentication

  @Column({ nullable: true })
  display_name: string;

  @Column({ default: 'member' })
  role: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  person_handle: string;

  @Column({ nullable: true })
  avatar_url: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @OneToMany(() => Clan, (clan) => clan.creator)
  created_clans: Clan[];

  @OneToMany(() => ClanMember, (clanMember) => clanMember.user)
  clan_memberships: ClanMember[];
}
