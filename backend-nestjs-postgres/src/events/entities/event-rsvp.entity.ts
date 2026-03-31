import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Event } from "./event.entity";
import { Profile } from "../../profiles/entities/profile.entity";

@Entity('event_rsvps')
export class EventRsvp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    event_id: string;

    @ManyToOne(() => Event, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @Column({ type: 'uuid' })
    user_id: string;

    @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: Profile;

    @Column({ default: 'MAYBE' })
    status: string;

    @Column({ type: 'uuid', nullable: true })
    clan_id: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
