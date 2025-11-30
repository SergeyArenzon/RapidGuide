import { Migration } from '@mikro-orm/migrations';

export class Migration20250515053817 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "sub_category" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(255) not null, "code" varchar(255) not null, "category_id" varchar(255) not null, constraint "sub_category_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "sub_category" add constraint "sub_category_code_unique" unique ("code");`,
    );

    this.addSql(
      `alter table "sub_category" add constraint "sub_category_category_id_foreign" foreign key ("category_id") references "category" ("id") on update cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "sub_category" cascade;`);
  }
}
