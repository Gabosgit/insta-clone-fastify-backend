import { z } from "zod";

// First, we define the zod schemas
// The Tagged DTO (Data Transferable Object),
//which will be the shape of the post object when it is passed to our database.
const createTaggedDtoSchema = z.object({
  post_id: z.number(),
  tagged_user_id: z.number(),
  tagger_user_id: z.number(),
});

// The Post object, which will be the shape of the post object when it is fetched from our database,
// where it will include an id and an SQL time-stamp.
const postSchema = z.object({
  id: z.number(),
  post_id: z.number(),
  tagged_user_id: z.number(),
  tagger_user_id: z.number(),
  created_at: z.string(), // SQLite returns DATETIME as a string by default
});

// This will be useful for validating the response from the `GET /tagged` endpoint.
const taggedSchema = z.array(taggedSchema);

// Then, we infer the TypeScript types directly from our Zod schemas.
// This avoids duplicating type definitions and ensures our types always match our validation rules.
type CreateTaggedDto = z.infer<typeof createTaggedDtoSchema>;
type Tagged = z.infer<typeof taggedSchema>;

export { createTaggedDtoSchema, taggedSchema, taggedSchema, CreateTaggedDto, Tagged };