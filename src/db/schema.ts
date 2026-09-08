import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const reframedCards = pgTable('reframed_cards', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .references(() => users.uid, { onDelete: 'cascade' })
    .notNull(),
  originalText: text('original_text').notNull(),
  mainReframedKeyword: text('main_reframed_keyword').notNull(),
  strengths: text('strengths').notNull(), // JSON array string
  situationalExamples: text('situational_examples').notNull(), // JSON array string
  selfCompassionMessage: text('self_compassion_message').notNull(),
  affirmation: text('affirmation').notNull(),
  actionAdvice: text('action_advice').notNull(),
  categoryTag: text('category_tag').notNull(),
  timestamp: text('timestamp').notNull(),
  moodBefore: integer('mood_before'),
  moodAfter: integer('mood_after'),
  isFavorite: boolean('is_favorite').default(false).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const characterState = pgTable('character_state', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.uid, { onDelete: 'cascade' }),
  name: text('name').notNull().default('ココロん'),
  level: integer('level').notNull().default(1),
  exp: integer('exp').notNull().default(30),
  points: integer('points').notNull().default(100),
  streakDays: integer('streak_days').notNull().default(1),
  lastLoginDate: text('last_login_date').default(''),
  equipped: text('equipped').notNull().default('{"headwear":"hat-flower","aura":"aura-sparkles"}'), // JSON
  unlockedItemIds: text('unlocked_item_ids').notNull().default('["hat-flower","aura-sparkles"]'), // JSON array
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  cards: many(reframedCards),
  characterState: one(characterState, {
    fields: [users.uid],
    references: [characterState.userId],
  }),
}));

export const reframedCardsRelations = relations(reframedCards, ({ one }) => ({
  user: one(users, {
    fields: [reframedCards.userId],
    references: [users.uid],
  }),
}));

export const characterStateRelations = relations(characterState, ({ one }) => ({
  user: one(users, {
    fields: [characterState.userId],
    references: [users.uid],
  }),
}));
