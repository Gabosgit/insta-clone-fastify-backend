import type { FastifyInstance } from "fastify";
import { CreatePostDto } from "./posts.types";
import { fileUploadStorageService } from "../../common/file-upload-storage.service";

type CreatePostData = {
  file_url: string; // This will now come from our storage service
  caption: string;
};

type CreateUploadServiceArgs = {
  caption: string;
  imageFile?: { buffer: Buffer; filename: string }; // New optional image file
};

// Business logic
const uploadService = (fastify: FastifyInstance) => {
  return {
    // File upload image
    create: async (data: CreateUploadServiceArgs) => {
      fastify.log.info(`Upload a new file`);

      let file_url = data.caption; // Fallback if no file, or placeholder

      if (data.fileData) {
        // If an file is provided, save it and get the URL
        file_url = await fileStorageService.saveFile(
          data.fileData.buffer,
          data.fileData.filename,
        );
      }

      const post = fastify.transactions.posts.create({
        file_url,
        caption: data.caption,
      });

      return post;
    },
  };
};

export { postsService };