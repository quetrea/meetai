import { z } from "zod";

export const AgentsInsertSchema = z.object({
  name: z.string().min(1, "Name is required"),
  instructions: z.string().min(1, "Instructions are required"),
});
