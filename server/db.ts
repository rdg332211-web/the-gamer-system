import { eq, desc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, userDailyQuests, userProgress, titles, userTitles, notifications, weeklyRewards, dailyQuestTemplates } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Gamification helpers

export async function getTodayQuests(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return db.select()
    .from(userDailyQuests)
    .where(
      and(
        eq(userDailyQuests.userId, userId),
        gte(userDailyQuests.createdAt, today),
        lte(userDailyQuests.createdAt, tomorrow)
      )
    );
}

export async function updateQuestProgress(questId: number, progress: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.update(userDailyQuests)
    .set({ currentProgress: progress })
    .where(eq(userDailyQuests.id, questId));
  
  return result;
}

export async function completeQuest(questId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.update(userDailyQuests)
    .set({ completed: true, completedAt: new Date() })
    .where(eq(userDailyQuests.id, questId));
  
  return result;
}

export async function failQuest(questId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.update(userDailyQuests)
    .set({ failed: true, failedAt: new Date() })
    .where(eq(userDailyQuests.id, questId));
  
  return result;
}

export async function addUserXp(userId: number, xpAmount: number) {
  const db = await getDb();
  if (!db) return null;
  
  const user = await getUserById(userId);
  if (!user) return null;
  
  const newXp = user.xp + xpAmount;
  let newLevel = user.level;
  let xpForNextLevel = user.xpToNextLevel;
  let leveledUp = false;
  
  // Check for level up
  if (newXp >= user.xpToNextLevel) {
    newLevel = user.level + 1;
    xpForNextLevel = Math.floor(user.xpToNextLevel * 1.2); // 20% more XP for next level
    leveledUp = true;
  }
  
  await db.update(users)
    .set({ 
      xp: newXp,
      level: newLevel,
      xpToNextLevel: xpForNextLevel,
      hp: Math.min(user.maxHp, user.hp + 10), // Restore some HP on quest completion
      mp: Math.min(user.maxMp, user.mp + 5)   // Restore some MP
    })
    .where(eq(users.id, userId));
  
  return { leveledUp, newLevel };
}

export async function updateUserAttributes(userId: number, attributes: {
  strength?: number;
  vitality?: number;
  agility?: number;
  intelligence?: number;
  wisdom?: number;
  luck?: number;
}) {
  const db = await getDb();
  if (!db) return null;
  
  const updateData: Record<string, number> = {};
  
  if (attributes.strength !== undefined) updateData.strength = attributes.strength;
  if (attributes.vitality !== undefined) updateData.vitality = attributes.vitality;
  if (attributes.agility !== undefined) updateData.agility = attributes.agility;
  if (attributes.intelligence !== undefined) updateData.intelligence = attributes.intelligence;
  if (attributes.wisdom !== undefined) updateData.wisdom = attributes.wisdom;
  if (attributes.luck !== undefined) updateData.luck = attributes.luck;
  
  return db.update(users)
    .set(updateData)
    .where(eq(users.id, userId));
}

export async function getLeaderboard(limit: number = 10) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select({
    id: users.id,
    name: users.name,
    level: users.level,
    xp: users.xp,
    strength: users.strength,
    vitality: users.vitality,
    agility: users.agility,
    intelligence: users.intelligence,
    wisdom: users.wisdom,
    luck: users.luck,
    currentStreak: users.currentStreak,
  })
    .from(users)
    .orderBy(desc(users.level), desc(users.xp))
    .limit(limit);
}

export async function createNotification(userId: number, type: string, title: string, content: string) {
  const db = await getDb();
  if (!db) return null;
  
  return db.insert(notifications).values({
    userId,
    type: type as any,
    title,
    content,
  });
}

export async function getUserNotifications(userId: number, unreadOnly: boolean = false) {
  const db = await getDb();
  if (!db) return [];
  
  if (unreadOnly) {
    return db.select()
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)))
      .orderBy(desc(notifications.createdAt));
  }
  
  return db.select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) return null;
  
  return db.update(notifications)
    .set({ read: true, readAt: new Date() })
    .where(eq(notifications.id, notificationId));
}

export async function recordUserProgress(userId: number, questId: number, xpGained: number, attributeGains: any) {
  const db = await getDb();
  if (!db) return null;
  
  return db.insert(userProgress).values({
    userId,
    questId,
    xpGained,
    strengthGain: attributeGains.strength || 0,
    vitalityGain: attributeGains.vitality || 0,
    agilityGain: attributeGains.agility || 0,
    intelligenceGain: attributeGains.intelligence || 0,
    wisdomGain: attributeGains.wisdom || 0,
    luckGain: attributeGains.luck || 0,
  });
}
