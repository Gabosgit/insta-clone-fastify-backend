import type { FastifyInstance } from "fastify";
import { CreatePostDto } from "./posts.types";

// Business logic
const postsService = (fastify: FastifyInstance) => {
  return {
    create: async (postData: CreatePostDto) => {
      fastify.log.info(`Creating a new post`);
      // This will use the MOCK `transactions` in our test,
      // and the REAL `transactions` in our live application.
      const post = fastify.transactions.posts.create(postData);
      return post;
    },

    // getAll method
    getAll: async () => {
        fastify.log.info("Fetching all posts");
        const allPosts = await fastify.transactions.posts.getAll(); // <-- Add 'await' here
        return allPosts;
    },

    // getById method accept an ID as an argument
    getById: async (id: number) => {
        fastify.log.info(`Fetching post with ID: ${id}`);
        // Pass the received ID to the data transaction layer
        const post = await fastify.transactions.posts.getById(id);
        return post;
    },

  };
};

export { postsService };