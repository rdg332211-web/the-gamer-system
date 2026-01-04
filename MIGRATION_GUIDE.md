# Guia de Migração - The Gamer System

Este documento contém todas as informações necessárias para você migrar o projeto para uma nova conta e continuar exatamente de onde paramos.

## 1. Repositório GitHub
O código atualizado com todas as correções de build e login está em:
`https://github.com/rdg332211-web/the-gamer-system`

## 2. Variáveis de Ambiente (Vercel)
Ao criar o projeto na nova conta da Vercel, você **precisa** configurar as seguintes variáveis de ambiente (Environment Variables):

| Nome | Valor | Descrição |
| :--- | :--- | :--- |
| `VITE_OAUTH_PORTAL_URL` | `https://manus.im` | URL do portal de autenticação |
| `VITE_APP_ID` | `MsXqrr9TTZoXdx4hdUZrJE` | ID do seu aplicativo no Manus |
| `OAUTH_SERVER_URL` | `https://manus.im` | URL do servidor OAuth |
| `DATABASE_URL` | `mysql://u6f9797307_rdg:Rodrigo332211@195.179.239.11:3306/u6f9797307_gamer_system` | Sua conexão TiDB Cloud |
| `JWT_SECRET` | `(Gere uma senha aleatória)` | Chave para segurança das sessões |
| `NODE_ENV` | `production` | Define o ambiente como produção |

## 3. Configurações de Build na Vercel
O projeto já está configurado para usar **pnpm**. A Vercel deve detectar isso automaticamente, mas caso precise:
- **Framework Preset:** Vite
- **Build Command:** `pnpm run build`
- **Install Command:** `pnpm install`

## 4. O que foi corrigido e está pronto:
- **Build Error:** Resolvido o conflito de versões do Vite (fixado na v5.4.11).
- **Login Crash:** Adicionada proteção e limpeza (`trim`) nas URLs de login para evitar erros no iPhone/Chrome.
- **Estrutura:** Arquivo `.npmrc` adicionado para garantir que a Vercel instale as dependências corretamente.

## 5. Próximos Passos na Nova Conta:
1. Importe o repositório do GitHub na nova conta Vercel.
2. Adicione as variáveis de ambiente listadas acima.
3. O deploy deve funcionar automaticamente de primeira!

---
*Documento gerado pelo Manus para garantir a continuidade do projeto.*
