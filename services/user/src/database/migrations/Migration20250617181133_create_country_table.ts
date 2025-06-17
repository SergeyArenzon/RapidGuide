import { Migration } from '@mikro-orm/migrations';

export class Migration20250617181133_create_country_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "country" ("code" text not null, "alpha3" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" text not null, "country_code" text not null, "region" text not null, "region_code" text not null, constraint "country_pkey" primary key ("code"));`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "country" cascade;`);
  }
}
