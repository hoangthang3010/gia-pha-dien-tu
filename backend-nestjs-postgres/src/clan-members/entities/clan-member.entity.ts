import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Clan } from '../../clans/entities/clan.entity';
import { Profile } from '../../profiles/entities/profile.entity';

@Entity('clan_members')
export class ClanMember {
  @PrimaryColumn('uuid')
  clan_id: string;

  @PrimaryColumn('uuid')
  user_id: string;

  @Column({ default: 'viewer' })
  role: string;

  @ManyToOne(() => Clan, (clan) => clan.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clan_id' })
  clan: Clan;

  @ManyToOne(() => Profile, (profile) => profile.clan_memberships, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Profile;
}
