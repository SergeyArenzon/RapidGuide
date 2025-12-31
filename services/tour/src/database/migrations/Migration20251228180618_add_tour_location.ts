import { Migration } from '@mikro-orm/migrations';

export class Migration20251228180618_add_tour_location extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "tour" add column "city_id" numeric(10,0) not null, add column "country_code" text not null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "tour" drop column "city_id", drop column "country_code";`,
    );
  }
}
