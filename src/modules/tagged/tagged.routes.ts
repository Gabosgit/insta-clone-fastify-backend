import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { taggedService } from "./tagged.service";
import { CreateTaggedDto } from "./tagged.types";

// The route defines the API endpoint
const taggedRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const service = taggedService(fastify);

  fastify.post<{ Body: CreateTaggedDto }>("/tagged", async (request, reply) => {
    const newTagged = await service.create(request.body);

    // Return a 201 Created status code with the new tagged object
    return reply.code(201).send(newTagged);
  });

  // GET route to fetch all tagged
  fastify.get("/tagged", async (request, reply) => {
    const tagged = await service.getAll();
    return tagged; // Fastify automatically handles serialization to JSON
  });
};

export { taggedRoutes };