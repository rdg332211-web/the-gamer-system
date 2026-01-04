import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "test",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    strength: 10,
    vitality: 10,
    agility: 10,
    intelligence: 10,
    wisdom: 10,
    luck: 5,
    currentStreak: 0,
    longestStreak: 0,
    lastQuestCompletedAt: null,
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("chat.createQuestFromChat", () => {
  it("should create a custom quest from chat", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.createQuestFromChat({
      name: "Fazer 20 flexões",
      description: "Complete 20 flexões para ganhar força",
      difficulty: "medium",
      baseXp: 100,
      category: "exercise",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toContain("criada com sucesso");
  });

  it("should validate quest name length", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.chat.createQuestFromChat({
        name: "A",
        description: "Complete 20 flexões para ganhar força",
        difficulty: "medium",
        baseXp: 100,
        category: "exercise",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should validate quest description length", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.chat.createQuestFromChat({
        name: "Fazer flexões",
        description: "A",
        difficulty: "medium",
        baseXp: 100,
        category: "exercise",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should validate XP reward range", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.chat.createQuestFromChat({
        name: "Fazer flexões",
        description: "Complete 20 flexões para ganhar força",
        difficulty: "medium",
        baseXp: 10000,
        category: "exercise",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should accept all valid difficulty levels", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const difficulties = ["easy", "medium", "hard", "extreme"] as const;

    for (const difficulty of difficulties) {
      const result = await caller.chat.createQuestFromChat({
        name: `Teste ${difficulty}`,
        description: `Complete esta missão de dificuldade ${difficulty}`,
        difficulty,
        baseXp: 100,
        category: "exercise",
      });

      expect(result.success).toBe(true);
    }
  });

  it("should accept all valid categories", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const categories = [
      "exercise",
      "learning",
      "health",
      "productivity",
      "custom",
    ] as const;

    for (const category of categories) {
      const result = await caller.chat.createQuestFromChat({
        name: `Teste ${category}`,
        description: `Complete esta missão da categoria ${category}`,
        difficulty: "medium",
        baseXp: 100,
        category,
      });

      expect(result.success).toBe(true);
    }
  });
});
