import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('contributions')
export class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  author_id: string;

  @Column({ type: 'text', nullable: true })
  author_email: string;

  @Column({ type: 'text' })
  person_handle: string;

  @Column({ type: 'text' })
  person_name: string;

  @Column({ type: 'text' })
  field_name: string;

  @Column({ type: 'text' })
  field_label: string;

  @Column({ type: 'text', nullable: true })
  old_value: string;

  @Column({ type: 'text' })
  new_value: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'text', default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  admin_note: string;

  @Column({ type: 'uuid', nullable: true })
  reviewed_by: string;

  @Column({ type: 'timestamptz', nullable: true })
  reviewed_at: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
