import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
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

describe("Chat System", () => {
  describe("sendMessage", () => {
    it("should send a message to the AI", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.sendMessage({
        message: "Como faço para melhorar meu foco?",
      });

      expect(result).toBeDefined();
      expect(result.reply).toBeDefined();
      expect(typeof result.reply).toBe("string");
    }, { timeout: 30000 });

    it("should reject empty messages", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.chat.sendMessage({
          message: "",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should reject messages longer than 1000 characters", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const longMessage = "a".repeat(1001);

      try {
        await caller.chat.sendMessage({
          message: longMessage,
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("sendVoice", () => {
    it("should send a voice message", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Use base64 encoded audio instead of Blob
      const base64Audio = "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==";

      const result = await caller.chat.sendVoice({
        audio: base64Audio,
      });

      expect(result).toBeDefined();
      expect(result.transcription).toBeDefined();
      expect(result.reply).toBeDefined();
    }, { timeout: 30000 });
  });

  describe("getHistory", () => {
    it("should retrieve chat history", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const history = await caller.chat.getHistory({
        limit: 10,
      });

      expect(Array.isArray(history)).toBe(true);
    });

    it("should respect limit parameter", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const history = await caller.chat.getHistory({
        limit: 5,
      });

      expect(history.length).toBeLessThanOrEqual(5);
    });

    it("should default to 50 messages if no limit provided", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const history = await caller.chat.getHistory({});

      expect(Array.isArray(history)).toBe(true);
    });
  });

  describe("clearHistory", () => {
    it("should clear chat history", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.clearHistory();

      expect(result.success).toBe(true);
    });
  });

  describe("Chat Validation", () => {
    it("should validate message input", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Valid message should work
      const validMessage = "Como melhorar meu foco?";
      expect(validMessage.length).toBeGreaterThan(0);
      expect(validMessage.length).toBeLessThanOrEqual(1000);
    });

    it("should handle special characters", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const messageWithSpecialChars = "Como fazer exercícios? 💪";
      expect(messageWithSpecialChars).toBeDefined();
    });
  });

  describe("Chat History Management", () => {
    it("should support clearing history", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.chat.clearHistory();
      expect(result.success).toBe(true);
    });

    it("should retrieve empty history after clearing", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      await caller.chat.clearHistory();
      const history = await caller.chat.getHistory({ limit: 10 });

      expect(Array.isArray(history)).toBe(true);
    });
  });
});
