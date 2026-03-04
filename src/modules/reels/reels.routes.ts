import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { reelsService } from "./reels.service";
import { CreateReelDto } from "./reels.types";

// The route defines the API endpoint
const reelsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const service = reelsService(fastify);

  // Route to create a new reel
  fastify.post<{ Body: CreateReelDto }>("/reels", async (request, reply) => {
    const newReel = await service.create(request.body);

    // Return a 201 Created status code with the new reel object
    return reply.code(201).send(newReel);
  });

  // Route to get a list of all reels
  // Route to get a list of all reels, with the specific /reels/grid path
  fastify.get("/reels", async (request, reply) => {
    const allReels = await service.getAll();
    return reply.code(200).send(allReels);
  });

  // GET route to fetch a reel by its ID
  fastify.get("/reels/:id", async (request, reply) => {
    // Use a type assertion to specify the shape of the request parameters
    const { id } = request.params as { id: string };

    // Call the service method, passing the parsed ID
    const reel = await service.getById(parseInt(id, 10));

    if (!reel) {
      // If the reel isn't found, return a 404 Not Found error
      reply.code(404).send({ error: "Reel not found" });
    }

      // Return the reel; Fastify handles the JSON serialization
      return reel;
  });
};

export { reelsRoutes };