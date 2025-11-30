import { Migration } from '@mikro-orm/migrations';

export class Migration20250515060211 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "sub_category" drop constraint "sub_category_code_unique";`,
    );
    this.addSql(`alter table "sub_category" drop column "code";`);
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "sub_category" add column "code" varchar(255) not null;`,
    );
    this.addSql(
      `alter table "sub_category" add constraint "sub_category_code_unique" unique ("code");`,
    );
  }
}
