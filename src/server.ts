import Fastify from "fastify";
import { databasePlugin } from "./core/database/database.plugin";
import { postsRoutes } from "./modules/posts/posts.routes";
import { reelsRoutes } from "./modules/reels/reels.routes";
import { taggedRoutes } from "./modules/tagged/tagged.routes";
import { highlightsRoutes } from "./modules/highlights/highlights.routes";

import multipart from "@fastify/multipart";
import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";

import fastifyStatic from "@fastify/static";

// creates a new Fastify instance
const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyStatic, {
  root: path.join(process.cwd(), "public", "uploads"),
  prefix: "/uploads/",
});

// Register multipart plugin
fastify.register(multipart);



// registers the databasePlugin, which connects to the SQLite database
// and sets up the tables and transactions helpers.
fastify.register(databasePlugin);

// Register routes, making the endpoints for those modules available
// Register posts routes
fastify.register(postsRoutes);

// Register reels routes
fastify.register(reelsRoutes);

// Register tagged routes
fastify.register(taggedRoutes);

// Register highlights routes
fastify.register(highlightsRoutes);


// Declare a default route to confirm the server is running.
fastify.get("/", function (request, reply) {
  reply.send({ hello: "world" });
});



// Remote and Local Port binding
// process.env.PORT => accesses the PORT environment variable that
// the hosting service automatically provides to the application
const port = Number(process.env.PORT) || 3000; // fallback 3000
const host = '0.0.0.0';

// Number(port): Environment variables are always returned as strings.
// It's good practice to convert the port value to a number to ensure the listen function works as expected.
fastify.listen({ port, host }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});