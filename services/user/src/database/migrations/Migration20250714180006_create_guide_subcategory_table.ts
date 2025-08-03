import { Migration } from '@mikro-orm/migrations';

export class Migration20250714180006_create_guide_subcategory_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "guide_subcategory" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "guide_id" varchar(255) not null, "subcategory_id" varchar(255) not null, constraint "guide_subcategory_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "guide_subcategory" add constraint "guide_subcategory_guide_id_foreign" foreign key ("guide_id") references "guide" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(`alter table "guide" drop column "categories";`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "guide_subcategory" cascade;`);

    this.addSql(`alter table "guide" add column "categories" text not null;`);
  }
}
