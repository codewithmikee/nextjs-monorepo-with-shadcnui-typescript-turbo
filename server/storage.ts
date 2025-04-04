import { eq } from 'drizzle-orm';
import { db } from './db';
import { users } from './schema/schema';
import connectPg from 'connect-pg-simple';
import session from 'express-session';
import { pool } from './db';
import { User, InsertUser } from '../shared/schema';

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: session.SessionStore;
}

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const now = new Date();
    const result = await db.insert(users).values({
      ...user,
      createdAt: now,
      updatedAt: now,
    }).returning();
    
    return result[0];
  }
}

export const storage = new DatabaseStorage();