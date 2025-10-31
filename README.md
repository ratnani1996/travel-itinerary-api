# Travel Itinerary API

A powerful and flexible **Node.js + Express** backend for managing travel itineraries.  
It supports user authentication, CRUD operations on itineraries, public shareable links, caching with Redis, and full API documentation via Swagger UI.

---

## 🧩 Requirements

For development and running this project locally, you’ll need:

- **Node.js (v18+)** — download from [nodejs.org](https://nodejs.org/en/download)  
- **MongoDB** — download community edition from [mongodb.com](https://www.mongodb.com/try/download/community)  
- **Redis** — download from [redis.io](https://redis.io/download)  
- **npm** (comes with Node.js)  

---

## 🚀 Installation

1. Clone this repository  
   git clone https://github.com/ratnani1996/travel-itinerary-api.git
   cd travel-itinerary-api
2. Install dependencies
    npm install
3. Create a .env file in the project root with the following contents:
    PORT=3000
    MONGODB_URL=
    DATABASE=
    JWT_SECRET=
    REDIS_URL=
4. Start the server
    node index.js
5. Open your browser and navigate to:
    http://localhost:3000/api-docs/
    → This will open the interactive Swagger UI with all your API endpoints.


## 🔧 Usage

Once your server is running and the Swagger UI is available at [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/), you can start interacting with the API.

### 🧑‍💻 Authentication Flow
1. **Register a new user**  
   Use the `/api/auth/register` endpoint to create a new account by providing your name, email, and password.

2. **Login to get a JWT token**  
   Call the `/api/auth/login` endpoint with valid credentials.  
   The response will include a `token` (JWT) which you must include in the header for protected routes: Authorization: Bearer <your_jwt_token>

3. **Access protected routes**  
All itinerary-related endpoints (`/api/itineraries`) require a valid JWT in the header.

---

### ✈️ Itinerary Management
Once authenticated, you can manage your itineraries using the following routes:

- **Create an itinerary** → `POST /api/itineraries`  
Provide `title`, `destination`, `startDate`, `endDate`, and optional `activities`.

- **List all itineraries** → `GET /api/itineraries`  
Returns all itineraries created by the logged-in user.  
Supports filtering (by destination), pagination, and sorting using query parameters: /api/itineraries?destination=Paris&page=1&limit=5&sort=startDate

- **View an itinerary** → `GET /api/itineraries/:id`  
Retrieve a single itinerary by its ID. Cached in Redis for faster access.

- **Update an itinerary** → `PUT /api/itineraries/:id`  
Modify existing itinerary details.

- **Delete an itinerary** → `DELETE /api/itineraries/:id`  
Permanently remove an itinerary.

---

### 🌍 Public Sharing
Every itinerary automatically includes a **unique shareable link** that can be accessed without authentication.

- **Public itinerary view** → `GET /api/itineraries/share/:shareableId`  
Opens the itinerary in read-only mode, excluding sensitive information (like `userId`).

Example: http://localhost:3000/api/itineraries/share/ab12cd34

---

### ⚡ Additional Features
- **Redis caching** is automatically used for faster itinerary retrieval.  
- **Pagination & Sorting** allow efficient browsing through itineraries.  
- **Swagger UI** provides interactive documentation to test all endpoints easily.  

To explore all APIs, visit:  
👉 [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)