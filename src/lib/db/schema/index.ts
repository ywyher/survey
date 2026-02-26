import { pgEnum, pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender_enum", ["male", "female"]);
export const occupationEnum = pgEnum("occupation_enum", [
  "office_work", 
  "hard_manual_labor", 
  "housewife", 
  "outdoor_work", 
  "light_to_moderate_activity"
]);
export const jointEnum = pgEnum("joint_enum", [
  "knee", 
  "hip", 
  "hand", 
  "shoulder", 
  "spine"
]);
export const activityLevelEnum = pgEnum("activity_level_enum", [
  "sedentary",
  "lightly_active",
  "moderately_active",
  "very_active",
]);

export const survey = pgTable("survey", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  age: integer("age").notNull(),
  gender: genderEnum("gender").notNull(),
  
  occupation: occupationEnum("occupation").notNull(),
  
  isDiagnosed: text("is_diagnosed", { enum: ["yes", "no", "unsure"] }).notNull(),
  
  affectedJoints: jointEnum("affected_joints").array(), 
  
  hasChronicPain: text("has_chronic_pain", { enum: ["yes", "no", "unsure"] }).notNull(),
  
  activityLevel: activityLevelEnum("activity_level").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});