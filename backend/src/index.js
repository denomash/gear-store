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

// Create a middleware to populate current user on each request
server.express.use(async (req, res, next) => {
  // if they are not logged in, skip
  if (!req.userId) return next();

  const user = await db.query.user(
    { where: { id: req.userId } },
    "{ id name permissions email }"
  );

  req.user = user;

  next();
});

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
