import { Migration } from '@mikro-orm/migrations';

export class Migration20251202184503_unique_guide_user_id extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "guide" add constraint "guide_user_id_unique" unique ("user_id");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "guide" drop constraint "guide_user_id_unique";`);
  }
}
