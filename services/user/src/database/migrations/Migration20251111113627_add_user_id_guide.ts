import { Migration } from '@mikro-orm/migrations';

export class Migration20251111113627_add_user_id_guide extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "guide" add column "user_id" uuid not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "guide" drop column "user_id";`);
  }
}
