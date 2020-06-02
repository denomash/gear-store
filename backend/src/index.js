import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import createServer from "./createServer";
import db from "./db";

dotenv.config();

const server = createServer();

server.express.use(cookieParser());
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
