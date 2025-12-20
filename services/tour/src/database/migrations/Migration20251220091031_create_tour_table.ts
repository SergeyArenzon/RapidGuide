import { Migration } from '@mikro-orm/migrations';

export class Migration20251220091031_create_tour_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "tour" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "guide_id" uuid not null, "name" varchar(255) not null, "description" text not null, "min_travellers" int null, "max_travellers" int null, "price" numeric(10,2) not null, "duration_minutes" int null, constraint "tour_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "tour_subcategory" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "tour_id" varchar(255) not null, "subcategory_id" varchar(255) not null, constraint "tour_subcategory_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "tour_subcategory" add constraint "tour_subcategory_tour_id_foreign" foreign key ("tour_id") references "tour" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "tour_subcategory" add constraint "tour_subcategory_subcategory_id_foreign" foreign key ("subcategory_id") references "sub_category" ("id") on update cascade on delete cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "tour_subcategory" drop constraint "tour_subcategory_tour_id_foreign";`,
    );

    this.addSql(`drop table if exists "tour" cascade;`);

    this.addSql(`drop table if exists "tour_subcategory" cascade;`);
  }
}
