import { pgTable, serial, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const features = pgTable('features', {
  id: serial('id').primaryKey(),
  kind: serial('kind').notNull(),
  pubkey: text('pubkey').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  content: jsonb('content').notNull(),
  tags: jsonb('tags').notNull(),
});

export const communities = pgTable('communities', {
  id: serial('id').primaryKey(),
  kind: serial('kind').notNull(),
  pubkey: text('pubkey').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  content: jsonb('content').notNull(),
  tags: jsonb('tags').notNull(),
});

export const reactions = pgTable('reactions', {
  id: serial('id').primaryKey(),
  kind: serial('kind').notNull(),
  pubkey: text('pubkey').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  content: text('content').notNull(),
  tags: jsonb('tags').notNull(),
  event_id: text('event_id').notNull(),
});
