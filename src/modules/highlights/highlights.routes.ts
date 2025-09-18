import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { highlightsService } from "./highlights.service";
import { CreateHighlightDto } from "./highlights.types";

// The route defines the API endpoint
const highlightsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const service = highlightsService(fastify);

  fastify.post<{ Body: CreateHighlightDto }>("/highlights", async (request, reply) => {
    const newHighlight = await service.create(request.body);

    // Return a 201 Created status code with the new highlight object
    return reply.code(201).send(newHighlight);
  });

  // GET route to fetch all highlights
  fastify.get("/highlights", async (request, reply) => {
    const highlights = await service.getAll();
    return highlights; // Fastify automatically handles serialization to JSON
  });
};

export { highlightsRoutes };