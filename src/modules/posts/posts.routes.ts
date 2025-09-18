import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { postsService } from "./posts.service";
import { CreatePostDto } from "./posts.types";

// The route defines the API endpoint
const postsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const service = postsService(fastify);

  fastify.post<{ Body: CreatePostDto }>("/posts", async (request, reply) => {
    const newPost = await service.create(request.body);

    // Return a 201 Created status code with the new post object
    return reply.code(201).send(newPost);
  });

  // GET route to fetch all posts
  fastify.get("/posts", async (request, reply) => {
    const posts = await service.getAll();
    return posts; // Fastify automatically handles serialization to JSON
  });

  // GET route to fetch a post by its ID
    fastify.get("/posts/:id", async (request, reply) => {
      // Use a type assertion to specify the shape of the request parameters
      const { id } = request.params as { id: string };

      // Call the service method, passing the parsed ID
      const post = await service.getById(parseInt(id, 10));

      if (!post) {
        // If the post isn't found, return a 404 Not Found error
        reply.code(404).send({ error: "Post not found" });
      }

      // Return the post; Fastify handles the JSON serialization
      return post;
    });
};

export { postsRoutes };