import * as db from "./server/db";
import { sdk } from "./server/_core/sdk";
import { ONE_YEAR_MS } from "./shared/const";

async function main() {
  const openId = "test-user-id";
  const name = "Jogador de Teste";
  
  console.log("Criando usuário de teste...");
  await db.upsertUser({
    openId,
    name,
    email: "test@example.com",
    loginMethod: "test",
    lastSignedIn: new Date(),
  });
  
  console.log("Gerando token de sessão...");
  const sessionToken = await sdk.createSessionToken(openId, {
    name,
    expiresInMs: ONE_YEAR_MS,
  });
  
  console.log("TOKEN_DE_SESSAO:" + sessionToken);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
