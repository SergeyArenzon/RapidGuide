import { Migration } from '@mikro-orm/migrations';

export class Migration20251112083632_add_image_name_to_user extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "name" varchar(255) not null default '', add column "image" varchar(255) not null default '';`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "name", drop column "image";`);
  }

}