import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Session } from './session.entity';
import { Account } from './account.entity';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey({ type: 'text' })
  id: string = v4();

  @Property({ type: 'text', unique: true })
  email!: string;

  @Property({ type: 'boolean', default: false })
  emailVerified: boolean = false;

  @Property({ type: 'text', nullable: true })
  name?: string;

  @Property({ type: 'text', nullable: true })
  image?: string;

  @Property({ type: 'text', nullable: true })
  passwordHash?: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToMany(() => Session, session => session.user)
  sessions = new Collection<Session>(this);

  @OneToMany(() => Account, account => account.user)
  accounts = new Collection<Account>(this);
}

