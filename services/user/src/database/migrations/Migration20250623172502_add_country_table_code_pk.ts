import { Migration } from '@mikro-orm/migrations';

export class Migration20250623172502_add_country_table_code_pk extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "country" drop constraint "country_pkey";`);

    this.addSql(
      `alter table "country" add constraint "country_pkey" primary key ("code");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "country" drop constraint "country_pkey";`);

    this.addSql(
      `alter table "country" add constraint "country_pkey" primary key ("code", "alpha3");`,
    );
  }
}
