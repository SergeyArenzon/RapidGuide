import { Migration } from '@mikro-orm/migrations';

export class Migration20260111200921_start_end_datetime extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "guide_availability" alter column "start_date" type timestamptz using ("start_date"::timestamptz);`,
    );
    this.addSql(
      `alter table "guide_availability" alter column "end_date" type timestamptz using ("end_date"::timestamptz);`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "guide_availability" alter column "start_date" type date using ("start_date"::date);`,
    );
    this.addSql(
      `alter table "guide_availability" alter column "end_date" type date using ("end_date"::date);`,
    );
  }
}
