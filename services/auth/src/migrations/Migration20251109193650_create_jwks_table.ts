import { Migration } from '@mikro-orm/migrations';

export class Migration20251109193650_create_jwks_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "jwks" ("id" uuid not null, "public_key" text not null, "private_key" text not null, "created_at" timestamptz not null, "crv" varchar(255) null, constraint "jwks_pkey" primary key ("id"));`,
    );
    this.addSql(`create index "jwks_crv_index" on "jwks" ("crv");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "jwks" cascade;`);
  }
}
