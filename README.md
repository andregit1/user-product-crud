## User Product CRUD Application

This project is a full-stack CRUD application with separate backend and frontend implementations. It features user and product management with authentication and authorization using JWT.

---

### Tech Stack

#### Backend
- **Language:** Go (Golang)
- **Database:** MongoDB (hosted on MongoDB Atlas)
- **GraphQL:** `gqlgen` for schema-based GraphQL API generation
- **Authentication:** JSON Web Token (JWT)

#### Frontend
- **Framework:** React.js (using create-vite, version 18.3.1)
- **State Management:** Redux Toolkit
- **GraphQL Client:** Apollo Client
- **Styling:** Tailwind CSS

---

### Environment Variables

The project uses the following `.env` variables. Ensure these are correctly configured before running the application.

```env
JWT_SECRET=your_jwt_secret
MONGO_USERNAME=your_mongo_username
MONGO_PASSWORD=your_mongo_password
MONGO_URI=your_mongo_connection_uri
MONGO_DB_NAME=your_database_name
```

---

### Getting Started

#### Prerequisites
- **Node.js**: Install [Node.js](https://nodejs.org/) (LTS recommended, this project using **v22.13.0** and **npm 10.9.2**).
- **Go:** Install [Go](https://go.dev/) (version 1.23.4 or later).
- **MongoDB Atlas Account**: Ensure you have a MongoDB Atlas cluster set up.

---

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies (if needed):**
   ```bash
   go mod tidy
   ```

3. **Run the server:**
   ```bash
   go run server.go
   ```

4. **Run the server with data seeding:**
   ```bash
   go run server.go -seed
   ```

#### Backend Schema Workflow
- **Initialize `gqlgen` schema:**
  ```bash
  go run github.com/99designs/gqlgen init
  ```

- **Modify `schema.graphqls` for new features.**

- **Regenerate `gqlgen` files:**
  ```bash
  go run github.com/99designs/gqlgen generate
  ```

- **Update `schema.resolvers.go` for resolvers and repeat the generation process if further schema changes are needed.**

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

---

### Features

1. **User Management:**
   - Create, update, delete, and fetch user details.

2. **Product Management:**
   - Add, update, delete, and fetch product details.

3. **Authentication:**
   - Secure login with JWT tokens.

4. **Future Enhancements:**
   - JWT blacklisting.
   - Refresh tokens for extended sessions.
   - Role-based user management (e.g., admin, user).

---

### Backend Testing with Postman

1. **Import Postman Files:**
   - Import `postman/local-andre-graphql.postman_environment.json` for environment variables
   - Import `postman/user-product-graphql.postman_collection.json` for API endpoints collection

2. **Set Up Environment:**
   - Open Postman and select the imported environment "local-andre-graphql"
   - Verify the environment variables are correctly set

3. **Available Test Endpoints:**
   The collection includes GraphQL queries and mutations for:
   - User Management (Create, Read, Update, Delete)
   - Product Management (Create, Read, Update, Delete)
   - Authentication (Login, Token Validation)

4. **Testing Flow:**
   1. Start with the Login mutation to obtain a JWT token
   2. The token will be automatically set in the environment variables
   3. Other requests will use this token for authentication
   4. Test each endpoint in the collection to verify functionality

---

### Notes for Developers

#### MongoDB Atlas
Ensure your `MONGO_URI` is formatted correctly. Example:
```
mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
```

#### GQLGen
- Always keep the `schema.graphqls` updated for new API features.
- Use the generation commands to ensure the resolvers and types are synced with the schema.

---

### Run Both Backend and Frontend Concurrently
1. Navigate to the project root directory:
   ```bash
   cd user-product-crud
   ```
2. Install dependencies for concurrent execution:
   ```bash
   npm install
   ```
3. Run both backend and frontend:
   ```bash
   npm run dev
   ```
---
