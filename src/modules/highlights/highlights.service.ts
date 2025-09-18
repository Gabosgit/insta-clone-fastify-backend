import type { FastifyInstance } from "fastify";
import { CreateHighlightDto } from "./highlights.types";

// Business logic
const highlightsService = (fastify: FastifyInstance) => {
  return {
    create: async (highlightData: CreateHighlightDto) => {
      fastify.log.info(`Creating a new highlight`);
      // This will use the MOCK `transactions` in our test,
      // and the REAL `transactions` in our live application.
      const highlight = fastify.transactions.highlights.create(highlightData);
      return highlight;
    },

    // getAll method
    getAll: async () => {
        fastify.log.info("Fetching all highlights");
        const allHighlights = await fastify.transactions.highlights.getAll(); // <-- Add 'await' here
        return allHighlights;
    },

    // getById method accept an ID as an argument
    getById: async (id: number) => {
        fastify.log.info(`Fetching highlight with ID: ${id}`);
        // Pass the received ID to the data transaction layer
        const highlight = await fastify.transactions.highlights.getById(id);
        return highlight;
    },

  };
};

export { highlightsService };