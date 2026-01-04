import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import * as dbExt from "../db-extended";
import { TRPCError } from "@trpc/server";

export const customQuestsRouter = router({
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      category: z.enum(["exercise", "learning", "health", "productivity", "custom"]),
      difficulty: z.enum(["easy", "medium", "hard", "extreme"]),
      baseXp: z.number().min(10).max(500),
      targetProgress: z.number().min(1),
      unit: z.string().max(50),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await dbExt.createCustomQuest(ctx.user.id, {
        name: input.name,
        description: input.description,
        category: input.category,
        difficulty: input.difficulty,
        baseXp: input.baseXp,
        targetProgress: input.targetProgress,
        unit: input.unit,
      });

      return { success: !!result };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return dbExt.getUserCustomQuests(ctx.user.id);
  }),

  update: protectedProcedure
    .input(z.object({
      questId: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      difficulty: z.enum(["easy", "medium", "hard", "extreme"]).optional(),
      baseXp: z.number().optional(),
      targetProgress: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const updateData: any = {};
      if (input.name) updateData.name = input.name;
      if (input.description) updateData.description = input.description;
      if (input.difficulty) updateData.difficulty = input.difficulty;
      if (input.baseXp) updateData.baseXp = input.baseXp;
      if (input.targetProgress) updateData.targetProgress = input.targetProgress;

      const result = await dbExt.updateCustomQuest(input.questId, updateData);
      return { success: !!result };
    }),

  delete: protectedProcedure
    .input(z.object({
      questId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await dbExt.deleteCustomQuest(input.questId);
      return { success: !!result };
    }),
});

export const weeklyRewardsRouter = router({
  calculateReward: protectedProcedure
    .input(z.object({
      questsCompleted: z.number().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      const result = await dbExt.calculateWeeklyReward(ctx.user.id, input.questsCompleted);
      return { success: !!result };
    }),

  getHistory: protectedProcedure
    .input(z.object({
      limit: z.number().default(10),
    }))
    .query(async ({ ctx, input }) => {
      return dbExt.getWeeklyRewardHistory(ctx.user.id, input.limit);
    }),
});

export const playerStatsRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    return dbExt.getUserStats(ctx.user.id);
  }),

  getProgressHistory: protectedProcedure
    .input(z.object({
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      return dbExt.getPlayerProgressHistory(ctx.user.id, input.limit);
    }),
});
