import { eq } from "drizzle-orm";
import Pg from "pg";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: any = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = new Pg.Pool({
        connectionString: process.env.DATABASE_URL,
      });
      _db = {
        pool,
        execute: async (sql: string, params?: any[]) => {
          const client = await pool.connect();
          try {
            const result = await client.query(sql, params);
            return result;
          } finally {
            client.release();
          }
        },
      };
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };

    if (user.name !== undefined) values.name = user.name;
    if (user.email !== undefined) values.email = user.email;
    if (user.loginMethod !== undefined) values.loginMethod = user.loginMethod;

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    const { rows } = await db.execute(
      `INSERT INTO users (openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn) 
       VALUES ($1, $2, $3, $4, $5, DEFAULT, DEFAULT, $6)
       ON CONFLICT (openId) DO UPDATE SET
         name = EXCLUDED.name,
         email = EXCLUDED.email,
         loginMethod = EXCLUDED.loginMethod,
         role = EXCLUDED.role,
         lastSignedIn = EXCLUDED.lastSignedIn,
         updatedAt = DEFAULT
       RETURNING *`,
      [values.openId, values.name, values.email, values.loginMethod, values.role, values.lastSignedIn]
    );

    console.log("[Database] User upserted:", rows[0]?.id);
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  try {
    const { rows } = await db.execute(
      "SELECT * FROM users WHERE openId = $1 LIMIT 1",
      [openId]
    );
    return rows.length > 0 ? rows[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get user:", error);
    throw error;
  }
}

// TODO: add feature queries here as your schema grows.