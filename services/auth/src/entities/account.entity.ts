import { Entity, PrimaryKey, Property, ManyToOne, Unique } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';

@Entity({ tableName: 'accounts' })
@Unique({ properties: ['provider', 'providerAccountId'] })
export class Account {
  @PrimaryKey({ type: 'text' })
  id: string = v4();

  @ManyToOne(() => User)
  user!: User;

  @Property({ type: 'text' })
  provider!: string;

  @Property({ type: 'text' })
  providerAccountId!: string;

  @Property({ type: 'text', nullable: true })
  accessToken?: string;

  @Property({ type: 'text', nullable: true })
  refreshToken?: string;

  @Property({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();
}

