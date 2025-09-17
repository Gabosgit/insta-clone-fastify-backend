import type { Database } from "better-sqlite3";
import { CreatePostDto } from "src/modules/posts/posts.types";
import { CreateReelDto } from "src/modules/reels/reels.types";
import { CreateTaggedDto } from "src/modules/tagged/tagged.types";

// This factory function creates and returns our transaction helpers.
const createTransactionHelpers = (db: Database) => {
  // We use prepared statements for security and performance.
  // Post statements
  const statements = {
    getPostById: db.prepare("SELECT * FROM posts WHERE id = ?"),
    getAllPosts: db.prepare("SELECT * FROM posts"),
    createPost: db.prepare(
      "INSERT INTO posts (img_url, caption) VALUES (@img_url, @caption) RETURNING *",
    ),

    // Reel statements
    getReelById: db.prepare("SELECT * FROM reels WHERE id = ?"),
    getAllReels: db.prepare("SELECT * FROM reels"),
    createReel: db.prepare(
      "INSERT INTO reels (video_url, thumbnail_url, caption) VALUES (@video_url, @thumbnail_url, @caption) RETURNING *",
    ),

    // Tagged statements
    getTaggedById: db.prepare("SELECT * FROM tagged WHERE id = ?"),
    getAllTagged: db.prepare("SELECT * FROM tagged"),
    createTagged: db.prepare(
      "INSERT INTO tagged (post_id, tagged_user_id, tagger_user_id) VALUES (@post_id, @tagged_user_id, @tagger_user_id) RETURNING *",
    ),
  };

  // New posts helper object
  const posts = {
    getById: (id: number) => {
      return statements.getPostById.get(id);
    },
    getAll: () => {
      return statements.getAllPosts.all();
    },
    create: (data: CreatePostDto) => {
      return statements.createPost.get(data);
    },
  };

  // New reels helper object
  const reels = {
    getById: (id: number) => {
      return statements.getReelById.get(id);
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
    create: (data: CreateTaggedDto) => {
      return statements.createTagged.get(data);
    },
  };

  return {
    posts,
    reels,
    tagged,
  };
};

export type TransactionHelpers = ReturnType<typeof createTransactionHelpers>;
export { createTransactionHelpers };