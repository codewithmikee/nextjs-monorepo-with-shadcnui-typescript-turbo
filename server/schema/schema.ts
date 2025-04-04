import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  displayName: varchar('display_name', { length: 100 }),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});