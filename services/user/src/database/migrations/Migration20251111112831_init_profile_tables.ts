import { Migration } from '@mikro-orm/migrations';                                              
                                                                                                
export class Migration20251111112831_init_profile_tables extends Migration {                    
                                                                                                
  override async up(): Promise<void> {                                                          
    this.addSql(`create table "country" ("code" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "alpha3" text not null, "name" text not null, "country_code" text not null, "region" text not null, "region_code" text not null, constraint "country_pkey" primary key ("code"));`);                                                                       
                                                                                                
    this.addSql(`create table "city" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" text not null, "code" text not null);`);            
                                                                                                
    this.addSql(`create table "guide" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" text not null, "bio" text not null, "country_code" text not null, "city_id" int not null, constraint "guide_pkey" primary key ("id"));`);       
    this.addSql(`alter table "guide" add constraint "guide_country_code_unique" unique ("country_code");`);                                                                                     
    this.addSql(`alter table "guide" add constraint "guide_city_id_unique" unique ("city_id");`);                                                                                               
                                                                                                
    this.addSql(`create table "guide_subcategory" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "guide_id" varchar(255) not null, "subcategory_id" varchar(255) not null, constraint "guide_subcategory_pkey" primary key ("id"));`);      
                                                                                                
    this.addSql(`create table "languages" ("code" varchar(255) not null, "name" varchar(255) not null, constraint "languages_pkey" primary key ("code"));`);                                    
                                                                                                
    this.addSql(`create table "guide_languages" ("guide_id" varchar(255) not null, "languages_code" varchar(255) not null, constraint "guide_languages_pkey" primary key ("guide_id", "languages_code"));`);                                                                                    
                                                                                                
    this.addSql(`alter table "city" add constraint "city_code_foreign" foreign key ("code") references "country" ("code") on update cascade;`);                                                 
                                                                                                
    this.addSql(`alter table "guide" add constraint "guide_country_code_foreign" foreign key ("country_code") references "country" ("code") on update cascade;`);                               
    this.addSql(`alter table "guide" add constraint "guide_city_id_foreign" foreign key ("city_id") references "city" ("id") on update cascade;`);                                              
                                                                                                
    this.addSql(`alter table "guide_subcategory" add constraint "guide_subcategory_guide_id_foreign" foreign key ("guide_id") references "guide" ("id") on update cascade on delete cascade;`); 
                                                                                                
    this.addSql(`alter table "guide_languages" add constraint "guide_languages_guide_id_foreign" foreign key ("guide_id") references "guide" ("id") on update cascade on delete cascade;`);     
    this.addSql(`alter table "guide_languages" add constraint "guide_languages_languages_code_foreign" foreign key ("languages_code") references "languages" ("code") on update cascade on delete cascade;`);                                                                                   
  }                                                                                             
                                                                                                
}           