"use server"

import { surveySchema } from "@/app/form"
import { db } from "@/lib/db"
import { survey } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import z from "zod"

export async function submitSurvey(data: z.infer<typeof surveySchema>) {
  const { age, gender, activityLevel, affectedJoints, hasChronicPain, isDiagnosed, occupation } = data

  try {
    await db.insert(survey).values({
      age,
      gender,
      occupation,
      isDiagnosed: isDiagnosed,
      affectedJoints: affectedJoints ?? [],
      hasChronicPain,
      activityLevel,
    })
  
    return { 
      message: "Data inserted successfuly",
      error: null
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to insert data!",
      message: null
    }
  }
}

export async function getSurveys() {
  const data = await db.select().from(survey).orderBy(desc(survey.createdAt))
  return data
}

export async function deleteSurvey(id: string) {
  try {
    await db.delete(survey).where(eq(survey.id, id))
    return { error: null }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete." }
  }
}