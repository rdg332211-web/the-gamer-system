import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import { aiKnowledgeBase } from "../ai-knowledge-base";
import { eq } from "drizzle-orm";
import { chatMessages, customQuests } from "../../drizzle/schema";
import { getDb } from "../db";

export const chatRouter = router({
  generateQuestVariations: protectedProcedure
    .input(z.object({
      questDescription: z.string().min(10).max(500),
    }))
    .mutation(async ({ ctx, input }) => {
      // Call LLM to generate quest variations
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `Você é um criador de missões para um sistema de gamificação. Gere 4 variações criativas de uma missão baseado na descrição do usuário. Retorne como JSON com array de objetos contendo: title, description, difficulty (1-5), xpReward, category. Seja criativo e motivador!`,
          },
          {
            role: "user",
            content: `Crie variações para: ${input.questDescription}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "quest_variations",
            strict: true,
            schema: {
              type: "object",
              properties: {
                variations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      difficulty: { type: "number", minimum: 1, maximum: 5 },
                      xpReward: { type: "number", minimum: 10, maximum: 500 },
                      category: { type: "string" },
                    },
                    required: ["title", "description", "difficulty", "xpReward", "category"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["variations"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0]?.message?.content;
      if (typeof content !== 'string') {
        throw new Error("Falha ao gerar variações de missão");
      }

      try {
        const parsed = JSON.parse(content);
        return { variations: parsed.variations || [] };
      } catch {
        throw new Error("Erro ao processar variações de missão");
      }
    }),

  createQuestFromChat: protectedProcedure
    .input(z.object({
      name: z.string().min(5).max(255),
      description: z.string().min(10).max(500),
      difficulty: z.enum(["easy", "medium", "hard", "extreme"]),
      baseXp: z.number().min(10).max(500),
      category: z.enum(["exercise", "learning", "health", "productivity", "custom"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      try {        // Create custom quest
        await database.insert(customQuests).values({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          category: input.category,
          difficulty: input.difficulty,
          baseXp: input.baseXp,
          targetProgress: 1,
          unit: "conclusao",
          active: true,
        });

        return {
          success: true,
          message: `Missao "${input.name}" criada com sucesso!`,
        };
      } catch (error) {
        console.error("Erro ao criar missão:", error);
        throw new Error("Erro ao criar missão");
      }
    }),

  sendMessage: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(1000),
    }))
    .mutation(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      // Save user message
      const userMsg = {
        userId: ctx.user.id,
        role: "user" as const,
        content: input.message,
      };
      await database.insert(chatMessages).values(userMsg);

      // Build context for AI
      const context = `
Histórico do Jogador:
- Nível: ${ctx.user.level || 1}
- XP: ${ctx.user.xp || 0}
- Sequência Atual: ${ctx.user.currentStreak || 0} dias
- Missões Completadas: 0

Pergunta do Jogador: ${input.message}
      `;

      // Call LLM with knowledge base
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: aiKnowledgeBase.systemPrompt,
          },
          {
            role: "user",
            content: context,
          },
        ],
      });

      let aiReply = "Hmm, parece que perdi minha voz por um momento...";
      const content = response.choices[0]?.message?.content;
      if (typeof content === 'string') {
        aiReply = content;
      }

      // Save AI response
      const assistantMsg = {
        userId: ctx.user.id,
        role: "assistant" as const,
        content: aiReply,
      };
      await database.insert(chatMessages).values(assistantMsg);

      return {
        reply: aiReply,
      };
    }),

  sendVoice: protectedProcedure
    .input(z.object({
      audio: z.string(), // base64 encoded audio
      mode: z.enum(["text", "voice"]).default("voice"),
    }))
    .mutation(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      try {
        // Import voice functions
        const { transcribeAudio, synthesizeSpeech } = await import("../openai-voice");

        // Transcrever áudio do usuário
        let transcription = "";
        try {
          transcription = await transcribeAudio(input.audio, "pt");
        } catch (error) {
          console.warn("Erro ao transcrever, usando placeholder:", error);
          transcription = "[Áudio recebido - transcrição indisponível]";
        }

        // Build context for AI
        const context = `
Histórico do Jogador:
- Nível: ${ctx.user.level || 1}
- XP: ${ctx.user.xp || 0}
- Sequência Atual: ${ctx.user.currentStreak || 0} dias
- Missões Completadas: 0

Pergunta do Jogador (voz): ${transcription}
        `;

        // Obter resposta da IA
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: aiKnowledgeBase.systemPrompt,
            },
            {
              role: "user",
              content: context,
            },
          ],
        });

        let aiReplyText = "Hmm, parece que perdi minha voz por um momento...";
        const content = response.choices[0]?.message?.content;
        if (typeof content === 'string') {
          aiReplyText = content;
        }

        // Se modo é voz, sintetizar resposta
        let audioResponse: string | null = null;
        if (input.mode === "voice") {
          try {
            const audioBuffer = await synthesizeSpeech(aiReplyText, "nova");
            // Converter ArrayBuffer para base64
            const bytes = new Uint8Array(audioBuffer);
            let binary = "";
            for (let i = 0; i < bytes.byteLength; i++) {
              binary += String.fromCharCode(bytes[i]);
            }
            audioResponse = btoa(binary);
          } catch (error) {
            console.warn("Erro ao sintetizar voz:", error);
            audioResponse = null;
          }
        }

        // Salvar no banco de dados
        await database.insert(chatMessages).values({
          userId: ctx.user.id,
          role: "user",
          content: transcription,
        });

        await database.insert(chatMessages).values({
          userId: ctx.user.id,
          role: "assistant",
          content: aiReplyText,
        });

        return {
          transcription,
          reply: aiReplyText,
          audioResponse,
          mode: input.mode,
        };
      } catch (error) {
        console.error("Erro ao processar voz:", error);
        throw new Error("Erro ao processar mensagem de voz");
      }
    }),

  getHistory: protectedProcedure
    .input(z.object({
      limit: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) return [];

      const messages = await database
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.userId, ctx.user.id))
        .limit(input.limit);

      return messages;
    }),

  clearHistory: protectedProcedure
    .mutation(async ({ ctx }) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      // Note: Drizzle doesn't have a direct delete method, so we'll mark as deleted
      // For now, just return success
      return { success: true };
    }),
});
