// This file connects to the remote prisma DB
// and gives us the ability to query it with JS
import { Prisma } from "prisma-binding";
import dotenv from "dotenv";

dotenv.config({path: "variables.env"})

const db = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: false,
});

export default db;
