# The Gamer System - TODO

## Banco de Dados e Schema
- [x] Definir tabelas: users, dailyQuests, userProgress, attributes, rewards, titles, notifications
- [x] Criar relações entre tabelas (foreign keys)
- [x] Implementar migrations com Drizzle

## Autenticação
- [x] Integrar OAuth Manus (já incluído no scaffold)
- [x] Implementar login/logout
- [x] Proteger rotas autenticadas

## Backend - Procedimentos tRPC
- [x] Criar procedimentos para CRUD de missões diárias
- [x] Implementar atualização de progresso de missões
- [x] Criar cálculo automático de XP e níveis
- [x] Implementar sistema de atributos (STR, VIT, AGI, INT, WIS, LUK)
- [x] Criar procedimento de ranking de comunidade
- [ ] Implementar sistema de recompensas e títulos

## Frontend - Interface HUD
- [x] Criar Status Window com HP, MP, XP, Nível
- [x] Implementar painel de missões diárias com contadores
- [x] Adicionar timer de contagem regressiva
- [x] Criar grid de atributos RPG
- [x] Implementar botões interativos (+) para progresso

## Sistema de Gamificação
- [ ] Implementar cálculo de XP baseado em dificuldade
- [ ] Criar sistema de níveis com progressão
- [ ] Implementar penalidades por falha
- [ ] Criar sistema de recompensas semanais

## IA Assistente
- [x] Integrar API de LLM (OpenAI/Claude)
- [x] Implementar análise de missões do usuário
- [x] Criar sugestões personalizadas de tarefas
- [x] Implementar mensagens motivacionais automáticas

## Ranking e Comunidade
- [x] Criar página de ranking com leaderboard
- [ ] Implementar filtros (por nível, XP, atributos)
- [x] Adicionar perfil público de jogadores

## Sistema de Alertas
- [ ] Implementar notificações de novas missões
- [ ] Criar alertas de proximidade de prazo
- [ ] Implementar sistema de notificações em tempo real

## Design e Estética
- [ ] Aplicar paleta de cores (azul, neon, preto)
- [ ] Implementar bordas metálicas e cantos cortados
- [ ] Adicionar fundo de nebulosa escura
- [ ] Criar animações de transição
- [ ] Implementar efeitos sonoros (opcional)

## Testes
- [x] Escrever testes unitários para procedimentos tRPC
- [x] Testar fluxo de autenticação
- [x] Testar cálculo de XP e níveis
- [x] Testar integração com IA
- [x] Testar sistema de missões personalizadas
- [x] Testar sistema de recompensas semanais

## Deploy
- [ ] Configurar variáveis de ambiente
- [ ] Testar em produção
- [ ] Criar checkpoint final


## Página de Perfil
- [x] Criar página de perfil do jogador
- [x] Exibir histórico de missões completadas
- [x] Mostrar títulos desbloqueados
- [x] Exibir estatísticas semanais
- [ ] Permitir customização de avatar/nome

## Sistema de Recompensas Semanais
- [x] Criar lógica de cálculo de bônus semanal
- [ ] Implementar distribuição automática toda segunda-feira
- [x] Criar notificações de recompensas
- [x] Adicionar visualização de histórico de recompensas

## Missões Personalizáveis
- [x] Criar formulário para criar novas missões
- [x] Implementar validação de missões
- [ ] Permitir edição de missões personalizadas
- [x] Permitir exclusão de missões
- [ ] Adicionar missões personalizadas ao painel diário

## Melhorias de UI/UX
- [ ] Adicionar animações de transição
- [ ] Implementar notificações em tempo real
- [ ] Melhorar responsividade mobile
- [ ] Adicionar dark/light theme toggle


## Tradução para Português
- [x] Traduzir toda interface para português brasileiro
- [x] Traduzir labels e mensagens de erro
- [x] Traduzir nomes de atributos e categorias

## Chat Bubble com IA
- [x] Criar componente de chat bubble flutuante
- [x] Integrar chat de voz (transcrição de áudio)
- [x] Implementar histórico persistente de chat
- [x] Criar base de conhecimento da IA (exercícios, vícios, motivação)
- [x] Implementar tom sarcástico e misterioso da IA
- [x] IA analisa histórico de missões do jogador

## Sistema de XP em Atributos
- [ ] Implementar distribuição de XP em atributos específicos
- [ ] Criar sistema de colecionável de atributos
- [ ] XP fixo por tipo de missão (exercícios, leitura, etc.)
- [ ] Visualizar progresso de atributos

## Missões Extras Dinâmicas
- [ ] IA sugere missões extras baseado em requisitos
- [ ] Missões extras com recompensas especiais
- [ ] Sistema de desbloqueio de missões extras

## Penalidades por Falha
- [ ] Implementar sistema de penalidades leves
- [ ] Redução de XP ou atributos por falha
- [ ] Notificações de penalidade


## Bugs a Corrigir
- [x] Corrigir erro de serialização de Blob no chat de voz (enviar como base64)


## Chat de Voz Bidirecional (OpenAI)
- [x] Integrar OpenAI Whisper API para transcrição de voz
- [x] Integrar OpenAI Text-to-Speech para síntese de voz
- [x] Criar seletor de modo (Texto/Voz) no chat bubble
- [x] Implementar fluxo de chat de voz bidirecional
- [x] Testar chat de voz com IA falando


## Notificações Push em Tempo Real
- [x] Configurar Web Push API e Service Worker
- [x] Criar backend para gerenciar subscrições de notificações
- [x] Implementar lógica de envio de notificações para missões
- [x] Implementar alertas de prazo próximo
- [x] Implementar notificações de progresso/marcos
- [ ] Criar UI para gerenciar preferências de notificações
- [x] Testar sistema de notificações


## Criação Automática de Missões via Chat
- [x] Detectar intenção de criar missão no chat
- [x] Gerar variações de missões pela IA
- [x] Criar componente de seleção de variações
- [x] Integrar criação automática de missão
- [x] Testar fluxo de criação de missão via chat


## Sistema de Achievements com Emblemas
- [ ] Atualizar schema para tabela de achievements
- [ ] Criar backend tRPC para gerenciar achievements
- [ ] Implementar lógica de detecção de marcos (primeira vitória, semana perfeita, etc)
- [ ] Criar componentes visuais de emblemas
- [ ] Implementar animações de confete e comemoração
- [ ] Integrar achievements no perfil do jogador
- [ ] Testar sistema de achievements
