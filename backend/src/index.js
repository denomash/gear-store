import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import createServer from "./createServer";
import db from "./db";

dotenv.config();

const server = createServer();

server.express.use(cookieParser());

// Decode the JWT so we can get the user id on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);

    // put the userId onto the request for future request to access
    req.userId = userId;
  }

  next();
});

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
