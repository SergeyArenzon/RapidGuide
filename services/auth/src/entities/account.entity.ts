import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';

@Entity({ tableName: 'account' })
@Unique({ properties: ['providerId', 'accountId'] })
export class Account {
  @PrimaryKey({ type: 'text' })
  id: string = v4();

  // 👇 Proper relation (MikroORM relation to User)
  @ManyToOne(() => User, { fieldName: 'userId' })
  user!: User;

  @Property({ type: 'text' })
  accountId!: string;

  @Property({ type: 'text' })
  providerId!: string;

  @Property({ type: 'text', nullable: true })
  accessToken?: string;

  @Property({ type: 'text', nullable: true })
  refreshToken?: string;

  @Property({ type: 'timestamp', nullable: true })
  accessTokenExpiresAt?: Date;

  @Property({ type: 'timestamp', nullable: true })
  refreshTokenExpiresAt?: Date;

  @Property({ type: 'text', nullable: true })
  scope?: string;

  @Property({ type: 'text', nullable: true })
  idToken?: string;

  @Property({ type: 'text', nullable: true })
  password?: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
