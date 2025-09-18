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

  // GET route to fetch a highlight by its ID
    fastify.get("/highlights/:id", async (request, reply) => {
      // Use a type assertion to specify the shape of the request parameters
      const { id } = request.params as { id: string };

      // Call the service method, passing the parsed ID
      const highlight = await service.getById(parseInt(id, 10));

      if (!highlight) {
        // If the post isn't found, return a 404 Not Found error
        reply.code(404).send({ error: "Highlight not found" });
      }

      // Return the post; Fastify handles the JSON serialization
      return highlight;
    });
};

export { highlightsRoutes };