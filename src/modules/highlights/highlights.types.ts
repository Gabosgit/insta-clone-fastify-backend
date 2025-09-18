import { z } from "zod";

// First, we define the zod schemas
// The highlight DTO (Data Transferable Object),
//which will be the shape of the highlight object when it is passed to our database.
const createHighlightDtoSchema = z.object({
  user_id: z.number(),
  title: z.string().min(1).max(50),
  cover_image_url: z.string().url().optional(),
});


// The Highlight object, which will be the shape of the highlight object when it is fetched from our database,
// where it will include an id and an SQL time-stamp.
const highlightSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string().min(1).max(50),
  cover_image_url: z.string().url().optional(),
  created_at: z.string(), // SQLite returns DATETIME as a string by default
  updated_at: z.string(),
});

// This will be useful for validating the response from the `GET /highlights` endpoint.
const highlightsSchema = z.array(highlightSchema);

// Then, we infer the TypeScript types directly from our Zod schemas.
// This avoids duplicating type definitions and ensures our types always match our validation rules.
type CreateHighlightDto = z.infer<typeof createHighlightDtoSchema>;
type Highlight = z.infer<typeof highlightSchema>;

export { createHighlightDtoSchema, highlightSchema, highlightsSchema, CreateHighlightDto, Highlight };