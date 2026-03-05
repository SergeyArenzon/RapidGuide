import { Migration } from '@mikro-orm/migrations';

export class Migration20260105185324_create_guide_avalability_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "guide_availability" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "guide_id" varchar(255) not null, "start_date" date not null, "end_date" date not null, "reason" text null, constraint "guide_availability_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "guide_availability" add constraint "guide_availability_guide_id_foreign" foreign key ("guide_id") references "guide" ("id") on update cascade on delete cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "guide_availability" cascade;`);
  }
}
