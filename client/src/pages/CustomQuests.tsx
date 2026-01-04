import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function CustomQuests() {
  const { data: customQuests, refetch } = trpc.customQuests.list.useQuery();
  const createMutation = trpc.customQuests.create.useMutation();
  const deleteMutation = trpc.customQuests.delete.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "custom" as const,
    difficulty: "medium" as const,
    baseXp: 50,
    targetProgress: 1,
    unit: "completions",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    createMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({
          name: "",
          description: "",
          category: "custom",
          difficulty: "medium",
          baseXp: 50,
          targetProgress: 1,
          unit: "completions",
        });
        setShowForm(false);
        refetch();
      },
    });
  };

  const handleDelete = (questId: number) => {
    deleteMutation.mutate({ questId }, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <style>{`
        .custom-quests-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .header h1 {
          font-size: 2rem;
          color: #00ccff;
          font-family: 'Orbitron', monospace;
        }

        .btn-create {
          background: #00ccff;
          color: #000;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
        }

        .btn-create:hover {
          background: #00aaff;
          transform: translateY(-2px);
        }

        .form-container {
          background: rgba(10, 25, 50, 0.9);
          border: 2px solid #00ccff;
          border-radius: 8px;
          padding: 30px;
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #00ccff;
          font-weight: bold;
          font-family: 'Orbitron', monospace;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid #00ccff;
          border-radius: 4px;
          color: #fff;
          font-size: 1rem;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-buttons {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s;
        }

        .btn-submit {
          background: #00ccff;
          color: #000;
        }

        .btn-submit:hover {
          background: #00aaff;
        }

        .btn-cancel {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
        }

        .btn-cancel:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .quests-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .quest-card {
          background: rgba(10, 25, 50, 0.9);
          border: 2px solid #00ccff;
          border-radius: 8px;
          padding: 20px;
          position: relative;
        }

        .quest-card h3 {
          color: #00ccff;
          margin-bottom: 10px;
          font-family: 'Orbitron', monospace;
        }

        .quest-card p {
          color: #aaa;
          font-size: 0.9rem;
          margin-bottom: 15px;
        }

        .quest-meta {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-size: 0.85rem;
        }

        .quest-difficulty {
          padding: 4px 8px;
          border-radius: 4px;
          background: rgba(0, 204, 255, 0.2);
          color: #00ccff;
        }

        .quest-xp {
          color: #44ff44;
          font-weight: bold;
        }

        .quest-actions {
          display: flex;
          gap: 10px;
        }

        .btn-delete {
          background: rgba(255, 51, 51, 0.3);
          color: #ff3333;
          border: 1px solid #ff3333;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .btn-delete:hover {
          background: rgba(255, 51, 51, 0.5);
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #aaa;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .quests-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="custom-quests-container">
        <div className="header">
          <h1>MISSÕES PERSONALIZADAS</h1>
          <button className="btn-create" onClick={() => setShowForm(!showForm)}>
            {showForm ? "CANCELAR" : "+ CRIAR MISSÃO"}
          </button>
        </div>

        {showForm && (
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome da Missão</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Ex: Correr 5km"
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva a missão..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  >
                    <option value="exercise">Exercício</option>
                    <option value="learning">Aprendizado</option>
                    <option value="health">Saúde</option>
                    <option value="productivity">Produtividade</option>
                    <option value="custom">Customizado</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Dificuldade</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                  >
                    <option value="easy">Fácil</option>
                    <option value="medium">Médio</option>
                    <option value="hard">Difícil</option>
                    <option value="extreme">Extremo</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>XP Recompensado</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={formData.baseXp}
                    onChange={(e) => setFormData({ ...formData, baseXp: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Meta de Progresso</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.targetProgress}
                    onChange={(e) => setFormData({ ...formData, targetProgress: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Unidade (ex: reps, km, páginas)</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="Ex: reps, km, páginas"
                />
              </div>

              <div className="form-buttons">
                <button type="button" className="btn btn-cancel" onClick={() => setShowForm(false)}>
                  CANCELAR
                </button>
                <button type="submit" className="btn btn-submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "CRIANDO..." : "CRIAR MISSÃO"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div>
          {customQuests && customQuests.length > 0 ? (
            <div className="quests-list">
              {customQuests.map((quest: any) => (
                <div key={quest.id} className="quest-card">
                  <h3>{quest.name}</h3>
                  <p>{quest.description || "Sem descrição"}</p>
                  
                  <div className="quest-meta">
                    <span className="quest-difficulty">{quest.difficulty.toUpperCase()}</span>
                    <span className="quest-xp">+{quest.baseXp} XP</span>
                  </div>

                  <div style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "15px" }}>
                    Meta: {quest.targetProgress} {quest.unit}
                  </div>

                  <div className="quest-actions">
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(quest.id)}
                      disabled={deleteMutation.isPending}
                    >
                      DELETAR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Nenhuma missão personalizada criada ainda.</p>
              <p>Crie sua primeira missão clicando no botão acima!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
