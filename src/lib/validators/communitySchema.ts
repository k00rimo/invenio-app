import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const communityFormSchema = z.object({
  name: z
    .string()
    .min(3, "Community name must be at least 3 characters.")
    .max(100, "Community name must be 100 characters or less."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(1000, "Description must be 1000 characters or less."),
  picture: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) {
          return true;
        }
        return files[0].size <= MAX_FILE_SIZE;
      },
      `Max file size is 5MB.`,
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) {
          return true;
        }
        return ACCEPTED_IMAGE_TYPES.includes(files[0].type);
      },
      "Only .jpg, .jpeg, .png, and .webp formats are supported.",
    ),
});

export type CommunityFormData = z.infer<typeof communityFormSchema>;
