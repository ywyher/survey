import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    APP_NAME: z.string(),
    DATABASE_URL: z.url(),
  },
  experimental__runtimeEnv: process.env,
});
