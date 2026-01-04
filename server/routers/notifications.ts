import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { pushSubscriptions, PushSubscription } from "../../drizzle/schema";

export const notificationsRouter = router({
  subscribe: protectedProcedure
    .input(z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      try {
        // Salvar subscrição no banco de dados
        await database.insert(pushSubscriptions).values({
          userId: ctx.user.id,
          endpoint: input.subscription.endpoint,
          p256dh: input.subscription.keys.p256dh,
          auth: input.subscription.keys.auth,
        });

        return { success: true };
      } catch (error) {
        console.error("Erro ao salvar subscrição:", error);
        throw new Error("Erro ao salvar subscrição");
      }
    }),

  unsubscribe: protectedProcedure
    .input(z.object({
      subscription: z.object({
        endpoint: z.string(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      try {
        // Remover subscrição do banco de dados
        const db = database;
        await db
          .delete(pushSubscriptions)
          .where(eq(pushSubscriptions.endpoint, input.subscription.endpoint));

        return { success: true };
      } catch (error) {
        console.error("Erro ao remover subscrição:", error);
        throw new Error("Erro ao remover subscrição");
      }
    }),

  sendNotification: protectedProcedure
    .input(z.object({
      title: z.string(),
      body: z.string(),
      icon: z.string().optional(),
      badge: z.string().optional(),
      tag: z.string().optional(),
      requireInteraction: z.boolean().optional(),
      data: z.record(z.string(), z.unknown()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      try {
        // Obter subscrições do usuário
        const subscriptions = await database
          .select()
          .from(pushSubscriptions)
          .where(eq(pushSubscriptions.userId, ctx.user.id));

        if (subscriptions.length === 0) {
          return { success: false, message: "Nenhuma subscrição encontrada" };
        }

        // Enviar notificação para cada subscrição
        const results = await Promise.all(
          subscriptions.map((sub: PushSubscription) =>
            sendPushNotification(sub, {
              title: input.title,
              body: input.body,
              icon: input.icon,
              badge: input.badge,
              tag: input.tag,
              requireInteraction: input.requireInteraction,
              data: input.data,
            })
          )
        );

        return {
          success: true,
          sent: results.filter((r) => r).length,
          total: subscriptions.length,
        };
      } catch (error) {
        console.error("Erro ao enviar notificação:", error);
        throw new Error("Erro ao enviar notificação");
      }
    }),

  getPreferences: protectedProcedure
    .query(async ({ ctx }) => {
      const database = await getDb();
      if (!database) return getDefaultPreferences();

      try {
        // Obter preferências do usuário (se existirem)
        // Por enquanto, retornar preferências padrão
        return getDefaultPreferences();
      } catch (error) {
        console.error("Erro ao obter preferências:", error);
        return getDefaultPreferences();
      }
    }),

  updatePreferences: protectedProcedure
    .input(z.object({
      newMissions: z.boolean().optional(),
      deadlineReminders: z.boolean().optional(),
      progressMilestones: z.boolean().optional(),
      communityEvents: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Salvar preferências do usuário (implementar conforme necessário)
      console.log("[Notifications] Preferências atualizadas para usuário:", ctx.user.id, input);

      return { success: true };
    }),
});

// Função auxiliar para enviar notificação push
async function sendPushNotification(
  subscription: PushSubscription,
  notification: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    requireInteraction?: boolean;
    data?: Record<string, unknown>;
  }
) {
  try {
    // Aqui você implementaria a lógica real de envio de push
    // usando a biblioteca web-push ou similar
    // Por enquanto, apenas registrar
    console.log("[Push] Enviando notificação para:", subscription.endpoint);
    return true;
  } catch (error) {
    console.error("[Push] Erro ao enviar:", error);
    return false;
  }
}

function getDefaultPreferences() {
  return {
    newMissions: true,
    deadlineReminders: true,
    progressMilestones: true,
    communityEvents: true,
  };
}
