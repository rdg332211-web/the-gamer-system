import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { achievements, userAchievements, users } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export const achievementsRouter = router({
  /**
   * Get all available achievements
   */
  getAllAchievements: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const allAchievements = await db.select().from(achievements);
    return allAchievements;
  }),

  /**
   * Get user's unlocked achievements
   */
  getUserAchievements: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];

    const userAchievementsList = await db
      .select({
        achievement: achievements,
        unlockedAt: userAchievements.unlockedAt,
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, ctx.user.id));

    return userAchievementsList;
  }),

  /**
   * Check and unlock achievements based on triggers
   */
  checkAndUnlockAchievements: protectedProcedure
    .input(z.object({ trigger: z.string(), value: z.number().optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { unlockedAchievements: [] };

      const unlockedAchievements = [];

      // Get all achievements with this trigger
      const triggeredAchievements = await db
        .select()
        .from(achievements)
        .where(eq(achievements.trigger, input.trigger));

      for (const achievement of triggeredAchievements) {
        // Check if user already has this achievement
        const existing = await db
          .select()
          .from(userAchievements)
          .where(
            and(
              eq(userAchievements.userId, ctx.user.id),
              eq(userAchievements.achievementId, achievement.id)
            )
          );

        if (existing.length === 0) {
          // Check if trigger value matches
          if (input.value === undefined || input.value >= achievement.triggerValue) {
            // Unlock achievement
            await db.insert(userAchievements).values({
              userId: ctx.user.id,
              achievementId: achievement.id,
            });

            unlockedAchievements.push(achievement);
          }
        }
      }

      return { unlockedAchievements };
    }),

  /**
   * Create default achievements (admin only)
   */
  createAchievement: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(100),
        description: z.string().min(10).max(500),
        icon: z.string(),
        rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]),
        trigger: z.string(),
        triggerValue: z.number().default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Apenas administradores podem criar achievements");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(achievements).values({
        name: input.name,
        description: input.description,
        icon: input.icon,
        rarity: input.rarity,
        trigger: input.trigger,
        triggerValue: input.triggerValue,
      });

      return { success: true, message: "Achievement criado" };
    }),

  /**
   * Get achievement statistics for user
   */
  getAchievementStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { totalUnlocked: 0, totalAvailable: 0, percentage: 0 };

    const unlockedCount = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, ctx.user.id));

    const totalCount = await db.select().from(achievements);

    return {
      totalUnlocked: unlockedCount.length,
      totalAvailable: totalCount.length,
      percentage: totalCount.length > 0 ? (unlockedCount.length / totalCount.length) * 100 : 0,
    };
  }),
});
