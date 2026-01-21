import { Migration } from '@mikro-orm/migrations';

export class Migration20260120070815_rename_datetime_reservation extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "reservation" rename column "scheduled_datetime" to "datetime";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "reservation" rename column "datetime" to "scheduled_datetime";`);
  }

}