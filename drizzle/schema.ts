import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with gamification fields.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Gamification fields
  level: int("level").default(1).notNull(),
  xp: int("xp").default(0).notNull(),
  xpToNextLevel: int("xpToNextLevel").default(100).notNull(),
  hp: int("hp").default(100).notNull(),
  maxHp: int("maxHp").default(100).notNull(),
  mp: int("mp").default(50).notNull(),
  maxMp: int("maxMp").default(50).notNull(),
  
  // Attributes (RPG Stats)
  strength: int("strength").default(10).notNull(),
  vitality: int("vitality").default(10).notNull(),
  agility: int("agility").default(10).notNull(),
  intelligence: int("intelligence").default(10).notNull(),
  wisdom: int("wisdom").default(10).notNull(),
  luck: int("luck").default(5).notNull(),
  
  // Streak tracking
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastQuestCompletedAt: timestamp("lastQuestCompletedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Push notification subscriptions
 */
export const pushSubscriptions = mysqlTable("pushSubscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  endpoint: varchar("endpoint", { length: 500 }).notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PushSubscription = typeof pushSubscriptions.$inferSelect;
export type InsertPushSubscription = typeof pushSubscriptions.$inferInsert;

/**
 * Daily quests template - defines available quests
 */
export const dailyQuestTemplates = mysqlTable("dailyQuestTemplates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["exercise", "learning", "health", "productivity", "custom"]).notNull(),
  baseXp: int("baseXp").default(50).notNull(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard", "extreme"]).default("medium").notNull(),
  
  // Attribute bonuses
  strengthBonus: int("strengthBonus").default(0).notNull(),
  vitalityBonus: int("vitalityBonus").default(0).notNull(),
  agilityBonus: int("agilityBonus").default(0).notNull(),
  intelligenceBonus: int("intelligenceBonus").default(0).notNull(),
  wisdomBonus: int("wisdomBonus").default(0).notNull(),
  luckBonus: int("luckBonus").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyQuestTemplate = typeof dailyQuestTemplates.$inferSelect;
export type InsertDailyQuestTemplate = typeof dailyQuestTemplates.$inferInsert;

/**
 * User's daily quests - tracks active quests for each user
 */
export const userDailyQuests = mysqlTable("userDailyQuests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  templateId: int("templateId").notNull(),
  
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["exercise", "learning", "health", "productivity", "custom"]).notNull(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard", "extreme"]).notNull(),
  
  // Progress tracking
  currentProgress: int("currentProgress").default(0).notNull(),
  targetProgress: int("targetProgress").notNull(),
  unit: varchar("unit", { length: 50 }).default("").notNull(), // e.g., "reps", "pages", "hours", "km"
  
  // Rewards
  xpReward: int("xpReward").notNull(),
  
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
export const userProgress = mysqlTable("userProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  questId: int("questId").notNull(),
  
  xpGained: int("xpGained").notNull(),
  levelUp: boolean("levelUp").default(false).notNull(),
  
  // Attribute gains
  strengthGain: int("strengthGain").default(0).notNull(),
  vitalityGain: int("vitalityGain").default(0).notNull(),
  agilityGain: int("agilityGain").default(0).notNull(),
  intelligenceGain: int("intelligenceGain").default(0).notNull(),
  wisdomGain: int("wisdomGain").default(0).notNull(),
  luckGain: int("luckGain").default(0).notNull(),
  
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;

/**
 * Titles/Achievements - unlockable titles based on progress
 */
export const titles = mysqlTable("titles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  
  // Unlock conditions
  requiredLevel: int("requiredLevel").default(1).notNull(),
  requiredXp: int("requiredXp").default(0).notNull(),
  requiredStreak: int("requiredStreak").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Title = typeof titles.$inferSelect;
export type InsertTitle = typeof titles.$inferInsert;

/**
 * User titles - tracks which titles the user has unlocked
 */
export const userTitles = mysqlTable("userTitles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  titleId: int("titleId").notNull(),
  
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type UserTitle = typeof userTitles.$inferSelect;
export type InsertUserTitle = typeof userTitles.$inferInsert;

/**
 * Notifications - tracks alerts sent to users
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  type: mysqlEnum("type", ["quest_available", "quest_deadline", "level_up", "achievement_unlocked", "motivational", "penalty"]).notNull(),
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
export const weeklyRewards = mysqlTable("weeklyRewards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  week: int("week").notNull(), // Week number of the year
  year: int("year").notNull(),
  
  questsCompleted: int("questsCompleted").default(0).notNull(),
  totalXpEarned: int("totalXpEarned").default(0).notNull(),
  bonusXp: int("bonusXp").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WeeklyReward = typeof weeklyRewards.$inferSelect;
export type InsertWeeklyReward = typeof weeklyRewards.$inferInsert;

/**
 * Custom quests created by users
 */
export const customQuests = mysqlTable("customQuests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", ["exercise", "learning", "health", "productivity", "custom"]).default("custom").notNull(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard", "extreme"]).default("medium").notNull(),
  baseXp: int("baseXp").default(50).notNull(),
  targetProgress: int("targetProgress").default(1).notNull(),
  unit: varchar("unit", { length: 50 }).default("").notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomQuest = typeof customQuests.$inferSelect;
export type InsertCustomQuest = typeof customQuests.$inferInsert;

/**
 * Chat messages history
 */
export const chatMessages = mysqlTable("chatMessages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
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
export const xpDistribution = mysqlTable("xpDistribution", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  questId: int("questId").notNull(),
  totalXp: int("totalXp").notNull(),
  strengthXp: int("strengthXp").default(0).notNull(),
  vitalityXp: int("vitalityXp").default(0).notNull(),
  agilityXp: int("agilityXp").default(0).notNull(),
  intelligenceXp: int("intelligenceXp").default(0).notNull(),
  wisdomXp: int("wisdomXp").default(0).notNull(),
  luckXp: int("luckXp").default(0).notNull(),
  questType: varchar("questType", { length: 50 }).notNull(),
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
  trigger: varchar("trigger", { length: 100 }).notNull(),
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
  type: varchar("type", { length: 50 }).notNull(),
  reason: varchar("reason", { length: 255 }).notNull(),
  xpLost: int("xpLost").default(0).notNull(),
  attributeAffected: varchar("attributeAffected", { length: 50 }),
  attributeLost: int("attributeLost").default(0).notNull(),
  appliedAt: timestamp("appliedAt").defaultNow().notNull(),
});

export type Penalty = typeof penalties.$inferSelect;
export type InsertPenalty = typeof penalties.$inferInsert;


/**
 * Achievements/Badges system
 */
export const achievements = mysqlTable("achievements", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 255 }).notNull(),
  rarity: mysqlEnum("rarity", ["common", "uncommon", "rare", "epic", "legendary"]).default("common").notNull(),
  trigger: varchar("trigger", { length: 100 }).notNull(),
  triggerValue: int("triggerValue").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;

/**
 * User achievements (unlocked badges)
 */
export const userAchievements = mysqlTable("userAchievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  achievementId: int("achievementId").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;
