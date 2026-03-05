import { Migration } from '@mikro-orm/migrations';

export class Migration20251220090537_create_guide_schedules_table extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "guide_schedule" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "guide_id" varchar(255) not null, "day_of_week" smallint not null, "start_time" time(0) not null, "end_time" time(0) not null, constraint "guide_schedule_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "guide_schedule" add constraint "guide_schedule_guide_id_foreign" foreign key ("guide_id") references "guide" ("id") on update cascade on delete cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "guide_schedule" cascade;`);
  }
}
