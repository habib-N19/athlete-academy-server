# Sports Summer Camp Server-Side

This is the server-side code for a sports summer camp application. It provides API endpoints for managing users, classes, instructors, carts, and more. The server is built using Node.js and Express.js framework. It utilizes MongoDB as the database for storing data.

## Getting Started

To get started with the server-side code, follow the steps below:

1. Clone the repository: `git clone <repository-url>`
2. Install dependencies: `npm install`
3. Set up environment variables:
   - Create a `.env` file in the root directory of the project.
   - Define the following environment variables in the `.env` file:
     - `PORT`: The port number on which the server will run (default: 5000).
     - `DB_USER`: MongoDB Atlas username.
     - `DB_PASS`: MongoDB Atlas password.
     - `JWT_SECRET`: Secret key used for JWT token generation.
4. Start the server: `npm start`

## API Endpoints

The server provides the following API endpoints:

- `POST /jwt`: Generates a JSON Web Token (JWT) for user authentication.
- `GET /users`: Retrieves a list of all users.
- `POST /users`: Creates a new user.
- `GET /classes`: Retrieves a list of all classes.
- `POST /pending`: Adds a new class to the pending classes collection.
- `GET /pending`: Retrieves a list of all pending classes.
- `PATCH /users/admin/:id`: Updates a user's role to "admin".
- `GET /instructors`: Retrieves a list of all instructors.
- `PATCH /users/instructor/:id`: Updates a user's role to "instructor".
- `GET /carts`: Retrieves a user's cart items.
- `POST /carts`: Adds an item to a user's cart.
- `DELETE /carts/:id`: Removes an item from a user's cart.

## Middleware

The server uses the following middleware:

- `express.json()`: Parses incoming JSON requests.
- `cors()`: Handles Cross-Origin Resource Sharing (CORS) headers.
- `verifyJWT`: Middleware function to verify the authenticity of JSON Web Tokens.

## Dependencies

The server relies on the following dependencies:

- `cors`: Enables CORS support.
- `dotenv`: Loads environment variables from a `.env` file.
- `express`: Web application framework for Node.js.
- `jsonwebtoken`: Implements JSON Web Tokens for user authentication.
- `mongodb`: Official MongoDB driver for Node.js.

## Client-Side

For the corresponding client-side code, please visit the [Sports Summer Camp Client-Side Repository](https://github.com/your-username/client-side-repo).

