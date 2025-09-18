import Fastify from "fastify";
import { databasePlugin } from "./core/database/database.plugin";
import { postsRoutes } from "./modules/posts/posts.routes";
import { reelsRoutes } from "./modules/reels/reels.routes";
import { taggedRoutes } from "./modules/tagged/tagged.routes";
import { highlightsRoutes } from "./modules/highlights/highlights.routes";

// creates a new Fastify instance
const fastify = Fastify({
  logger: true,
});

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



const port = 3000;
// Starts the Server: It listens on port 3000.
fastify.listen({ port }, function (err, address) {
    // includes error handling
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});