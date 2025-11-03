import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';

@Entity({ tableName: 'sessions' })
export class Session {
  @PrimaryKey({ type: 'text' })
  id: string = v4();

  @ManyToOne(() => User)
  user!: User;

  @Property({ type: 'timestamp' })
  expiresAt!: Date;

  @Property({ type: 'text', nullable: true })
  ipAddress?: string;

  @Property({ type: 'text', nullable: true })
  userAgent?: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}

