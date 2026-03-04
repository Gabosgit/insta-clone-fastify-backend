import type { FastifyInstance } from "fastify";
import { CreateReelDto, createReelDtoSchema, Reel } from "./reels.types";

// Business logic
const reelsService = (fastify: FastifyInstance) => {
  return {
    create: async (reelData: CreateReelDto) => {
      // Validate the data again using the Zod schema for robustness
      const validatedData = createReelDtoSchema.parse(reelData);
      fastify.log.info(`Creating a new reel`);
      // This will use the MOCK `transactions` in our test,
      // and the REAL `transactions` in our live application.
      const reel = fastify.transactions.reels.create(reelData);
      return reel;
    },

    // getAll method
    getAll: async () => {
        fastify.log.info("Fetching all reels");
        const allReels = await fastify.transactions.reels.getAll();
        return allReels;
    },

    // getById method accept an ID as an argument
    async getById(id: number): Promise<Reel | null> {
        fastify.log.info(`Fetching reel with ID: ${id}`);
        // Pass the received ID to the data transaction layer
        const reel = await fastify.transactions.reels.getById(id);
        return reel ?? null; // Return the reel or null if not found
    },

  };
};

export { reelsService };