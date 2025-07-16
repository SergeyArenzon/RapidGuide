import { UserSchema } from "@/schema/user.schema";
import { LanguageSchema } from "@/schema/user.schema";
import { CategorySchema } from "@/schema/category.schema";
import { z } from "zod";
import { CountrySchema } from "@/schema/country.schema";
import { CitySchema } from "@/schema/city.schema";
import { GuideSchema } from "@/schema/guide.schema";

type User = z.infer<typeof UserSchema>;
type Language = z.infer<typeof LanguageSchema>;
type Category = z.infer<typeof CategorySchema>;
type Country = z.infer<typeof CountrySchema>;
type City = z.infer<typeof CitySchema>;
type Guide = z.infer<typeof GuideSchema>;


export type { User, Language, Category, Country, City, Guide };