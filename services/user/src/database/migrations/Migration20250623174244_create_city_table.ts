import { Migration } from '@mikro-orm/migrations';

export class Migration20250623174244_create_city_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "city" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" text not null, "country_code" text not null);`,
    );

    this.addSql(
      `alter table "city" add constraint "city_country_code_foreign" foreign key ("country_code") references "country" ("code") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "city" cascade;`);
  }
}
