import { z } from "zod";

// First, we define the zod schemas
// The Reel DTO (Data Transferable Object),
//which will be the shape of the reel object when it is passed to our database.
const createReelDtoSchema = z.object({
  video_url: z.string().url(),
  thumbnail_url: z.string().url(),
  caption: z.string().nullable().optional(), // Caption can be a string, null, or undefined
});

// The Reel object, which will be the shape of the reel object when it is fetched from our database,
// where it will include an id and an SQL time-stamp.
const reelSchema = z.object({
  id: z.number(),
  video_url: z.string().url(),
  thumbnail_url: z.string().url(),
  caption: z.string().nullable(),
  views: z.number(),
  created_at: z.string(), // SQLite returns DATETIME as a string by default
});

// This will be useful for validating the response from the `GET /reels` endpoint.
const reelsSchema = z.array(reelSchema);

// Then, we infer the TypeScript types directly from our Zod schemas.
// This avoids duplicating type definitions and ensures our types always match our validation rules.
type CreateReelDto = z.infer<typeof createReelDtoSchema>;
type Reel = z.infer<typeof reelSchema>;

export { createReelDtoSchema, reelSchema, reelsSchema, CreateReelDto, Reel };