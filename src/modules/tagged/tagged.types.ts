import { z } from "zod";

// First, we define the zod schemas
// The Tagged DTO (Data Transferable Object),
//which will be the shape of the tagged object when it is passed to our database.
const createTaggedDtoSchema = z.object({
  post_id: z.number().int().transform(val => Math.floor(val)),
  tagged_user_id: z.number().int().transform(val => Math.floor(val)),
  tagger_user_id: z.number().int().transform(val => Math.floor(val)),
});

// The Tagged object, which will be the shape of the tagged object when it is fetched from our database,
// where it will include an id and an SQL time-stamp.
const taggedSchema = z.object({
  id: z.number().int(),
  post_id: z.number().int(),
  tagged_user_id: z.number().int(),
  tagger_user_id: z.number().int(),
  created_at: z.string(),
});

// This will be useful for validating the response from the `GET /tagged` endpoint.
const taggedPostsSchema = z.array(taggedSchema);

// Then, we infer the TypeScript types directly from our Zod schemas.
// This avoids duplicating type definitions and ensures our types always match our validation rules.
type CreateTaggedDto = z.infer<typeof createTaggedDtoSchema>;
type Tagged = z.infer<typeof taggedSchema>;

export { createTaggedDtoSchema, taggedSchema, taggedPostsSchema, CreateTaggedDto, Tagged };