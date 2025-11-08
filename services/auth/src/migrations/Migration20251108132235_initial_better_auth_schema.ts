import { Migration } from '@mikro-orm/migrations';

export class Migration20251108132235_initial_better_auth_schema extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "user" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "removed_at" varchar(255) null, "email" varchar(255) not null, "email_verified" boolean not null default false, constraint "user_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "user_created_at_index" on "user" ("created_at");`,
    );
    this.addSql(
      `create index "user_updated_at_index" on "user" ("updated_at");`,
    );
    this.addSql(
      `create index "user_removed_at_index" on "user" ("removed_at");`,
    );
    this.addSql(
      `alter table "user" add constraint "user_email_unique" unique ("email");`,
    );

    this.addSql(
      `create table "session" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "token" varchar(255) not null, "expires_at" timestamptz not null, "ip_address" varchar(255) null, "user_agent" varchar(255) null, "user_id" uuid not null, constraint "session_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "session_created_at_index" on "session" ("created_at");`,
    );
    this.addSql(
      `create index "session_updated_at_index" on "session" ("updated_at");`,
    );
    this.addSql(
      `alter table "session" add constraint "session_token_unique" unique ("token");`,
    );

    this.addSql(
      `create table "account" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "account_id" varchar(255) not null, "provider_id" varchar(255) not null, "access_token" text null, "refresh_token" text null, "id_token" text null, "access_token_expires_at" timestamptz null, "refresh_token_expires_at" timestamptz null, "scope" text null, "password" text null, "user_id" uuid not null, constraint "account_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "account_created_at_index" on "account" ("created_at");`,
    );
    this.addSql(
      `create index "account_updated_at_index" on "account" ("updated_at");`,
    );

    this.addSql(
      `create table "verification" ("id" uuid not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "identifier" varchar(255) not null, "value" text not null, "expires_at" timestamptz not null, constraint "verification_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "verification_created_at_index" on "verification" ("created_at");`,
    );
    this.addSql(
      `create index "verification_updated_at_index" on "verification" ("updated_at");`,
    );

    this.addSql(
      `alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "account" add constraint "account_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`,
    );
  }
}
