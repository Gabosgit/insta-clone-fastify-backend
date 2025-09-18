import Fastify from "fastify";
import { highlightsRoutes } from "./highlights.routes";

describe("POST /highlights", () => {
  it("should create a new highlight and return it with a 201 status code", async () => {
    const app = Fastify();

    const newHighlightPayload = {
      user_id: 1,
      title: "highlight title from our test!",
      cover_image_url: "http://example.com/new-image.jpg",
    };

    // Fixed date for mocking
    const mockDate = new Date("2025-09-17T12:00:00Z");

    const createdHighlight = {
        ...newHighlightPayload,
        id: 1,
        created_at: mockDate.toISOString() // Convert the date to an ISO string to match the JSON output
    };

    app.decorate("transactions", {
      posts: {
        getById: jest.fn(),
        getAll: jest.fn(),
        create: jest.fn(),
      },
      reels: {
        getById: jest.fn(),
        getAll: jest.fn(),
        create: jest.fn(),
      },
      tagged: {
        getById: jest.fn(),
        getAll: jest.fn(),
        create: jest.fn(),
      },
      highlights: {
        getById: jest.fn(),
        getAll: jest.fn(),
        create: jest.fn().mockReturnValue(createdHighlight),
      },
    });

    app.register(highlightsRoutes);

    const response = await app.inject({
      method: "POST",
      url: "/highlights",
      payload: newHighlightPayload,
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.payload)).toEqual(createdHighlight);
  });
});