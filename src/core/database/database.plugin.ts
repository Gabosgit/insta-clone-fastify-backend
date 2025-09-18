import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import Database from "better-sqlite3";
import {
  createTransactionHelpers,
  type TransactionHelpers,
} from "./database.transactions";

declare module "fastify" {
  interface FastifyInstance {
    db: Database.Database;
    transactions: TransactionHelpers;
  }
}

async function databasePluginHelper(fastify: FastifyInstance) {
  const db = new Database("./database.db");
  fastify.log.info("SQLite database connection established.");

  // Create a simple post table for testing if it doesn't exist
  // db.exec => executes a SQL query that doesn't return data (E.g: creating tables)
  // CREATE TABLE IF NOT EXISTS posts => is a core SQL command
  // IF NOT EXISTS => prevents an error, "idempotent", allows to run the code multiple times without issues.
  db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    img_url TEXT NOT NULL,
    caption TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  // Create a simple reel table for testing if it doesn't exist
  db.exec(`
  CREATE TABLE IF NOT EXISTS reels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    caption TEXT,
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  // Create a simple tagged table for testing if it doesn't exist
  db.exec(`
  CREATE TABLE IF NOT EXISTS tagged (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    tagged_user_id INTEGER NOT NULL,
    tagger_user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  // Create a simple highlights table for testing if it doesn't exist
  db.exec(`
  CREATE TABLE IF NOT EXISTS highlights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      cover_image_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
    // Trigger to automatically update the 'updated_at' field on every row modification
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_highlights_updated_at
    AFTER UPDATE ON highlights
    FOR EACH ROW
    BEGIN
      UPDATE highlights SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
  `);

  const transactions = createTransactionHelpers(db);

  fastify.decorate("db", db);
  fastify.decorate("transactions", transactions);

  fastify.addHook("onClose", (instance, done) => {
    instance.db.close();
    instance.log.info("SQLite database connection closed.");
    done();
  });
}

const databasePlugin = fp(databasePluginHelper);

export { databasePlugin };