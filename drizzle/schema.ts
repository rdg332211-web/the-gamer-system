import { int, pgEnum, pgTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extended with gamification fields.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: pgEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Gamification fields
  level: integer("level").default(1).notNull(),
  xp: integer("xp").default(0).notNull(),
  xpToNextLevel: integer("xpToNextLevel").default(100).notNull(),
  hp: integer("hp").default(100).notNull(),
  maxHp: integer("maxHp").default(100).notNull(),
  mp: integer("mp").default(50).notNull(),
  maxMp: integer("maxMp").default(50).notNull(),
  
  // Attributes (RPG Stats)
  strength: integer("strength").default(10).notNull(),
  vitality: integer("vitality").default(10).notNull(),
  agility: integer("agility").default(10).notNull(),
  intelligence: integer("intelligence").default(10).notNull(),
  wisdom: integer("wisdom").default(10).notNull(),
  luck: integer("luck").default(5).notNull(),
  
  // Streak tracking
  currentStreak: integer("currentStreak").default(0).notNull(),
  longestStreak: integer("longestStreak").default(0).notNull(),
  lastQuestCompletedAt: timestamp("lastQuestCompletedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Push notification subscriptions
 */
export const pushSubscriptions = pgTable("pushSubscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  endpoint: varchar("endpoint", { length: 500 }).notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type InsertPushSubscription = typeof pushSubscriptions.$inferInsert;

/**
 * Daily quests template - defines available quests
 */
export const dailyQuestTemplates = pgTable("dailyQuestTemplates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: pgEnum("category", ["exercise", "learning", "health", "productivity", "custom"]).notNull(),
  baseXp: integer("baseXp").default(50).notNull(),
  difficulty: pgEnum("difficulty", ["easy", "medium", "hard", "extreme"]).default("medium").notNull(),
  
  // Attribute bonuses
  strengthBonus: integer("strengthBonus").default(0).notNull(),
  vitalityBonus: integer("vitalityBonus").default(0).notNull(),
  agilityBonus: integer("agilityBonus").default(0).notNull(),
  intelligenceBonus: integer("intelligenceBonus").default(0).notNull(),
  wisdomBonus: integer("wisdomBonus").default(0).notNull(),
  luckBonus: integer("luckBonus").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyQuestTemplate = typeof dailyQuestTemplates.$inferSelect;
export type InsertDailyQuestTemplate = typeof dailyQuestTemplates.$inferInsert;

/**
 * User's daily quests - tracks active quests for each user
 */
export const userDailyQuests = pgTable("userDailyQuests", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  templateId: integer("templateId").notNull(),
  
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: pgEnum("category", ["exercise", "learning", "health", "productivity", "custom"]).notNull(),
  difficulty: pgEnum("difficulty", ["easy", "medium", "hard", "extreme"]).notNull(),
  
  // Progress tracking
  currentProgress: integer("currentProgress").default(0).notNull(),
  targetProgress: integer("targetProgress").notNull(),
  unit: varchar("unit", { length: 50 }).default("").notNull(), // e.g., "reps", "pages", "hours", "km"
  
  // Rewards
  xpReward: integer("xpReward").notNull(),
  
  // Status
  completed: boolean("completed").default(false).notNull(),
  failed: boolean("failed").default(false).notNull(),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  dueAt: timestamp("dueAt").notNull(),
  completedAt: timestamp("completedAt"),
  failedAt: timestamp("failedAt"),
});

export type UserDailyQuest = typeof userDailyQuests.$inferSelect;
export type InsertUserDailyQuest = typeof userDailyQuests.$inferInsert;

/**
 * User progress history - tracks all completed quests
 */
export const userProgress = pgTable("userProgress", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  questId: integer("questId").notNull(),
  
  xpGained: integer("xpGained").notNull(),
  levelUp: boolean("levelUp").default(false).notNull(),
  
  // Attribute gains
  strengthGain: integer("strengthGain").default(0).notNull(),
  vitalityGain: integer("vitalityGain").default(0).notNull(),
  agilityGain: integer("agilityGain").default(0).notNull(),
  intelligenceGain: integer("intelligenceGain").default(0).notNull(),
  wisdomGain: integer("wisdomGain").default(0).notNull(),
  luckGain: integer("luckGain").default(0).notNull(),
  
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

/**
 * Titles/Achievements - unlockable titles based on progress
 */
export const titles = pgTable("titles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  
  // Unlock conditions
  requiredLevel: integer("requiredLevel").default(1).notNull(),
  requiredXp: integer("requiredXp").default(0).notNull(),
  requiredStreak: integer("requiredStreak").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Title = typeof titles.$inferSelect;
export type InsertTitle = typeof titles.$inferInsert;

/**
 * User titles - tracks which titles the user has unlocked
 */
export const userTitles = pgTable("userTitles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  titleId: integer("titleId").notNull(),
  
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type UserTitle = typeof userTitles.$inferSelect;
export type InsertUserTitle = typeof userTitles.$inferInsert;

/**
 * Notifications - tracks alerts sent to users
 */
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  
  type: pgEnum("type", ["quest_available", "quest_deadline", "level_up", "achievement_unlocked", "motivational", "penalty"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  
  read: boolean("read").default(false).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  readAt: timestamp("readAt"),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Weekly rewards - tracks rewards given at end of week
 */
export const weeklyRewards = pgTable("weeklyRewards", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  
  week: integer("week").notNull(), // Week number of the year
  year: integer("year").notNull(),
  
  questsCompleted: integer("questsCompleted").default(0).notNull(),
  totalXpEarned: integer("totalXpEarned").default(0).notNull(),
  bonusXp: integer("bonusXp").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WeeklyReward = typeof weeklyRewards.$inferSelect;
export type InsertWeeklyReward = typeof weeklyRewards.$inferInsert;

/**
 * Custom quests created by users
 */
export const customQuests = pgTable("customQuests", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: pgEnum("category", ["exercise", "learning", "health", "productivity", "custom"]).default("custom").notNull(),
  difficulty: pgEnum("difficulty", ["easy", "medium", "hard", "extreme"]).default("medium").notNull(),
  baseXp: integer("baseXp").default(50).notNull(),
  targetProgress: integer("targetProgress").default(1).notNull(),
  unit: varchar("unit", { length: 50 }).default("").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type CustomQuest = typeof customQuests.$inferSelect;
export type InsertCustomQuest = typeof customQuests.$inferInsert;

/**
 * Chat messages history
 */
export const chatMessages = pgTable("chatMessages", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  content: text("content").notNull(),
  audioUrl: varchar("audioUrl", { length: 512 }),
  transcription: text("transcription"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

/**
 * XP Distribution tracking
 */
export const xpDistribution = pgTable("xpDistribution", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  questId: integer("questId").notNull(),
  totalXp: integer("totalXp").notNull(),
  strengthXp: integer("strengthXp").default(0).notNull(),
  vitalityXp: integer("vitalityXp").default(0).notNull(),
  agilityXp: integer("agilityXp").default(0).notNull(),
  intelligenceXp: integer("intelligenceXp").default(0).notNull(),
  wisdomXp: integer("wisdomXp").default(0).notNull(),
  luckXp: integer("luckXp").default(0).notNull(),
  questType: varchar("questType", { length: 50 }).notNull(),
  distributedAt: timestamp("distributedAt").defaultNow().notNull(),
});

export type XpDistribution = typeof xpDistribution.$inferSelect;
export type InsertXpDistribution = typeof xpDistribution.$inferInsert;

/**
 * Extra missions suggested by AI
 */
export const extraMissions = pgTable("extraMissions", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  trigger: varchar("trigger", { length: 100 }).notNull(),
  xpReward: integer("xpReward").notNull(),
  completed: boolean("completed").default(false).notNull(),
  suggestedAt: timestamp("suggestedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type ExtraMission = typeof extraMissions.$inferSelect;
export type InsertExtraMission = typeof extraMissions.$inferInsert;

/**
 * Penalties applied to users
 */
export const penalties = pgTable("penalties", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  xpLost: integer("xpLost").default(0).notNull(),
  attributeAffected: varchar("attributeAffected", { length: 50 }),
  attributeLost: integer("attributeLost").default(0).notNull(),
  appliedAt: timestamp("appliedAt").defaultNow().notNull(),
});

export type Penalty = typeof penalties.$inferSelect;
export type InsertPenalty = typeof penalties.$inferInsert;


/**
 * Achievements/Badges system
 */
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 255 }).notNull(),
  rarity: pgEnum("rarity", ["common", "uncommon", "rare", "epic", "legendary"]).default("common").notNull(),
  trigger: varchar("trigger", { length: 100 }).notNull(),
  triggerValue: integer("triggerValue").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

/**
 * User achievements (unlocked badges)
 */
export const userAchievements = pgTable("userAchievements", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id),
  achievementId: integer("achievementId").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;
