import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('invite_links')
export class InviteLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ default: 'edit' })
  role: string;

  @Column({ type: 'int', default: 0 })
  max_uses: number;

  @Column({ type: 'int', default: 0 })
  used_count: number;

  @Column({ nullable: true })
  created_by: string;

  @Column({ type: 'timestamptz', nullable: true })
  expires_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}

