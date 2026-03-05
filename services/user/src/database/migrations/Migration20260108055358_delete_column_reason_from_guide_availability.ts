import { Migration } from '@mikro-orm/migrations';

export class Migration20260108055358_delete_column_reason_from_guide_availability extends Migration {
  override async up(): Promise<void> {
    this.addSql(`drop table if exists "guide_schedule" cascade;`);

    this.addSql(`alter table "guide_availability" drop column "reason";`);
  }

  override async down(): Promise<void> {
    this.addSql(
      `create table "guide_schedule" ("id" varchar(255) not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "guide_id" varchar(255) not null, "day_of_week" int2 not null, "start_time" time(0) not null, "end_time" time(0) not null, constraint "guide_schedule_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "guide_schedule" add constraint "guide_schedule_guide_id_foreign" foreign key ("guide_id") references "guide" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "guide_availability" add column "reason" text null;`,
    );
  }
}
