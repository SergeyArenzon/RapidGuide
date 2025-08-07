import { Migration } from '@mikro-orm/migrations';

export class Migration20250807084654_change_city_country_code_pk_to_country_code extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "city" drop constraint "city_country_code_foreign";`);

    this.addSql(`alter table "city" rename column "country_code" to "code";`);
    this.addSql(`alter table "city" add constraint "city_code_foreign" foreign key ("code") references "country" ("code") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "city" drop constraint "city_code_foreign";`);

    this.addSql(`alter table "city" rename column "code" to "country_code";`);
    this.addSql(`alter table "city" add constraint "city_country_code_foreign" foreign key ("country_code") references "country" ("code") on update cascade on delete no action;`);
  }

}