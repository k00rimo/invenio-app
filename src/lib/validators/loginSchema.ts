import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email({ message: "Please enter a valid email address." }),
  password: z
    .string({ error: "Password is required." })
    .min(5, { message: "Password must be at least 8 characters long." }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
