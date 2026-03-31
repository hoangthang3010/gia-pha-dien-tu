import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  file_name: string;

  @Column({ type: 'text', nullable: true })
  mime_type: string;

  @Column({ type: 'integer', nullable: true })
  file_size: number;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', default: 'PENDING' })
  state: string;

  @Column({ type: 'uuid', nullable: true })
  uploader_id: string;

  @ManyToOne(() => Profile, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploader_id' })
  uploader: Profile;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
