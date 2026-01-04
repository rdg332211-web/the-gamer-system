import { int, text, timestamp, varchar, mysqlTable, boolean } from "drizzle-orm/mysql-core";

/**
 * Chat messages history
 */
export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  role: varchar("role", { length: 20 }).notNull(), // "user" | "assistant"
  content: text("content").notNull(),
  
  // For voice messages
  audioUrl: varchar("audioUrl", { length: 512 }),
  transcription: text("transcription"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * XP Distribution tracking
 */
export const xpDistribution = mysqlTable("xpDistribution", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  questId: int("questId").notNull(),
  
  totalXp: int("totalXp").notNull(),
  
  // Attribute distribution
  strengthXp: int("strengthXp").default(0).notNull(),
  vitalityXp: int("vitalityXp").default(0).notNull(),
  agilityXp: int("agilityXp").default(0).notNull(),
  intelligenceXp: int("intelligenceXp").default(0).notNull(),
  wisdomXp: int("wisdomXp").default(0).notNull(),
  luckXp: int("luckXp").default(0).notNull(),
  
  questType: varchar("questType", { length: 50 }).notNull(), // "exercise", "learning", etc
  
  distributedAt: timestamp("distributedAt").defaultNow().notNull(),
});

export type XpDistribution = typeof xpDistribution.$inferSelect;
export type InsertXpDistribution = typeof xpDistribution.$inferInsert;

/**
 * Extra missions suggested by AI
 */
export const extraMissions = mysqlTable("extraMissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  trigger: varchar("trigger", { length: 100 }).notNull(), // "streakOf3", "allCategoriesComplete", etc
  
  xpReward: int("xpReward").notNull(),
  completed: boolean("completed").default(false).notNull(),
  
  suggestedAt: timestamp("suggestedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type ExtraMission = typeof extraMissions.$inferSelect;
export type InsertExtraMission = typeof extraMissions.$inferInsert;

/**
 * Penalties applied to users
 */
export const penalties = mysqlTable("penalties", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  type: varchar("type", { length: 50 }).notNull(), // "xp_loss", "attribute_loss", "streak_reset"
  reason: varchar("reason", { length: 255 }).notNull(), // "quest_failed", "missed_deadline"
  
  xpLost: int("xpLost").default(0).notNull(),
  attributeAffected: varchar("attributeAffected", { length: 50 }),
  attributeLost: int("attributeLost").default(0).notNull(),
  
  appliedAt: timestamp("appliedAt").defaultNow().notNull(),
});

export type Penalty = typeof penalties.$inferSelect;
export type InsertPenalty = typeof penalties.$inferInsert;
