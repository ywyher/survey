"use server";

import { desc, eq } from "drizzle-orm";
import type z from "zod";
import { db } from "@/lib/db";
import { response } from "@/lib/db/schema";
import { responseSchema } from "@/app/submit/page";

export async function submitResponse(data: z.infer<typeof responseSchema>) {
  const {
    age,
    gender,
    activityLevel,
    affectedJoints,
    hasChronicPain,
    isDiagnosed,
    occupation,
  } = data;

  try {
    await db.insert(response).values({
      age,
      gender,
      occupation,
      isDiagnosed: isDiagnosed,
      affectedJoints: affectedJoints ?? [],
      hasChronicPain,
      activityLevel,
    });

    return {
      message: "Data inserted successfuly",
      error: null,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to insert data!",
      message: null,
    };
  }
}

export async function getResponses() {
  const data = await db.select().from(response).orderBy(desc(response.createdAt));
  return data;
}

export async function deleteResponse(id: string) {
  try {
    await db.delete(response).where(eq(response.id, id));
    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete.",
    };
  }
}
