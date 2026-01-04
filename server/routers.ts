import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { router, publicProcedure, protectedProcedure } from "./_core/trpc";
import { notificationsRouter } from "./routers/notifications";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import { aiRouter } from "./routers/ai";
import { customQuestsRouter, weeklyRewardsRouter, playerStatsRouter } from "./routers/custom-quests";
import { chatRouter } from "./routers/chat";

export const appRouter = router({
  system: systemRouter,
  ai: aiRouter,
  customQuests: customQuestsRouter,
  weeklyRewards: weeklyRewardsRouter,
  playerStats: playerStatsRouter,
  chat: chatRouter,
  notifications: notificationsRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Gamification routers
  player: router({
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });
      
      return {
        id: user.id,
        name: user.name,
        level: user.level,
        xp: user.xp,
        xpToNextLevel: user.xpToNextLevel,
        hp: user.hp,
        maxHp: user.maxHp,
        mp: user.mp,
        maxMp: user.maxMp,
        attributes: {
          strength: user.strength,
          vitality: user.vitality,
          agility: user.agility,
          intelligence: user.intelligence,
          wisdom: user.wisdom,
          luck: user.luck,
        },
        streak: {
          current: user.currentStreak,
          longest: user.longestStreak,
        },
      };
    }),

    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Update user profile (name, etc.)
        // This would require updating the users table
        return { success: true };
      }),
  }),

  quests: router({
    getTodayQuests: protectedProcedure.query(async ({ ctx }) => {
      const quests = await db.getTodayQuests(ctx.user.id);
      return quests;
    }),

    updateProgress: protectedProcedure
      .input(z.object({
        questId: z.number(),
        progress: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateQuestProgress(input.questId, input.progress);
        return { success: true };
      }),

    completeQuest: protectedProcedure
      .input(z.object({
        questId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const quest = await db.getTodayQuests(ctx.user.id);
        const targetQuest = quest.find( (q: any) => q.id === input.questId);
        
        if (!targetQuest) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Quest not found" });
        }

        // Complete the quest
        await db.completeQuest(input.questId);
        
        // Add XP to user
        const xpResult = await db.addUserXp(ctx.user.id, targetQuest.xpReward);
        
        // Record progress
        await db.recordUserProgress(ctx.user.id, input.questId, targetQuest.xpReward, {
          strength: 0,
          vitality: 0,
          agility: 0,
          intelligence: 0,
          wisdom: 0,
          luck: 0,
        });

        // Create notification
        if (xpResult?.leveledUp) {
          await db.createNotification(
            ctx.user.id,
            "level_up",
            `Parabéns! Você subiu para o Nível ${xpResult.newLevel}!`,
            `Você evoluiu para o nível ${xpResult.newLevel}. Continue assim!`
          );
        }

        return { 
          success: true, 
          xpGained: targetQuest.xpReward,
          leveledUp: xpResult?.leveledUp,
          newLevel: xpResult?.newLevel,
        };
      }),

    failQuest: protectedProcedure
      .input(z.object({
        questId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.failQuest(input.questId);
        
        // Apply penalty (reduce HP/MP, reset streak)
        const user = await db.getUserById(ctx.user.id);
        if (user) {
          // Reduce HP by 20% as penalty
          const hpPenalty = Math.floor(user.maxHp * 0.2);
          // This would need to be added to the update function
        }

        // Create penalty notification
        await db.createNotification(
          ctx.user.id,
          "penalty",
          "Missão Falhou!",
          "Você falhou em completar a missão diária. Seu streak foi resetado."
        );

        return { success: true };
      }),
  }),

  community: router({
    getLeaderboard: publicProcedure
      .input(z.object({
        limit: z.number().default(10),
      }))
      .query(async ({ input }) => {
        return db.getLeaderboard(input.limit);
      }),

    getPlayerProfile: publicProcedure
      .input(z.object({
        playerId: z.number(),
      }))
      .query(async ({ input }) => {
        const user = await db.getUserById(input.playerId);
        if (!user) throw new TRPCError({ code: "NOT_FOUND" });
        
        return {
          id: user.id,
          name: user.name,
          level: user.level,
          xp: user.xp,
          attributes: {
            strength: user.strength,
            vitality: user.vitality,
            agility: user.agility,
            intelligence: user.intelligence,
            wisdom: user.wisdom,
            luck: user.luck,
          },
          streak: {
            current: user.currentStreak,
            longest: user.longestStreak,
          },
          createdAt: user.createdAt,
        };
      }),
  }),

  // notifications router já adicionado acima
  notificationsLegacy: router({
    getNotifications: protectedProcedure
      .input(z.object({
        unreadOnly: z.boolean().default(false),
      }))
      .query(async ({ ctx, input }) => {
        return db.getUserNotifications(ctx.user.id, input.unreadOnly);
      }),

    markAsRead: protectedProcedure
      .input(z.object({
        notificationId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.markNotificationAsRead(input.notificationId);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
