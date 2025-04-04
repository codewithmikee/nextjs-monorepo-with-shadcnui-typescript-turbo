import { eq } from 'drizzle-orm';
import { db, pool } from './db';
import { users } from './schema/schema';
import { InsertUser, User } from '../shared/schema';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

const PostgresSessionStore = connectPgSimple(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: any; // Using any for now to avoid TypeScript errors
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0] as User | undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values({
      username: user.username,
      password: user.password,
      email: user.email,
      displayName: user.displayName
    }).returning();

    return result[0] as User;
  }
}

// Create and export an instance of the storage
export const storage = new DatabaseStorage();