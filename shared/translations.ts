/**
 * Traduções para português brasileiro
 */

export const translations = {
  // Navegação
  nav: {
    ranking: "RANKING",
    perfil: "PERFIL",
    missoes: "MISSÕES",
    logout: "SAIR",
    home: "INÍCIO",
  },

  // Status Window
  status: {
    title: "JANELA DE STATUS",
    name: "NOME",
    level: "NÍVEL",
    hp: "VIDA",
    mp: "MANA",
    xp: "EXPERIÊNCIA",
    str: "FOR",
    vit: "VIT",
    agi: "AGI",
    int: "INT",
    wis: "SAB",
    luk: "SOR",
    streakCurrent: "SEQUÊNCIA ATUAL",
    streakLongest: "MAIOR SEQUÊNCIA",
  },

  // Missões
  quests: {
    title: "INFORMAÇÕES DE MISSÃO",
    daily: "Missão Diária",
    goal: "OBJETIVO",
    complete: "COMPLETAR MISSÃO",
    warning: "AVISO: Falhar em completar a missão diária resultará em uma penalidade apropriada.",
    completed: "MISSÃO COMPLETADA",
    failed: "MISSÃO FALHADA",
    customQuests: "MISSÕES PERSONALIZADAS",
    createNew: "+ CRIAR MISSÃO",
    cancel: "CANCELAR",
    create: "CRIAR MISSÃO",
    delete: "DELETAR",
    edit: "EDITAR",
    name: "Nome da Missão",
    description: "Descrição",
    category: "Categoria",
    difficultyLabel: "Dificuldade",
    xpReward: "XP Recompensado",
    targetProgress: "Meta de Progresso",
    unit: "Unidade",
    exercicio: "Exercício",
    aprendizado: "Aprendizado",
    saude: "Saúde",
    produtividade: "Produtividade",
    customizado: "Customizado",
    habitos: "Hábitos",
    vicios: "Vícios",
    facil: "Fácil",
    medio: "Médio",
    dificil: "Difícil",
    extremo: "Extremo",
  },

  // Perfil
  profile: {
    title: "PERFIL DO JOGADOR",
    stats: "ESTATÍSTICAS",
    rewards: "RECOMPENSAS",
    achievementsTab: "CONQUISTAS",
    generalStatus: "STATUS GERAL",
    attributes: "ATRIBUTOS",
    joinedAt: "Membro desde",
    lastSignedIn: "Último acesso",
    weeklyRewards: "HISTÓRICO DE RECOMPENSAS SEMANAIS",
    noRewards: "Nenhuma recompensa semanal ainda.",
    questsCompleted: "missões completadas",
    achievementsText: "As conquistas serão desbloqueadas conforme você progride no jogo.",
  },

  // Ranking
  leaderboard: {
    title: "RANKING DA COMUNIDADE",
    position: "POSIÇÃO",
    player: "JOGADOR",
    level: "NÍVEL",
    xp: "XP",
    streak: "SEQUÊNCIA",
    noPlayers: "Nenhum jogador no ranking ainda.",
  },

  // IA Chat
  chat: {
    title: "ARQUITETO DO JOGO",
    placeholder: "Digite sua mensagem...",
    send: "ENVIAR",
    voice: "VOZ",
    startVoice: "Iniciar Gravação",
    stopVoice: "Parar Gravação",
    transcribing: "Transcrevendo...",
    thinking: "Pensando...",
    noHistory: "Nenhuma conversa ainda. Comece a conversar!",
    clearHistory: "Limpar Histórico",
    confirmClear: "Tem certeza que deseja limpar o histórico?",
  },

  // Atributos e Distribuição
  attributes: {
    title: "DISTRIBUIÇÃO DE ATRIBUTOS",
    xpDistribution: "DISTRIBUIÇÃO DE XP",
    strength: "Força",
    vitality: "Vitalidade",
    agility: "Agilidade",
    intelligence: "Inteligência",
    wisdom: "Sabedoria",
    luck: "Sorte",
    gained: "ganho",
  },

  // Penalidades
  penalties: {
    title: "PENALIDADE",
    questFailed: "Missão Falhada",
    xpLoss: "XP Perdido",
    attributeLoss: "Atributo Reduzido",
    streakReset: "Sequência Resetada",
  },

  // Botões e Ações
  buttons: {
    save: "SALVAR",
    cancel: "CANCELAR",
    delete: "DELETAR",
    edit: "EDITAR",
    create: "CRIAR",
    submit: "ENVIAR",
    close: "FECHAR",
    back: "VOLTAR",
    next: "PRÓXIMO",
    previous: "ANTERIOR",
  },

  // Mensagens
  messages: {
    success: "Sucesso!",
    error: "Erro!",
    loading: "Carregando...",
    noData: "Nenhum dado disponível",
    confirmDelete: "Tem certeza que deseja deletar?",
    saved: "Salvo com sucesso!",
    deleted: "Deletado com sucesso!",
    created: "Criado com sucesso!",
  },

  // Tempo
  time: {
    days: "dias",
    hours: "horas",
    minutes: "minutos",
    seconds: "segundos",
    week: "Semana",
    month: "Mês",
    year: "Ano",
  },
};

export type TranslationKey = keyof typeof translations;
