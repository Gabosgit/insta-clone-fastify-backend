import type { FastifyInstance } from "fastify";
import { CreatePostDto } from "./posts.types";
import { fileStorageService } from "../../common/file-storage.service"; // Import the new service

type CreatePostData = {
  img_url: string; // This will now come from our storage service
  caption: string;
};

type CreatePostServiceArgs = {
  caption: string;
  imageFile?: { buffer: Buffer; filename: string }; // New optional image file
};

// Business logic
const postsService = (fastify: FastifyInstance) => {
  return {
    create: async (data: CreatePostServiceArgs) => {
      fastify.log.info(`Creating a new post`);

      let img_url = data.caption; // Fallback if no image, or placeholder

      if (data.imageFile) {
        // If an image is provided, save it and get the URL
        img_url = await fileStorageService.saveImage(
          data.imageFile.buffer,
          data.imageFile.filename,
        );
      }

      const post = fastify.transactions.posts.create({
        img_url,
        caption: data.caption,
      });

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

    // delete method accepts an ID as an argument
    delete: async (id: number) => {
        fastify.log.info(`Attempting to delete post with ID: ${id}`);
        // Call the data transaction layer to delete the post
        const deletedPost = await fastify.transactions.posts.delete(id);
        return deletedPost;
    },

  };
};

export { postsService };