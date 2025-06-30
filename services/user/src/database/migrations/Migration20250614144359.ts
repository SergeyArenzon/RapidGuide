import { Migration } from '@mikro-orm/migrations';

export class Migration20250614144359 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "languages" ("code" varchar(255) not null, "name" varchar(255) not null, constraint "languages_pkey" primary key ("code"));`,
    );

    this.addSql(
      `alter table "guide" add constraint "guide_user_id_unique" unique ("user_id");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "languages" cascade;`);

    this.addSql(`alter table "guide" drop constraint "guide_user_id_unique";`);
  }
}
