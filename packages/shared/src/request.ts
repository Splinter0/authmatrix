import { z } from "zod";

export const baseRequestSchema = z.object({
	id: z.string(),
  authSuccessRegex: z.string(),
	roleIds: z.array(z.string()),
	userIds: z.array(z.string()),
  meta: z.object({
    host: z.string(),
    port: z.number(),
    path: z.string(),
    isTls: z.boolean(),
    method: z.string(),
  }),
});

export type BaseRequest = z.infer<typeof baseRequestSchema>;
