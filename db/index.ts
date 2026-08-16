import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

export const isDatabaseConfigured = Boolean(connectionString);

function createClient() {
  if (!connectionString) return null;
  return postgres(connectionString, {
    max: 4,
    prepare: false,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

const client = createClient();

export const db = client ? drizzle(client, { schema }) : null;
