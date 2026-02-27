import { response } from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type Response = InferSelectModel<typeof response>;