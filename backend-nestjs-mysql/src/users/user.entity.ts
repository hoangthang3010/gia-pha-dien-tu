import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  hashedPassword: string;

  @Column({ unique: true })
  email: string;

  @Column()
  displayName: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column({ nullable: true })
  avatarId?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  bio?: string;

  @Column({ nullable: true })
  phone?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
