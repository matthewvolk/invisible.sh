import { createClient } from "@libsql/client";

import { env } from "@/lib/env.mjs";

const config = {
  url: env.DATABASE_URL,
  authToken: env.TURSO_DB_TOKEN,
};

export type Secret = {
  uuid: string;
  secret: string;
};

export type Counter = {
  name: "generated";
  count: number;
};

export const sqlite = createClient(config);
