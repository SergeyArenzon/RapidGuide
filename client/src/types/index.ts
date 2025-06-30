import { UserSchema } from "@/schema";
import { LanguageSchema } from "@/schema/user.schema";
import { CategorySchema } from "@/schema/category.schema";
import { CountrySchema } from "@/schema/country.schema";
import { z } from "zod";
import { CitySchema } from "@/schema/city.schema";

type User = z.infer<typeof UserSchema>;
type Language = z.infer<typeof LanguageSchema>;
type Category = z.infer<typeof CategorySchema>;
type Country = z.infer<typeof CountrySchema>;
type City = z.infer<typeof CitySchema>;


export type { User, Language, Category, Country, City };