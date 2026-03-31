import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Clan } from '../../clans/entities/clan.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  author_id: string;

  @ManyToOne(() => Profile, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author: Profile;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column('text')
  body: string;

  @Column({ default: 'general' })
  type: string;

  @Column({ default: 'published' })
  status: string; // draft, published, archived

  @Column({ default: false })
  is_pinned: boolean;

  @Column({ type: 'uuid', nullable: true })
  clan_id: string;

  @ManyToOne(() => Clan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clan_id' })
  clan: Clan;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
