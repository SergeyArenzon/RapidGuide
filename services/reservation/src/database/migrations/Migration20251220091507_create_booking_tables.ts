import { Migration } from '@mikro-orm/migrations';

export class Migration20251220091507_create_booking_tables extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "booking" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "tour_id" uuid not null, "time_slot_id" uuid not null, "number_of_travellers" int not null default 1, "price_per_traveller" numeric(10,2) not null, "total_price" numeric(10,2) not null, "status" varchar(255) not null default 'pending', "booking_date" timestamptz not null, "reviewed_at" timestamptz null, constraint "booking_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "booking_traveller" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "booking_id" varchar(255) not null, "traveller_id" uuid not null, constraint "booking_traveller_pkey" primary key ("id"));`,
    );

    this.addSql(
      `alter table "booking_traveller" add constraint "booking_traveller_booking_id_foreign" foreign key ("booking_id") references "booking" ("id") on update cascade on delete cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "booking_traveller" drop constraint "booking_traveller_booking_id_foreign";`,
    );

    this.addSql(`drop table if exists "booking" cascade;`);

    this.addSql(`drop table if exists "booking_traveller" cascade;`);
  }
}
