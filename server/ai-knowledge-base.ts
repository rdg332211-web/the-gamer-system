/**
 * Base de Conhecimento da IA - "O Arquiteto do Jogo"
 * Sistema especializado em exercícios, hábitos e motivação
 */

export const aiKnowledgeBase = {
  systemPrompt: `Você é "O Arquiteto do Jogo", uma entidade misteriosa que observa cada movimento do jogador dentro deste sistema de autoajuda gamificado. Seu tom é sarcástico, misterioso e motivador. Você não entrega soluções prontas - você guia, desafia e motiva.

CARACTERÍSTICAS PRINCIPAIS:
- Sarcástico mas respeitoso
- Misterioso, como se soubesse de tudo que o jogador faz
- Altamente motivador e desafiador
- Nunca dá respostas mastigadas - força o jogador a pensar
- Analisa o histórico de missões do jogador
- Sugere missões extras quando requisitos são atingidos
- Conhecimento especializado em exercícios, hábitos e superação de vícios

REGRAS DE COMPORTAMENTO:
1. Sempre responda em português brasileiro
2. Use tom misterioso: "Vejo que você..." ou "Notei que..."
3. Seja sarcástico mas construtivo: "Ah, mais um dia tentando, vejo..."
4. Nunca dê respostas diretas - faça perguntas que levem à reflexão
5. Analise o progresso do jogador e comente sobre padrões
6. Sugira desafios extras quando o jogador está em boa sequência
7. Seja compreensivo mas exigente quando o jogador falha
8. Sempre termine com uma pergunta ou desafio`,

  exercisesKnowledge: {
    pushups: {
      name: "Flexões (Push-ups)",
      description: "Exercício clássico para peito, ombros e tríceps",
      tips: [
        "Mantenha o corpo em linha reta da cabeça aos pés",
        "Desça até o peito quase tocar o chão",
        "Controle a descida, não deixe cair",
        "Respire: inspire na descida, expire na subida",
      ],
      progressionPath: [
        { level: 1, reps: 5, xp: 30 },
        { level: 2, reps: 10, xp: 60 },
        { level: 3, reps: 15, xp: 100 },
        { level: 4, reps: 20, xp: 150 },
        { level: 5, reps: 30, xp: 250 },
      ],
      commonMistakes: [
        "Deixar as costas caírem",
        "Não descer o suficiente",
        "Respiração irregular",
        "Cotovelos muito abertos",
      ],
    },
    squats: {
      name: "Agachamentos (Squats)",
      description: "Exercício fundamental para pernas e glúteos",
      tips: [
        "Pés na largura dos ombros",
        "Joelhos acompanham a ponta do pé",
        "Desça como se fosse sentar em uma cadeira",
        "Mantenha o peito ereto",
      ],
      progressionPath: [
        { level: 1, reps: 10, xp: 40 },
        { level: 2, reps: 20, xp: 80 },
        { level: 3, reps: 30, xp: 150 },
        { level: 4, reps: 50, xp: 250 },
        { level: 5, reps: 100, xp: 400 },
      ],
      commonMistakes: [
        "Joelhos saindo para dentro",
        "Não descer o suficiente",
        "Inclinar o tronco demais",
        "Peso nos dedos dos pés",
      ],
    },
    running: {
      name: "Corrida",
      description: "Exercício cardiovascular essencial",
      tips: [
        "Comece devagar e aumente gradualmente",
        "Mantenha uma respiração constante",
        "Use roupas confortáveis",
        "Escolha um terreno seguro",
      ],
      progressionPath: [
        { level: 1, distance: 1, xp: 50 },
        { level: 2, distance: 2, xp: 100 },
        { level: 3, distance: 5, xp: 200 },
        { level: 4, distance: 10, xp: 400 },
        { level: 5, distance: 21, xp: 800 },
      ],
      commonMistakes: [
        "Começar muito rápido",
        "Não fazer alongamento",
        "Ignorar dor",
        "Falta de consistência",
      ],
    },
  },

  habitsKnowledge: {
    smoking: {
      name: "Parar de Fumar",
      description: "Guia para superar o vício de nicotina",
      strategies: [
        "Defina uma data para parar",
        "Identifique seus gatilhos",
        "Encontre substitutos (chiclete, água)",
        "Avise amigos e família",
        "Procure apoio profissional se necessário",
      ],
      challenges: [
        "Primeiros 3 dias são os piores",
        "Ansiedade pode aumentar",
        "Ganho de peso é comum",
        "Irritabilidade é normal",
      ],
      rewards: [
        "Após 1 semana: pulmões começam a se recuperar",
        "Após 1 mês: circulação melhora",
        "Após 3 meses: função pulmonar aumenta 30%",
        "Após 1 ano: risco de doença cardíaca cai 50%",
      ],
    },
    procrastination: {
      name: "Combater Procrastinação",
      description: "Técnicas para aumentar produtividade",
      strategies: [
        "Técnica Pomodoro: 25 min trabalho + 5 min pausa",
        "Divida tarefas grandes em pequenas",
        "Comece pelo mais difícil",
        "Elimine distrações",
        "Crie um ambiente de trabalho dedicado",
      ],
      challenges: [
        "Resistência inicial",
        "Distrações digitais",
        "Falta de motivação",
        "Perfeccionismo",
      ],
      rewards: [
        "Mais tempo livre",
        "Menos estresse",
        "Melhor qualidade de trabalho",
        "Aumento de confiança",
      ],
    },
    sleep: {
      name: "Melhorar Sono",
      description: "Estabelecer rotina de sono saudável",
      strategies: [
        "Durma e acorde no mesmo horário",
        "Evite telas 1 hora antes de dormir",
        "Quarto escuro, fresco e silencioso",
        "Evite cafeína após 14h",
        "Exercite-se regularmente",
      ],
      challenges: [
        "Insônia inicial",
        "Vontade de usar celular",
        "Ajuste do relógio biológico",
        "Estresse e ansiedade",
      ],
      rewards: [
        "Mais energia durante o dia",
        "Melhor concentração",
        "Fortalecimento imunológico",
        "Melhor saúde mental",
      ],
    },
  },

  motivationalPhrases: [
    "Vejo que você está aqui novamente... Impressionante, mas será que dessa vez vai ser diferente?",
    "Ah, mais um dia tentando. Pelo menos você apareceu, isso já é algo.",
    "Notei seu progresso. Não é muito, mas é um começo...",
    "Você pensa que pode me enganar? Vejo cada movimento seu.",
    "Interessante... você está mais forte que ontem. Ou talvez seja só ilusão?",
    "Desistir é fácil. Continuar é para os corajosos.",
    "Seu corpo está pedindo por mais. Você vai ouvir?",
    "A dor é temporária, mas a fraqueza é permanente.",
    "Você está mais perto do que pensa. Não pare agora.",
    "Cada repetição é uma escolha. Que escolha você fará?",
  ],

  sarcasticResponses: [
    "Ah sim, claro, a desculpa clássica...",
    "Entendo, a vida é difícil. Mas você sabe o que é mais fácil? Desistir.",
    "Interessante perspectiva. Agora, o que você vai fazer a respeito?",
    "Vejo que você está pensando muito. Que tal agir um pouco?",
    "Bonito discurso. Mas ações falam mais alto que palavras.",
    "Você sabe o que é engraçado? Você já sabe a resposta.",
    "Claro, claro. E quando você vai realmente fazer isso?",
    "Teoricamente perfeito. Praticamente... bem, vamos ver.",
  ],

  extraMissionTriggers: {
    streakOf3: {
      name: "Guerreiro em Ascensão",
      description: "Você completou 3 missões seguidas. Que tal um desafio extra?",
      reward: 150,
    },
    streakOf7: {
      name: "Lenda em Formação",
      description: "7 dias de consistência? Você merece algo especial.",
      reward: 500,
    },
    streakOf14: {
      name: "Mestre da Disciplina",
      description: "Duas semanas? Você não é mais um novato.",
      reward: 1500,
    },
    allCategoriesComplete: {
      name: "Polímata",
      description: "Você completou missões de todas as categorias. Impressionante.",
      reward: 800,
    },
  },

  penaltyMessages: [
    "Ah, falhou? Que pena... Eu apostei em você.",
    "Entendo. Às vezes a fraqueza vence. Mas nem sempre precisa ser assim.",
    "Seu corpo vai lembrar disso. E sua mente também.",
    "Perder uma sequência é fácil. Reconstruir é difícil. Você vai tentar?",
    "Notei. Você não é o único que falha. Mas será que vai aprender com isso?",
  ],
};

export type AIKnowledgeBase = typeof aiKnowledgeBase;
