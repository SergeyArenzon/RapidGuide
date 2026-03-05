import { Migration } from '@mikro-orm/migrations';


export class Migration20251210203330_create_table_traveller extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "traveller" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "user_id" uuid not null, "bio" text not null, "country_code" text not null, "city_id" int not null, constraint "traveller_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "traveller" add constraint "traveller_user_id_unique" unique ("user_id");`,
    );

    this.addSql(
      `create table "traveller_languages" ("traveller_id" varchar(255) not null, "languages_code" varchar(255) not null, constraint "traveller_languages_pkey" primary key ("traveller_id", "languages_code"));`,
    );

    this.addSql(
      `create table "traveller_subcategory" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "traveller_id" varchar(255) not null, "subcategory_id" uuid not null, constraint "traveller_subcategory_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "traveller" add constraint "traveller_country_code_foreign" foreign key ("country_code") references "country" ("code") on update cascade;`,
    );
    this.addSql(
      `alter table "traveller" add constraint "traveller_city_id_foreign" foreign key ("city_id") references "city" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "traveller_languages" add constraint "traveller_languages_traveller_id_foreign" foreign key ("traveller_id") references "traveller" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "traveller_languages" add constraint "traveller_languages_languages_code_foreign" foreign key ("languages_code") references "languages" ("code") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "traveller_subcategory" add constraint "traveller_subcategory_traveller_id_foreign" foreign key ("traveller_id") references "traveller" ("id") on update cascade on delete cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "traveller_languages" drop constraint "traveller_languages_traveller_id_foreign";`,
    );

    this.addSql(
      `alter table "traveller_subcategory" drop constraint "traveller_subcategory_traveller_id_foreign";`,
    );

    this.addSql(`drop table if exists "traveller" cascade;`);

    this.addSql(`drop table if exists "traveller_languages" cascade;`);

    this.addSql(`drop table if exists "traveller_subcategory" cascade;`);
  }
}
