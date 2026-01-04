import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Mic, Send, X, MessageCircle, Volume2 } from "lucide-react";
import { QuestVariationSelector } from "./QuestVariationSelector";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

interface QuestVariation {
  title: string;
  description: string;
  difficulty: number;
  xpReward: number;
  category: string;
}

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [chatMode, setChatMode] = useState<"text" | "voice">("text");
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [questVariations, setQuestVariations] = useState<QuestVariation[]>([]);
  const [showVariationSelector, setShowVariationSelector] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const sendVoiceMutation = trpc.chat.sendVoice.useMutation();
  const generateVariationsMutation = trpc.chat.generateQuestVariations.useMutation();
  const createQuestMutation = trpc.chat.createQuestFromChat.useMutation();
  const getHistoryQuery = trpc.chat.getHistory.useQuery({ limit: 50 });

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Carregar histórico de chat
  useEffect(() => {
    if (getHistoryQuery.data) {
      const formattedMessages = getHistoryQuery.data.map((msg) => ({
        id: msg.id?.toString() || Date.now().toString(),
        role: msg.role as "user" | "assistant",
        content: msg.content,
        timestamp: new Date(msg.createdAt || Date.now()),
      }));
      setMessages(formattedMessages);
    }
  }, [getHistoryQuery.data]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendMessageMutation.mutateAsync({
        message: messageText,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Detectar intenção de criar missão
      const createQuestKeywords = [
        "criar miss",
        "nova miss",
        "quero uma miss",
        "me cria uma miss",
        "cria uma miss",
        "quest",
        "desafio",
      ];
      const shouldGenerateVariations = createQuestKeywords.some((keyword) =>
        messageText.toLowerCase().includes(keyword)
      );

      if (shouldGenerateVariations) {
        // Gerar variações de missão
        const variations = await generateVariationsMutation.mutateAsync({
          questDescription: messageText,
        });
        setQuestVariations(variations.variations);
        setShowVariationSelector(true);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuestVariation = async (variation: QuestVariation) => {
    setIsLoading(true);
    try {
      const result = await createQuestMutation.mutateAsync({
        name: variation.title,
        description: variation.description,
        difficulty: (variation.difficulty === 1
          ? "easy"
          : variation.difficulty === 2
            ? "medium"
            : variation.difficulty === 3
              ? "hard"
              : "extreme") as any,
        baseXp: variation.xpReward,
        category: variation.category as any,
      });

      const successMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: `✅ ${result.message}\n\nSua nova missão foi adicionada ao painel de missões! Boa sorte, guerreiro!`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, successMessage]);
      setShowVariationSelector(false);
      setQuestVariations([]);
    } catch (error) {
      console.error("Erro ao criar missão:", error);
      const errorMessage: Message = {
        id: (Date.now() + 3).toString(),
        role: "assistant",
        content: "❌ Houve um erro ao criar a missão. Tente novamente!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-white hover:scale-110"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-96 h-[600px] bg-slate-900 border border-cyan-500/50 rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold">🎮 Arquiteto do Jogo</h3>
              <p className="text-cyan-100 text-xs">Sempre observando...</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.role === "user"
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-cyan-300 border border-cyan-500/30"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {showVariationSelector && questVariations.length > 0 && (
              <div className="flex justify-start">
                <QuestVariationSelector
                  variations={questVariations}
                  onSelect={handleSelectQuestVariation}
                  isLoading={isLoading}
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-cyan-500/30 p-3 space-y-2">
            {!showModeSelector && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-slate-800 border border-cyan-500/30 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 text-white p-2 rounded transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
