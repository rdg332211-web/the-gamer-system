import { eq, desc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { InsertUser, users, userDailyQuests, userProgress, notifications } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: any = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      _db = drizzle({ client: sql });
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
    const existingUser = await db.select().from(users).where(eq(users.openId, user.openId)).limit(1);
    
    const updateSet: any = {
      name: user.name ?? (existingUser.length > 0 ? existingUser[0].name : null),
      email: user.email ?? (existingUser.length > 0 ? existingUser[0].email : null),
      loginMethod: user.loginMethod ?? (existingUser.length > 0 ? existingUser[0].loginMethod : null),
      lastSignedIn: new Date(),
    };

    if (user.role !== undefined) {
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      updateSet.role = 'admin';
    }

    if (existingUser.length > 0) {
      await db.update(users)
        .set(updateSet)
        .where(eq(users.openId, user.openId));
    } else {
      await db.insert(users).values({
        ...user,
        ...updateSet,
      });
    }
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
  
  return db.update(userDailyQuests)
    .set({ currentProgress: progress })
    .where(eq(userDailyQuests.id, questId));
}

export async function completeQuest(questId: number) {
  const db = await getDb();
  if (!db) return null;
  
  return db.update(userDailyQuests)
    .set({ completed: true, completedAt: new Date() })
    .where(eq(userDailyQuests.id, questId));
}

export async function failQuest(questId: number) {
  const db = await getDb();
  if (!db) return null;
  
  return db.update(userDailyQuests)
    .set({ failed: true, failedAt: new Date() })
    .where(eq(userDailyQuests.id, questId));
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
  
  if (newXp >= user.xpToNextLevel) {
    newLevel = user.level + 1;
    xpForNextLevel = Math.floor(user.xpToNextLevel * 1.2);
    leveledUp = true;
  }
  
  await db.update(users)
    .set({ 
      xp: newXp,
      level: newLevel,
      xpToNextLevel: xpForNextLevel,
      hp: Math.min(user.maxHp, user.hp + 10),
      mp: Math.min(user.maxMp, user.mp + 5)
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
