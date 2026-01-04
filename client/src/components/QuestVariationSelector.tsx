import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Zap } from "lucide-react";

interface QuestVariation {
  title: string;
  description: string;
  difficulty: number;
  xpReward: number;
  category: string;
}

interface QuestVariationSelectorProps {
  variations: QuestVariation[];
  onSelect: (variation: QuestVariation) => void;
  isLoading?: boolean;
}

export function QuestVariationSelector({
  variations,
  onSelect,
  isLoading = false,
}: QuestVariationSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "text-green-400";
      case 2:
        return "text-yellow-400";
      case 3:
        return "text-orange-400";
      case 4:
        return "text-red-400";
      case 5:
        return "text-purple-400";
      default:
        return "text-cyan-400";
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ["", "Fácil", "Médio", "Difícil", "Muito Difícil", "Extremo"];
    return labels[difficulty] || "Desconhecido";
  };

  return (
    <div className="w-full space-y-3 p-4 bg-slate-900 rounded-lg border border-cyan-500/30">
      <div className="text-cyan-400 font-semibold text-sm">
        ⚔️ Escolha uma variação da missão:
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {variations.map((variation, index) => (
          <Card
            key={index}
            className={`p-3 cursor-pointer transition-all border-2 ${
              selectedIndex === index
                ? "border-cyan-400 bg-cyan-900/20"
                : "border-slate-700 hover:border-cyan-400/50"
            }`}
            onClick={() => setSelectedIndex(index)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-cyan-300 text-sm truncate">
                    {variation.title}
                  </span>
                  <span
                    className={`text-xs font-bold ${getDifficultyColor(
                      variation.difficulty
                    )}`}
                  >
                    [{getDifficultyLabel(variation.difficulty)}]
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {variation.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span>📁 {variation.category}</span>
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Zap size={12} /> {variation.xpReward} XP
                  </span>
                </div>
              </div>
              {selectedIndex === index && (
                <CheckCircle className="text-cyan-400 flex-shrink-0" size={20} />
              )}
            </div>
          </Card>
        ))}
      </div>

      {selectedIndex !== null && (
        <Button
          onClick={() => onSelect(variations[selectedIndex])}
          disabled={isLoading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
        >
          {isLoading ? "Criando missão..." : "✓ Criar Missão"}
        </Button>
      )}
    </div>
  );
}
