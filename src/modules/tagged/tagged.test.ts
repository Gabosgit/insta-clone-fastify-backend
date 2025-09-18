import Fastify from "fastify";
import { taggedRoutes } from "./tagged.routes";

describe("POST /tagged", () => {
  it("should create a new tagged post and return it with a 201 status code", async () => {
    const app = Fastify();

    const newTaggedPayload = {
      post_id: 1,
      tagged_user_id: 2,
      tagger_user_id: 3,
    };

    // Fixed date for mocking
    const mockDate = new Date("2025-09-17T12:00:00Z");

    const createdTagged = {
        ...newTaggedPayload,
        id: 1,
        created_at: mockDate.toISOString() // Convert the date to an ISO string to match the JSON output
    };

    app.decorate("transactions", {
      tagged: {
        getById: jest.fn(),
        getAll: jest.fn(),
        create: jest.fn().mockReturnValue(createdTagged),
        getAllWithPostDetails: jest.fn(),
      },
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
      highlights: {
        getById: jest.fn(),
        getAll: jest.fn(),
        create: jest.fn(),
      },
    });

    app.register(taggedRoutes);

    const response = await app.inject({
      method: "POST",
      url: "/tagged",
      payload: newTaggedPayload,
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.payload)).toEqual(createdTagged);
    // Assertion to check if the mocked function was called correctly
    expect(app.transactions.tagged.create).toHaveBeenCalledWith(newTaggedPayload);
  });
});