import { Migration } from '@mikro-orm/migrations';

export class Migration20251103134240_initial_auth_schema extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" text not null, "name" text not null, "email" text not null, "email_verified" boolean not null default false, "image" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "test_field" text null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "session" ("id" text not null, "user_id" text not null, "userId" text not null, "token" text not null, "expires_at" timestamptz not null, "ip_address" text null, "user_agent" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "session_pkey" primary key ("id"));`);
    this.addSql(`alter table "session" add constraint "session_token_unique" unique ("token");`);     

    this.addSql(`create table "account" ("id" text not null, "user_id" text not null, "userId" text not null, "account_id" text not null, "provider_id" text not null, "access_token" text null, "refresh_token" text null, "access_token_expires_at" timestamptz null, "refresh_token_expires_at" timestamptz null, "scope" text null, "id_token" text null, "password" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "account_pkey" primary key ("id"));`);
    this.addSql(`alter table "account" add constraint "account_provider_id_account_id_unique" unique ("provider_id", "account_id");`);

    this.addSql(`create table "verification" ("id" text not null, "identifier" text not null, "value" 
text not null, "expires_at" timestamptz not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "verification_pkey" primary key ("id"));`);

    this.addSql(`alter table "session" add constraint "session_userId_foreign" foreign key ("userId") 
references "user" ("id") on update cascade;`);

    this.addSql(`alter table "account" add constraint "account_userId_foreign" foreign key ("userId") 
references "user" ("id") on update cascade;`);
  }

}

