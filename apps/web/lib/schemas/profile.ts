import { z } from "zod";

export const profileSchema = z.object({
  displayName: z.string().min(1, "Display name is required."),
});

export type ProfileValues = z.infer<typeof profileSchema>;
