import { z } from "zod";

const envVariables = z.object({
  DATABASE_URL: z.number(),
  OPEN_AI_API_KEY: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
