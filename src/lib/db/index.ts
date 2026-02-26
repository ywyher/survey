import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import type { PgTransaction } from "drizzle-orm/pg-core";
import { env } from "@/lib/env/server";
import * as schema from "./schema/index";

export const db = drizzle(env.DATABASE_URL, {
  schema,
  logger: true,
});

export type DBInstance = PgTransaction<
  NodePgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;
