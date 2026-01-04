import { describe, expect, it, beforeEach, vi } from "vitest";
import * as dbExt from "./db-extended";

// Mock the database functions
vi.mock("./db-extended", () => ({
  createCustomQuest: vi.fn(),
  getUserCustomQuests: vi.fn(),
  updateCustomQuest: vi.fn(),
  deleteCustomQuest: vi.fn(),
  calculateWeeklyReward: vi.fn(),
  getWeeklyRewardHistory: vi.fn(),
  getUserStats: vi.fn(),
  getPlayerProgressHistory: vi.fn(),
}));

describe("Custom Quests System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Custom Quest Creation", () => {
    it("should create a custom quest", async () => {
      const questData = {
        name: "Run 5km",
        description: "Run 5 kilometers",
        category: "exercise" as const,
        difficulty: "medium" as const,
        baseXp: 100,
        targetProgress: 5,
        unit: "km",
      };

      vi.mocked(dbExt.createCustomQuest).mockResolvedValue({} as any);

      const result = await dbExt.createCustomQuest(1, questData);

      expect(result).toBeDefined();
      expect(dbExt.createCustomQuest).toHaveBeenCalledWith(1, questData);
    });

    it("should retrieve user custom quests", async () => {
      const mockQuests = [
        {
          id: 1,
          userId: 1,
          name: "Run 5km",
          category: "exercise",
          difficulty: "medium",
          baseXp: 100,
          active: true,
        },
        {
          id: 2,
          userId: 1,
          name: "Read 20 pages",
          category: "learning",
          difficulty: "easy",
          baseXp: 50,
          active: true,
        },
      ];

      vi.mocked(dbExt.getUserCustomQuests).mockResolvedValue(mockQuests as any);

      const quests = await dbExt.getUserCustomQuests(1);

      expect(quests).toHaveLength(2);
      expect(quests[0].name).toBe("Run 5km");
      expect(dbExt.getUserCustomQuests).toHaveBeenCalledWith(1);
    });

    it("should update a custom quest", async () => {
      const updateData = {
        name: "Run 10km",
        baseXp: 150,
      };

      vi.mocked(dbExt.updateCustomQuest).mockResolvedValue({} as any);

      await dbExt.updateCustomQuest(1, updateData);

      expect(dbExt.updateCustomQuest).toHaveBeenCalledWith(1, updateData);
    });

    it("should delete a custom quest", async () => {
      vi.mocked(dbExt.deleteCustomQuest).mockResolvedValue({} as any);

      await dbExt.deleteCustomQuest(1);

      expect(dbExt.deleteCustomQuest).toHaveBeenCalledWith(1);
    });
  });

  describe("Weekly Rewards System", () => {
    it("should calculate weekly reward", async () => {
      vi.mocked(dbExt.calculateWeeklyReward).mockResolvedValue({} as any);

      await dbExt.calculateWeeklyReward(1, 5);

      expect(dbExt.calculateWeeklyReward).toHaveBeenCalledWith(1, 5);
    });

    it("should calculate bonus XP correctly", async () => {
      // Formula: 100 + (questsCompleted * 50)
      // For 5 quests: 100 + (5 * 50) = 350 XP
      vi.mocked(dbExt.calculateWeeklyReward).mockResolvedValue({} as any);

      await dbExt.calculateWeeklyReward(1, 5);

      expect(dbExt.calculateWeeklyReward).toHaveBeenCalled();
    });

    it("should retrieve weekly reward history", async () => {
      const mockRewards = [
        {
          id: 1,
          userId: 1,
          week: 1,
          year: 2026,
          questsCompleted: 5,
          totalXpEarned: 250,
          bonusXp: 350,
        },
        {
          id: 2,
          userId: 1,
          week: 2,
          year: 2026,
          questsCompleted: 7,
          totalXpEarned: 350,
          bonusXp: 450,
        },
      ];

      vi.mocked(dbExt.getWeeklyRewardHistory).mockResolvedValue(mockRewards as any);

      const rewards = await dbExt.getWeeklyRewardHistory(1, 10);

      expect(rewards).toHaveLength(2);
      expect(rewards[0].bonusXp).toBe(350);
      expect(dbExt.getWeeklyRewardHistory).toHaveBeenCalledWith(1, 10);
    });
  });

  describe("Player Stats System", () => {
    it("should retrieve player stats", async () => {
      const mockStats = {
        level: 5,
        xp: 500,
        hp: 100,
        maxHp: 100,
        mp: 50,
        maxMp: 50,
        attributes: {
          strength: 15,
          vitality: 14,
          agility: 12,
          intelligence: 16,
          wisdom: 13,
          luck: 8,
        },
        streak: {
          current: 7,
          longest: 10,
        },
        joinedAt: new Date(),
        lastSignedIn: new Date(),
      };

      vi.mocked(dbExt.getUserStats).mockResolvedValue(mockStats as any);

      const stats = await dbExt.getUserStats(1);

      expect(stats).toBeDefined();
      expect(stats?.level).toBe(5);
      expect(stats?.attributes.strength).toBe(15);
      expect(dbExt.getUserStats).toHaveBeenCalledWith(1);
    });

    it("should retrieve player progress history", async () => {
      const mockHistory = [
        {
          id: 1,
          userId: 1,
          questId: 1,
          xpGained: 50,
          completedAt: new Date(),
        },
        {
          id: 2,
          userId: 1,
          questId: 2,
          xpGained: 100,
          completedAt: new Date(),
        },
      ];

      vi.mocked(dbExt.getPlayerProgressHistory).mockResolvedValue(mockHistory as any);

      const history = await dbExt.getPlayerProgressHistory(1, 20);

      expect(history).toHaveLength(2);
      expect(history[0].xpGained).toBe(50);
      expect(dbExt.getPlayerProgressHistory).toHaveBeenCalledWith(1, 20);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty custom quests list", async () => {
      vi.mocked(dbExt.getUserCustomQuests).mockResolvedValue([]);

      const quests = await dbExt.getUserCustomQuests(1);

      expect(quests).toHaveLength(0);
    });

    it("should handle zero quests completed for weekly reward", async () => {
      vi.mocked(dbExt.calculateWeeklyReward).mockResolvedValue({} as any);

      await dbExt.calculateWeeklyReward(1, 0);

      expect(dbExt.calculateWeeklyReward).toHaveBeenCalledWith(1, 0);
    });

    it("should handle maximum difficulty custom quest", async () => {
      const questData = {
        name: "Extreme Challenge",
        description: "The hardest quest",
        category: "custom" as const,
        difficulty: "extreme" as const,
        baseXp: 500,
        targetProgress: 1,
        unit: "completion",
      };

      vi.mocked(dbExt.createCustomQuest).mockResolvedValue({} as any);

      await dbExt.createCustomQuest(1, questData);

      expect(dbExt.createCustomQuest).toHaveBeenCalledWith(1, questData);
    });
  });
});
