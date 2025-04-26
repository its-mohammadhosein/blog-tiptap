import { z } from "zod";

// Main post creation schema (used for APIs or forms)
export const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.any(), // You can make this stricter if needed
  authorId: z.union([z.string(), z.number()], {
    required_error: "Author ID is required",
  }),
  slug:z.string().optional()
});

// Optional: Export inferred TypeScript type
export type PostInput = z.infer<typeof PostSchema>;

// Slug validation schema
export const SlugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "Slug must be lowercase, with hyphens instead of spaces, and contain only alphanumeric characters",
  });
