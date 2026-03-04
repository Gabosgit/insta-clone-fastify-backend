
# Instagram Clone Fastify Backend

## Overview

This project is a backend API for an Instagram-like social media application, built with [Fastify](https://www.fastify.io/) and TypeScript. It provides RESTful endpoints for core features such as posts, reels, highlights, and tagged content, supporting user-generated media uploads and retrieval. The backend is designed for scalability, maintainability, and ease of integration with a frontend client.

## Features

- **Posts:**  
	- Create, retrieve, and delete posts with image uploads.
	- Type-safe DTOs and schema validation for robust data handling.

- **Reels:**  
	- Submit and fetch short video content (reels).
	- Zod schema validation for input data.
	- Grid and individual reel retrieval endpoints.

- **Highlights:**  
	- Manage story highlights for user profiles.
	- CRUD operations for highlights.

- **Tagged Content:**  
	- Tag users in posts and reels.
	- Retrieve tagged content and details.

- **File Storage:**  
	- Centralized file storage service for handling media uploads.

- **Database Integration:**  
	- Modular database plugin for transaction management.
	- SQLite (or other DB) support via transaction layer.

- **Testing:**  
	- Jest-based unit and integration tests for all modules.
	- Mocked transaction layer for isolated testing.

- **TypeScript:**  
	- Strong typing across all modules for reliability and maintainability.

## Project Structure

```
src/
	server.ts
	common/
		file-storage.service.ts
	core/
		database/
			database.plugin.ts
			database.transactions.ts
	modules/
		posts/
			posts.routes.ts
			posts.service.ts
			posts.test.ts
			posts.types.ts
		reels/
			reels.routes.ts
			reels.service.ts
			reels.test.ts
			reels.types.ts
		highlights/
			highlights.routes.ts
			highlights.service.ts
			highlights.test.ts
			highlights.types.ts
		tagged/
			tagged.routes.ts
			tagged.service.ts
			tagged.test.ts
			tagged.types.ts
public/
	uploads/
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- SQLite (default, or configure another database)

### Installation
1. Clone the repository:
	 ```
	 git clone https://github.com/<your-username>/insta-clone-fastify-backend.git
	 cd insta-clone-fastify-backend
	 ```

2. Install dependencies:
	 ```
	 npm install
	 ```

3. Configure environment variables:
	 - Copy `.env.example` to `.env` and update values as needed (database path, port, etc.)
	 - Example variables:
		 ```
		 PORT=3000
		 DATABASE_URL=./db.sqlite
		 UPLOADS_DIR=public/uploads
		 ```

4. Run database migrations (if applicable):
	 ```
	 npm run migrate
	 ```

5. Start the development server:
	 ```
	 npm run dev
	 ```

6. Run tests:
	 ```
	 npm test
	 ```

### Environment Details
- **Node.js:** Used for running the Fastify server and scripts.
- **Fastify:** High-performance web framework for API endpoints.
- **TypeScript:** Provides static typing and code safety.
- **SQLite:** Default database for local development. Can be swapped for PostgreSQL/MySQL by updating config and transaction layer.
- **Jest:** Testing framework for unit and integration tests.
- **File Storage:** Media uploads are stored in `public/uploads` by default.

### API Documentation
The API exposes endpoints for posts, reels, highlights, and tagged content. See the route files in `src/modules/` for details.
