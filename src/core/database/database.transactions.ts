import type { Database } from "better-sqlite3";
import { CreatePostDto } from "src/modules/posts/posts.types";
import type { Post } from "src/modules/posts/posts.types";
import { CreateReelDto, Reel } from "src/modules/reels/reels.types";
import { CreateTaggedDto } from "src/modules/tagged/tagged.types";
import { CreateHighlightDto } from "src/modules/highlights/highlights.types";

// Repository layer responsible for:
    // Preparing SQL statements
    // Grouping DB logic by entity (posts, reels, etc.)
    // Returning helper functions
    // This is essentially your repository layer.

// This factory function creates and returns our transaction helpers.
const createTransactionHelpers = (db: Database) => {
  

  // statements: low-level database layer.
      // We use prepared query reuse statements for security and performance.
      // Statements is basically: A compiled SQL cache. Centralized SQL.
      // It creates prepared SQL statements once when the server starts. After that, .get() / .run() is fast.
  const statements = {
    // Post statements
    getPostById: db.prepare<[number], Post>( // return: Post | undefined
      "SELECT * FROM posts WHERE id = ?"
    ),
    getAllPosts: db.prepare("SELECT * FROM posts"),
    createPost: db.prepare(
      "INSERT INTO posts (img_url, caption) VALUES (@img_url, @caption) RETURNING *",
    ),
    deletePost: db.prepare("DELETE FROM posts WHERE id = ? RETURNING *"),

    // Reel statements
    getReelById: db.prepare<[number], Reel>(
      "SELECT * FROM reels WHERE id = ?"
    ),
    getAllReels: db.prepare("SELECT * FROM reels"),
    createReel: db.prepare(
      "INSERT INTO reels (video_url, thumbnail_url, caption) VALUES (@video_url, @thumbnail_url, @caption) RETURNING *",
    ),

    // Tagged statements
    getTaggedById: db.prepare("SELECT * FROM tagged WHERE id = ?"),
    getAllTagged: db.prepare("SELECT * FROM tagged"),
    // New prepared statement to get tagged posts with post details
    getAllTaggedWithPostDetails: db.prepare(
      // Cast the IDs to integers to ensure the correct type is returned
      "SELECT t.id, CAST(t.post_id AS INTEGER) as post_id, CAST(t.tagged_user_id AS INTEGER) as tagged_user_id, CAST(t.tagger_user_id AS INTEGER) as tagger_user_id, t.created_at, p.img_url, p.caption FROM tagged AS t LEFT JOIN posts AS p ON t.post_id = p.id",
    ),
    createTagged: db.prepare(
      "INSERT INTO tagged (post_id, tagged_user_id, tagger_user_id) VALUES (CAST(@post_id AS INTEGER), CAST(@tagged_user_id AS INTEGER), CAST(@tagger_user_id AS INTEGER)) RETURNING *",
    ),

    // Highlight statements
    getHighlightById: db.prepare("SELECT * FROM highlights WHERE id = ?"),
    getAllHighlights: db.prepare("SELECT * FROM highlights"),
    createHighlight: db.prepare(
      "INSERT INTO highlights (user_id, title, cover_image_url) VALUES (CAST(@user_id AS INTEGER), @title, @cover_image_url) RETURNING *",
    ),
  };


  //domain layer (repository layer)
      // It wraps raw SQL statements into meaningful operations.
      // Domain abstraction.
      
  // New posts helper object.
  const posts = {
    getById: (id: number): Post | null => {
      return statements.getPostById.get(id) ?? null;
    },
    getAll: () => {
      return statements.getAllPosts.all();
    },
    create: (data: CreatePostDto) => {
      return statements.createPost.get(data);
    },
    delete: (id: number) => {
      return statements.deletePost.run(id);
    },
  };

  // New reels helper object
  const reels = {
    getById: (id: number): Reel | null => {
      return statements.getReelById.get(id) ?? null;
    },
    getAll: () => {
      return statements.getAllReels.all();
    },
    create: (data: CreateReelDto) => {
      return statements.createReel.get(data);
    },
  };

  // New tagged helper object
  const tagged = {
    getById: (id: number) => {
      return statements.getTaggedById.get(id);
    },
    getAll: () => {
      return statements.getAllTagged.all();
    },
    getAllWithPostDetails: () => {
      return statements.getAllTaggedWithPostDetails.all();
    },
    create: (data: CreateTaggedDto) => {
      return statements.createTagged.get(data);
    },
  };
  // New highlights helper object
  const highlights = {
    getById: (id: number) => {
      return statements.getHighlightById.get(id);
    },
    getAll: () => {
      return statements.getAllHighlights.all();
    },
    create: (data: CreateHighlightDto) => {
      return statements.createHighlight.get(data);
    },
  };

  return {
    posts,
    reels,
    tagged,
    highlights,
  };
};

export type TransactionHelpers = ReturnType<typeof createTransactionHelpers>;
export { createTransactionHelpers };