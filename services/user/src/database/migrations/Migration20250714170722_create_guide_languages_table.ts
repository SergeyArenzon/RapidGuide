import { Migration } from '@mikro-orm/migrations';

export class Migration20250714170722_create_guide_languages_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "guide_languages" ("guide_id" varchar(255) not null, "languages_code" varchar(255) not null, constraint "guide_languages_pkey" primary key ("guide_id", "languages_code"));`,
    );

    this.addSql(
      `alter table "guide_languages" add constraint "guide_languages_guide_id_foreign" foreign key ("guide_id") references "guide" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "guide_languages" add constraint "guide_languages_languages_code_foreign" foreign key ("languages_code") references "languages" ("code") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "guide" add column "name" text not null, add column "bio" text not null, add column "categories" text not null, add column "country_code" text not null, add column "city_id" int not null;`,
    );
    this.addSql(
      `alter table "guide" add constraint "guide_country_code_foreign" foreign key ("country_code") references "country" ("code") on update cascade;`,
    );
    this.addSql(
      `alter table "guide" add constraint "guide_city_id_foreign" foreign key ("city_id") references "city" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "guide" add constraint "guide_country_code_unique" unique ("country_code");`,
    );
    this.addSql(
      `alter table "guide" add constraint "guide_city_id_unique" unique ("city_id");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "guide_languages" cascade;`);

    this.addSql(
      `alter table "guide" drop constraint "guide_country_code_foreign";`,
    );
    this.addSql(`alter table "guide" drop constraint "guide_city_id_foreign";`);

    this.addSql(
      `alter table "guide" drop constraint "guide_country_code_unique";`,
    );
    this.addSql(`alter table "guide" drop constraint "guide_city_id_unique";`);
    this.addSql(
      `alter table "guide" drop column "name", drop column "bio", drop column "categories", drop column "country_code", drop column "city_id";`,
    );
  }
}
