import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { invokeLLM } from "../_core/llm";
import * as db from "../db";

export const aiRouter = router({
  analyzeMissions: protectedProcedure
    .input(z.object({
      missions: z.array(z.object({
        name: z.string(),
        category: z.string(),
        difficulty: z.string(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new Error("User not found");

      const missionsText = input.missions
        .map(m => `- ${m.name} (${m.category}, ${m.difficulty})`)
        .join('\n');

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `Você é um assistente de gamificação de hábitos pessoais. Seu papel é analisar as missões diárias de um jogador e fornecer feedback motivacional e sugestões de melhoria. Responda de forma concisa e inspiradora, como se fosse um mentor em um RPG.`,
          },
          {
            role: "user",
            content: `Analize as seguintes missões diárias que um jogador está tentando completar:\n\n${missionsText}\n\nO jogador está no nível ${user.level} com ${user.xp} XP. Forneça feedback motivacional e sugestões para melhorar o progresso.`,
          },
        ],
      });

      const contentRaw = response.choices[0]?.message.content;
      const content = typeof contentRaw === 'string' ? contentRaw : '';

      // Create motivational notification
      await db.createNotification(
        ctx.user.id,
        "motivational",
        "Mensagem do Arquiteto",
        content
      );

      return { analysis: content };
    }),

  suggestNewMissions: protectedProcedure
    .mutation(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new Error("User not found");

      const userAttributes = {
        strength: user.strength,
        vitality: user.vitality,
        agility: user.agility,
        intelligence: user.intelligence,
        wisdom: user.wisdom,
        luck: user.luck,
      };

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `Você é um criador de missões para um sistema de gamificação de hábitos. Crie 3 novas missões diárias personalizadas baseadas nos atributos do jogador. Retorne em formato JSON com a seguinte estrutura:
{
  "missions": [
    {
      "name": "Nome da Missão",
      "description": "Descrição breve",
      "category": "exercise|learning|health|productivity",
      "difficulty": "easy|medium|hard|extreme",
      "xpReward": número,
      "targetProgress": número,
      "unit": "reps|pages|hours|km|etc"
    }
  ]
}`,
          },
          {
            role: "user",
            content: `Crie 3 novas missões diárias para um jogador com os seguintes atributos:
- Força: ${userAttributes.strength}
- Vitalidade: ${userAttributes.vitality}
- Agilidade: ${userAttributes.agility}
- Inteligência: ${userAttributes.intelligence}
- Sabedoria: ${userAttributes.wisdom}
- Sorte: ${userAttributes.luck}

Nível atual: ${user.level}
XP atual: ${user.xp}

Crie missões que desafiem o jogador de forma equilibrada e motivadora.`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "suggested_missions",
            strict: true,
            schema: {
              type: "object",
              properties: {
                missions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      description: { type: "string" },
                      category: { type: "string" },
                      difficulty: { type: "string" },
                      xpReward: { type: "number" },
                      targetProgress: { type: "number" },
                      unit: { type: "string" },
                    },
                    required: ["name", "description", "category", "difficulty", "xpReward", "targetProgress", "unit"],
                  },
                },
              },
              required: ["missions"],
            },
          },
        },
      });

      const content = response.choices[0]?.message.content;
      const contentStr = typeof content === 'string' ? content : '';
      const suggestions = JSON.parse(contentStr || "{}");

      return { suggestions: suggestions.missions };
    }),

  getMotivationalMessage: protectedProcedure
    .input(z.object({
      urgency: z.enum(["low", "medium", "high"]).default("medium"),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await db.getUserById(ctx.user.id);
      if (!user) throw new Error("User not found");

      const urgencyText = {
        low: "O jogador está progredindo bem",
        medium: "O jogador está próximo do prazo",
        high: "O jogador está muito próximo de falhar",
      };

      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `Você é o Arquiteto, um mentor IA em um sistema de gamificação de hábitos. Você fornece mensagens motivacionais curtas e inspiradoras. Mantenha as mensagens entre 1-2 frases.`,
          },
          {
            role: "user",
            content: `Forneça uma mensagem motivacional para um jogador no nível ${user.level}. Contexto: ${urgencyText[input.urgency]}. Seja inspirador e direto.`,
          },
        ],
      });

      const messageContent = response.choices[0]?.message.content;
      const message = typeof messageContent === 'string' ? messageContent : "Você pode conseguir!";

      // Create notification with the message
      await db.createNotification(
        ctx.user.id,
        "motivational",
        "Mensagem do Arquiteto",
        message
      );

      return { message };
    }),
});
