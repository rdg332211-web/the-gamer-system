import { eq, and } from "drizzle-orm";
import { customQuests, weeklyRewards, users } from "../drizzle/schema";
import { getDb } from "./db";

// Custom Quests functions

export async function createCustomQuest(userId: number, questData: {
  name: string;
  description?: string;
  category: 'exercise' | 'learning' | 'health' | 'productivity' | 'custom';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  baseXp: number;
  targetProgress: number;
  unit: string;
}) {
  const db = await getDb();
  if (!db) return null;

  return db.insert(customQuests).values({
    userId,
    name: questData.name,
    description: questData.description,
    category: questData.category,
    difficulty: questData.difficulty,
    baseXp: questData.baseXp,
    targetProgress: questData.targetProgress,
    unit: questData.unit,
  });
}

export async function getUserCustomQuests(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select()
    .from(customQuests)
    .where(and(eq(customQuests.userId, userId), eq(customQuests.active, true)));
}

export async function updateCustomQuest(questId: number, questData: any) {
  const db = await getDb();
  if (!db) return null;

  return db.update(customQuests)
    .set(questData)
    .where(eq(customQuests.id, questId));
}

export async function deleteCustomQuest(questId: number) {
  const db = await getDb();
  if (!db) return null;

  return db.update(customQuests)
    .set({ active: false })
    .where(eq(customQuests.id, questId));
}

// Weekly Rewards functions

export async function calculateWeeklyReward(userId: number, questsCompleted: number) {
  const db = await getDb();
  if (!db) return null;

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.length === 0) return null;

  // Calculate bonus XP based on quests completed
  // Formula: base 100 XP + 50 XP per quest completed
  const bonusXp = 100 + (questsCompleted * 50);

  // Get current week and year
  const now = new Date();
  const week = Math.ceil((now.getDate() + new Date(now.getFullYear(), now.getMonth(), 1).getDay()) / 7);
  const year = now.getFullYear();

  return db.insert(weeklyRewards).values({
    userId,
    week,
    year,
    questsCompleted,
    totalXpEarned: questsCompleted * 50,
    bonusXp,
  });
}

export async function getWeeklyRewardHistory(userId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  return db.select()
    .from(weeklyRewards)
    .where(eq(weeklyRewards.userId, userId))
    .limit(limit);
}

export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.length === 0) return null;

  const userData = user[0];

  return {
    level: userData.level,
    xp: userData.xp,
    hp: userData.hp,
    maxHp: userData.maxHp,
    mp: userData.mp,
    maxMp: userData.maxMp,
    attributes: {
      strength: userData.strength,
      vitality: userData.vitality,
      agility: userData.agility,
      intelligence: userData.intelligence,
      wisdom: userData.wisdom,
      luck: userData.luck,
    },
    streak: {
      current: userData.currentStreak,
      longest: userData.longestStreak,
    },
    joinedAt: userData.createdAt,
    lastSignedIn: userData.lastSignedIn,
  };
}

export async function getPlayerProgressHistory(userId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  // This would need to query userProgress table
  // For now, returning empty as it's imported from db.ts
  return [];
}
