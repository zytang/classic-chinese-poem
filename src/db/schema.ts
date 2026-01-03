import { pgTable, serial, text, timestamp, json, varchar, boolean } from 'drizzle-orm/pg-core';

export const poems = pgTable('poems', {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 256 }).notNull(), // Clerk User ID
    title: text('title').notNull(),
    author: text('author').notNull(),
    content: json('content').notNull(), // Array of strings stored as JSON
    style: varchar('style', { length: 50 }).notNull(),
    imageUrl: text('image_url'),
    isPublic: boolean('is_public').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type NewPoem = typeof poems.$inferInsert;
export type Poem = typeof poems.$inferSelect;
