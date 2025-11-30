import { Migration } from '@mikro-orm/migrations';

export class Migration20250512183006 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "category" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(255) not null, constraint "category_pkey" primary key ("id"));`,
    );

    this.addSql(`drop table if exists "tour" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(
      `create table "tour" ("id" varchar(255) not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "name" varchar(255) not null, "description" varchar(255) not null, constraint "tour_pkey" primary key ("id"));`,
    );

    this.addSql(`drop table if exists "category" cascade;`);
  }
}
