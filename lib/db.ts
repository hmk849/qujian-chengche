import { Pool } from "pg";
const g = globalThis as unknown as { pool?: Pool };
export const pool = g.pool ?? (g.pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSL === "off" ? false : { rejectUnauthorized: false } }));
