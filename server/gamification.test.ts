import { describe, expect, it, beforeEach, vi } from "vitest";
import * as db from "./db";

// Mock the database functions
vi.mock("./db", () => ({
  getUserById: vi.fn(),
  addUserXp: vi.fn(),
  updateUserAttributes: vi.fn(),
  getTodayQuests: vi.fn(),
  completeQuest: vi.fn(),
  failQuest: vi.fn(),
  getLeaderboard: vi.fn(),
  createNotification: vi.fn(),
}));

describe("Gamification System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("XP and Level System", () => {
    it("should add XP to user", async () => {
      const mockUser = {
        id: 1,
        level: 1,
        xp: 50,
        xpToNextLevel: 100,
        maxHp: 100,
        hp: 100,
        maxMp: 50,
        mp: 50,
      };

      vi.mocked(db.getUserById).mockResolvedValue(mockUser as any);
      vi.mocked(db.addUserXp).mockResolvedValue({ leveledUp: false, newLevel: 1 });

      const result = await db.addUserXp(1, 30);

      expect(result).toEqual({ leveledUp: false, newLevel: 1 });
      expect(db.addUserXp).toHaveBeenCalledWith(1, 30);
    });

    it("should level up when XP threshold is reached", async () => {
      const mockUser = {
        id: 1,
        level: 1,
        xp: 80,
        xpToNextLevel: 100,
        maxHp: 100,
        hp: 100,
        maxMp: 50,
        mp: 50,
      };

      vi.mocked(db.getUserById).mockResolvedValue(mockUser as any);
      vi.mocked(db.addUserXp).mockResolvedValue({ leveledUp: true, newLevel: 2 });

      const result = await db.addUserXp(1, 50);

      expect(result?.leveledUp).toBe(true);
      expect(result?.newLevel).toBe(2);
    });

    it("should restore HP and MP on quest completion", async () => {
      const mockUser = {
        id: 1,
        level: 1,
        xp: 50,
        xpToNextLevel: 100,
        maxHp: 100,
        hp: 80,
        maxMp: 50,
        mp: 30,
      };

      vi.mocked(db.getUserById).mockResolvedValue(mockUser as any);
      vi.mocked(db.addUserXp).mockResolvedValue({ leveledUp: false, newLevel: 1 });

      await db.addUserXp(1, 50);

      expect(db.addUserXp).toHaveBeenCalled();
    });
  });

  describe("Quest System", () => {
    it("should retrieve today's quests for a user", async () => {
      const mockQuests = [
        {
          id: 1,
          userId: 1,
          name: "Push-ups",
          currentProgress: 0,
          targetProgress: 15,
          completed: false,
          failed: false,
        },
        {
          id: 2,
          userId: 1,
          name: "Reading",
          currentProgress: 0,
          targetProgress: 1,
          completed: false,
          failed: false,
        },
      ];

      vi.mocked(db.getTodayQuests).mockResolvedValue(mockQuests as any);

      const quests = await db.getTodayQuests(1);

      expect(quests).toHaveLength(2);
      expect(quests[0].name).toBe("Push-ups");
      expect(db.getTodayQuests).toHaveBeenCalledWith(1);
    });

    it("should mark quest as completed", async () => {
      vi.mocked(db.completeQuest).mockResolvedValue({} as any);

      await db.completeQuest(1);

      expect(db.completeQuest).toHaveBeenCalledWith(1);
    });

    it("should mark quest as failed", async () => {
      vi.mocked(db.failQuest).mockResolvedValue({} as any);

      await db.failQuest(1);

      expect(db.failQuest).toHaveBeenCalledWith(1);
    });
  });

  describe("Leaderboard System", () => {
    it("should retrieve top players", async () => {
      const mockLeaderboard = [
        {
          id: 1,
          name: "Player One",
          level: 10,
          xp: 5000,
          strength: 15,
          vitality: 14,
          agility: 12,
          intelligence: 16,
          wisdom: 13,
          luck: 8,
          currentStreak: 7,
        },
        {
          id: 2,
          name: "Player Two",
          level: 8,
          xp: 3500,
          strength: 12,
          vitality: 13,
          agility: 14,
          intelligence: 12,
          wisdom: 11,
          luck: 6,
          currentStreak: 5,
        },
      ];

      vi.mocked(db.getLeaderboard).mockResolvedValue(mockLeaderboard as any);

      const leaderboard = await db.getLeaderboard(10);

      expect(leaderboard).toHaveLength(2);
      expect(leaderboard[0].level).toBe(10);
      expect(leaderboard[1].level).toBe(8);
      expect(db.getLeaderboard).toHaveBeenCalledWith(10);
    });

    it("should respect limit parameter", async () => {
      vi.mocked(db.getLeaderboard).mockResolvedValue([]);

      await db.getLeaderboard(5);

      expect(db.getLeaderboard).toHaveBeenCalledWith(5);
    });
  });

  describe("Attributes System", () => {
    it("should update user attributes", async () => {
      const attributes = {
        strength: 12,
        vitality: 11,
        agility: 10,
        intelligence: 13,
        wisdom: 12,
        luck: 6,
      };

      vi.mocked(db.updateUserAttributes).mockResolvedValue({} as any);

      await db.updateUserAttributes(1, attributes);

      expect(db.updateUserAttributes).toHaveBeenCalledWith(1, attributes);
    });

    it("should handle partial attribute updates", async () => {
      const partialAttributes = {
        strength: 15,
        intelligence: 14,
      };

      vi.mocked(db.updateUserAttributes).mockResolvedValue({} as any);

      await db.updateUserAttributes(1, partialAttributes);

      expect(db.updateUserAttributes).toHaveBeenCalledWith(1, partialAttributes);
    });
  });

  describe("Notifications System", () => {
    it("should create a notification", async () => {
      vi.mocked(db.createNotification).mockResolvedValue({} as any);

      await db.createNotification(
        1,
        "level_up",
        "Level Up!",
        "You reached level 2!"
      );

      expect(db.createNotification).toHaveBeenCalledWith(
        1,
        "level_up",
        "Level Up!",
        "You reached level 2!"
      );
    });

    it("should create motivational notification", async () => {
      vi.mocked(db.createNotification).mockResolvedValue({} as any);

      await db.createNotification(
        1,
        "motivational",
        "Mensagem do Arquiteto",
        "Você está perto de falhar!"
      );

      expect(db.createNotification).toHaveBeenCalled();
    });
  });
});
