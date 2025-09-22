import type { FastifyInstance, FastifyPluginAsync } from "fastify";
import { uploadService } from "./upload.service";
import { z } from "zod"; // Import Zod for validation

//import { CreatePostDto } from "./posts.types";

// Define a Zod schema for the expected form fields
const createUploadSchema = z.object({
  caption: z.string().min(1, "Caption cannot be empty.").optional(),
  // The image will be handled as a file stream/buffer, not directly in the JSON body.
  // So, we don't define it here for Zod's parsing of the JSON body,
  // but rather access it from the multipart request.
});

// The route defines the API endpoint
const uploadRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const service = uploadService(fastify);

  fastify.post("/upload", async (request, reply) => {
    // Ensure the request is multipart
    // Multipart is the key technology that allows this code
    // to handle both a text caption and an image file in the same API call.
    if (!request.isMultipart()) {
      reply.code(415).send({ message: "Request must be multipart" });
      return;
    }
    // request.parts(): This method from the Fastify framework is used to get an
    // asynchronous iterator over the different parts of the multipart request.
    const parts = request.parts(); // Get the multipart parts

    let caption: string | undefined;
    let fileData: { buffer: Buffer; filename: string } | undefined;

    // Iterates through each part of the request.
    for await (const part of parts) {
      if (part.type === "field") { // it's a regular text field
        if (part.fieldname === "caption") {
          caption = part.value as string;
        }
      } else if (part.type === "file") { // it's a file
        // Read the file stream into a buffer
        // Buffer is a temporary storage location in memory for binary data
        const buffers: Buffer[] = []; // buffers => array that collects all the small chunks from the file stream.
        for await (const chunk of part.file) { // to read the file's content chunk by chunk.
          buffers.push(chunk);
        }
        fileData = {
          // Buffer.concat(buffers) => join all chunks together into a single, complete buffer that represents the entire file's content.
          buffer: Buffer.concat(buffers), // This final buffer is what the application will then use to process the image.
          filename: part.filename,
        };
      }
    }

    // Basic validation (can be enhanced with Zod for fields if not using streams)
    if (!fileData && !caption) {
      return reply
        .code(400)
        .send({ message: "Either file or caption is required." });
    }

    try {
      // We can still validate the caption if it exists
      if (caption) {
        createUploadSchema.pick({ caption: true }).parse({ caption });
      }

      const newUpload = await service.create({
        caption: caption || "", // Pass empty string if no caption, or adjust logic
        fileData: fileData,
      });

      return reply.code(201).send(newUpload);

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply
          .code(400)
          .send({ message: "Validation failed", errors: error.errors });
      }
      fastify.log.error(error);
      return reply.code(500).send({ message: "Failed to upload." });
    }
  });
};

export { uploadRoutes };