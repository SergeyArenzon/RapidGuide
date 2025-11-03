import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';

@Entity({ tableName: 'session' })
export class Session {
  @PrimaryKey({ type: 'text' })
  id: string = v4();

  @Property({ type: 'text' })
  userId!: string;

  @ManyToOne(() => User, { fieldName: 'userId' })
  user!: User;

  @Property({ type: 'text', unique: true })
  token!: string;

  @Property({ type: 'timestamp' })
  expiresAt!: Date;

  @Property({ type: 'text', nullable: true })
  ipAddress?: string;

  @Property({ type: 'text', nullable: true })
  userAgent?: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

