import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";

export const fileStorageService = {
    // Recieves the file buffer
    // Creates a unique filename
    // Storage the file in a url
    // Returns the saved file url
  async saveImage(
    fileBuffer: Buffer,
    originalFilename: string,
  ): Promise<string> {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true }); // Ensure directory exists

    const fileExtension = path.extname(originalFilename);
    const uniqueFilename = `${randomUUID()}${fileExtension}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    await fs.writeFile(filePath, fileBuffer);

    // Return the public URL path
    //return `/uploads/${uniqueFilename}`;

    const API_URL = process.env.WEB_SERVICE_URL || `http://localhost:3000`;
    return `${API_URL}/uploads/${uniqueFilename}`;
  },
};