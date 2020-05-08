import dotenv from "dotenv";

import createServer from "./createServer";
import db from "./db";

dotenv.config({ path: "../variables.env" });

const server = createServer();

// TODO use express middleware to handle cookies (JWT)
// TODO use express middleware to populate current user

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  (deets) => {
    console.log(`server is now running on port http:/localhost:${deets.port}`);
  }
);
