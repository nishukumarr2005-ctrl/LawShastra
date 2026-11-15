import { env } from "cloudflare:workers";
import { httpServerHandler } from "cloudflare:node";
import http from "node:http";
import app from "./app.js";
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaD1 } from "@prisma/adapter-d1";
import { setPrisma } from "./config/database.js";

const adapter = new PrismaD1(env.DB);
const prisma = new PrismaClient({ adapter });

// Inject D1-backed Prisma client for request handlers/services
setPrisma(prisma);

const server = http.createServer(app);
server.listen(3000);

export default httpServerHandler({ port: 3000 });
