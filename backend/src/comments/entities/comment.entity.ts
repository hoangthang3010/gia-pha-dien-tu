import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profile } from '../../profiles/entities/profile.entity';
import { Clan } from '../../clans/entities/clan.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  author_id: string;

  @ManyToOne(() => Profile, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author: Profile;

  @Column({ type: 'uuid', nullable: true })
  post_id: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ type: 'text', nullable: true })
  author_email: string;

  @Column({ type: 'text', nullable: true })
  author_name: string;

  @Column('text')
  content: string;

  @Column({ type: 'text', nullable: true })
  person_handle: string;

  @Column({ type: 'uuid', nullable: true })
  clan_id: string;

  @ManyToOne(() => Clan, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clan_id' })
  clan: Clan;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
