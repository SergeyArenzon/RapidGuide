import { Migration } from '@mikro-orm/migrations';

export class Migration20260119113439_alter_reservatiion_table extends Migration {

  override async up(): Promise<void> {       
    this.addSql(`create table "reservation" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "tour_id" uuid not null, "scheduled_datetime" timestamptz not null, "number_of_travellers" int not null default 1, "price_per_traveller" numeric(10,2) not null, "total_price" numeric(10,2) not null, "status" varchar(255) not null default 'pending', "notes" text null, "reviewed_at" timestamptz null, "rejection_reason" text null, constraint "reservation_pkey" primary key ("id"));`);

    this.addSql(`create table "reservation_availability" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "reservation_id" varchar(255) not null, "availability_id" uuid not null, "slot_order" int not null default 0, constraint "reservation_availability_pkey" primary key ("id"));`);

    this.addSql(`create table "reservation_traveller" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "reservation_id" varchar(255) not null, "traveller_id" uuid not null, constraint "reservation_traveller_pkey" primary key ("id"));`);

    this.addSql(`alter table "reservation_availability" add constraint "reservation_availability_reservation_id_foreign" foreign key ("reservation_id") references "reservation" ("id") on update cascade on delete cascade;`);  

    this.addSql(`alter table "reservation_traveller" add constraint "reservation_traveller_reservation_id_foreign" foreign key ("reservation_id") references "reservation" ("id") on update cascade on delete cascade;`);        
  }

  override async down(): Promise<void> {     
    this.addSql(`alter table "reservation_availability" drop constraint "reservation_availability_reservation_id_foreign";`);

    this.addSql(`alter table "reservation_traveller" drop constraint "reservation_traveller_reservation_id_foreign";`);

    this.addSql(`drop table if exists "reservation" cascade;`);

    this.addSql(`drop table if exists "reservation_availability" cascade;`);

    this.addSql(`drop table if exists "reservation_traveller" cascade;`);
  }

}