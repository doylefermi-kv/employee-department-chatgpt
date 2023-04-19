# Employee - Department app based on Typescript Express

This is a boilerplate code for a TypeScript Express application with JWT authentication, TypeORM, and PostgreSQL.

## Getting Started

To get started, please follow the instructions below:

1. Clone this repository to your local machine.
2. Run `npm install` to install all the dependencies.
3. Create a `.env` file in the root directory and add the necessary environment variables (see `.env.example` for reference).
   You can copy the example env to create .env by using the command `cp .env.example .env`
4. Run `npm run build` to compile the TypeScript code.
5. Spin up the docker via `sudo docker-compose up` command.
6. Run `npm run migration:run` to run the database migrations.
7. Run `npm run start` or `npm run dev` to start the server.
8. Use your favorite API client (e.g., Postman, Insomnia) to make requests to the API.

## Scripts

This boilerplate code comes with several scripts that you can use:

- `npm run start`: Starts the server by running the compiled JavaScript code.
- `npm run dev`: Starts the server in development mode with `nodemon`.
- `npm run build`: Compiles the TypeScript code to JavaScript.
- `npm run typeorm`: Runs the TypeORM CLI.
- `npm run migration:generate`: Generates a new migration.
- `npm run migration:run`: Runs the database migrations.
- `npm run migration:revert`: Reverts the last migration.

## Dependencies

This boilerplate code uses the following dependencies:

- `bcrypt`: Library for hashing and salting passwords.
- `class-transformer`: Library for transforming plain object to class object and vice versa.
- `class-validator`: Library for validating class objects.
- `dotenv`: Loads environment variables from a `.env` file.
- `express`: Web framework for Node.js.
- `jsonwebtoken`: Library for generating and verifying JSON Web Tokens.
- `lodash`: Library for utility functions.
- `pg`: PostgreSQL client for Node.js.
- `reflect-metadata`: Library for adding metadata to classes.
- `typeorm`: Object-Relational Mapping library for TypeScript and JavaScript.

## Dev Dependencies

This boilerplate code uses the following dev dependencies:

- `@types/bcrypt`: Type definitions for `bcrypt`.
- `@types/express`: Type definitions for `express`.
- `@types/jsonwebtoken`: Type definitions for `jsonwebtoken`.
- `@types/lodash`: Type definitions for `lodash`.
- `@types/node`: Type definitions for `node`.
- `@types/pg`: Type definitions for `pg`.
- `@types/winston`: Type definitions for `winston`.
- `nodemon`: Utility that automatically restarts the server on file changes.
- `ts-node`: TypeScript execution environment and REPL for Node.js.
- `typescript`: Language for application-scale JavaScript.
- `winston`: Logging library.
