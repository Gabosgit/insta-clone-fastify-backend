import type { FastifyInstance } from "fastify";
import { CreateTaggedDto } from "./tagged.types";

// Business logic
const taggedService = (fastify: FastifyInstance) => {
  return {
    create: async (taggedData: CreateTaggedDto) => {
      fastify.log.info(`Creating a new tagged post`);
      // This will use the MOCK `transactions` in our test,
      // and the REAL `transactions` in our live application.
      try {
        // Use `await` to wait for the database operation to complete
        const tagged = await fastify.transactions.tagged.create(taggedData);
        return tagged;
      } catch (error) {
        fastify.log.error(`Error creating tagged post: ${error}`);
        throw error;
      }
    },

    // getAll method
    getAll: async () => {
        fastify.log.info("Fetching all tagged");
        const allTagged = await fastify.transactions.tagged.getAll();
        return allTagged;
    },

  };
};

export { taggedService };