import { Migration } from '@mikro-orm/migrations';

export class Migration20251202182829_many_to_one_guide_country_city extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "guide" drop constraint "guide_city_id_unique";`);
    this.addSql(
      `alter table "guide" drop constraint "guide_country_code_unique";`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "guide" add constraint "guide_city_id_unique" unique ("city_id");`,
    );
    this.addSql(
      `alter table "guide" add constraint "guide_country_code_unique" unique ("country_code");`,
    );
  }
}
