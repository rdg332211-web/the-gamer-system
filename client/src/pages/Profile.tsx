import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function Profile() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = trpc.playerStats.getStats.useQuery();
  const { data: rewards, isLoading: rewardsLoading } = trpc.weeklyRewards.getHistory.useQuery({ limit: 10 });
  const [activeTab, setActiveTab] = useState<"stats" | "rewards" | "achievements">("stats");

  if (statsLoading) {
    return <div className="text-center text-white p-8">Carregando Perfil...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <style>{`
        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .profile-header {
          background: rgba(10, 25, 50, 0.9);
          border: 2px solid #00ccff;
          border-radius: 8px;
          padding: 30px;
          margin-bottom: 30px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          align-items: center;
        }

        .profile-avatar {
          text-align: center;
        }

        .avatar-circle {
          width: 150px;
          height: 150px;
          background: linear-gradient(135deg, #00ccff, #0099cc);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          margin: 0 auto;
          box-shadow: 0 0 30px rgba(0, 204, 255, 0.5);
        }

        .profile-info h1 {
          font-size: 2.5rem;
          color: #00ccff;
          margin-bottom: 10px;
          font-family: 'Orbitron', monospace;
        }

        .profile-info p {
          color: #aaa;
          margin-bottom: 5px;
        }

        .level-badge {
          display: inline-block;
          background: rgba(0, 204, 255, 0.3);
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: bold;
          margin-top: 10px;
          border: 1px solid #00ccff;
        }

        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 2px solid #00ccff;
        }

        .tab-btn {
          background: none;
          border: none;
          color: #00ccff;
          padding: 10px 20px;
          cursor: pointer;
          font-size: 1rem;
          font-family: 'Orbitron', monospace;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }

        .tab-btn.active {
          border-bottom-color: #00ccff;
          background: rgba(0, 204, 255, 0.1);
        }

        .tab-content {
          background: rgba(10, 25, 50, 0.9);
          border: 2px solid #00ccff;
          border-radius: 8px;
          padding: 30px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: rgba(0, 204, 255, 0.1);
          border: 1px solid #00ccff;
          border-radius: 4px;
          padding: 20px;
          text-align: center;
        }

        .stat-label {
          color: #00ccff;
          font-size: 0.9rem;
          margin-bottom: 10px;
          font-family: 'Orbitron', monospace;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #ffffff;
        }

        .attributes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .attribute-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(0, 204, 255, 0.3);
          border-radius: 4px;
          padding: 15px;
          text-align: center;
        }

        .attribute-name {
          color: #00ccff;
          font-weight: bold;
          margin-bottom: 8px;
          font-family: 'Orbitron', monospace;
        }

        .attribute-value {
          font-size: 1.5rem;
          color: #ffffff;
        }

        .rewards-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .reward-item {
          background: rgba(0, 204, 255, 0.1);
          border: 1px solid #00ccff;
          border-radius: 4px;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .reward-week {
          font-weight: bold;
          color: #00ccff;
        }

        .reward-xp {
          color: #44ff44;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .profile-header {
            grid-template-columns: 1fr;
          }

          .stats-grid,
          .attributes-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">⚔️</div>
          </div>
          <div className="profile-info">
            <h1>{user?.name || "Jogador Desconhecido"}</h1>
            <p>ID: {user?.id}</p>
            <p>Membro desde: {stats?.joinedAt ? new Date(stats.joinedAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
            <div className="level-badge">
              Nível {stats?.level} | {stats?.xp} XP
            </div>
          </div>
        </div>

        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            ESTATÍSTICAS
          </button>
          <button 
            className={`tab-btn ${activeTab === "rewards" ? "active" : ""}`}
            onClick={() => setActiveTab("rewards")}
          >
            RECOMPENSAS
          </button>
          <button 
            className={`tab-btn ${activeTab === "achievements" ? "active" : ""}`}
            onClick={() => setActiveTab("achievements")}
          >
            CONQUISTAS
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "stats" && (
            <div>
              <h2 style={{ marginBottom: "20px", color: "#00ccff", fontFamily: "'Orbitron', monospace" }}>
                STATUS GERAL
              </h2>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">VIDA (HP)</div>
                  <div className="stat-value">{stats?.hp}/{stats?.maxHp}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">MANA (MP)</div>
                  <div className="stat-value">{stats?.mp}/{stats?.maxMp}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">STREAK</div>
                  <div className="stat-value">🔥 {stats?.streak.current}</div>
                </div>
              </div>

              <h3 style={{ marginTop: "30px", marginBottom: "15px", color: "#00ccff", fontFamily: "'Orbitron', monospace" }}>
                ATRIBUTOS
              </h3>
              <div className="attributes-grid">
                <div className="attribute-item">
                  <div className="attribute-name">STR</div>
                  <div className="attribute-value">{stats?.attributes.strength}</div>
                </div>
                <div className="attribute-item">
                  <div className="attribute-name">VIT</div>
                  <div className="attribute-value">{stats?.attributes.vitality}</div>
                </div>
                <div className="attribute-item">
                  <div className="attribute-name">AGI</div>
                  <div className="attribute-value">{stats?.attributes.agility}</div>
                </div>
                <div className="attribute-item">
                  <div className="attribute-name">INT</div>
                  <div className="attribute-value">{stats?.attributes.intelligence}</div>
                </div>
                <div className="attribute-item">
                  <div className="attribute-name">WIS</div>
                  <div className="attribute-value">{stats?.attributes.wisdom}</div>
                </div>
                <div className="attribute-item">
                  <div className="attribute-name">LUK</div>
                  <div className="attribute-value">{stats?.attributes.luck}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "rewards" && (
            <div>
              <h2 style={{ marginBottom: "20px", color: "#00ccff", fontFamily: "'Orbitron', monospace" }}>
                HISTÓRICO DE RECOMPENSAS SEMANAIS
              </h2>
              
              {rewardsLoading ? (
                <div>Carregando recompensas...</div>
              ) : rewards && rewards.length > 0 ? (
                <div className="rewards-list">
                  {rewards.map((reward: any) => (
                    <div key={reward.id} className="reward-item">
                      <div>
                        <div className="reward-week">
                          Semana {reward.week} de {reward.year}
                        </div>
                        <div style={{ fontSize: "0.9rem", color: "#aaa", marginTop: "5px" }}>
                          {reward.questsCompleted} missões completadas
                        </div>
                      </div>
                      <div>
                        <div className="reward-xp">+{reward.bonusXp} XP</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: "#aaa" }}>Nenhuma recompensa semanal ainda.</div>
              )}
            </div>
          )}

          {activeTab === "achievements" && (
            <div>
              <h2 style={{ marginBottom: "20px", color: "#00ccff", fontFamily: "'Orbitron', monospace" }}>
                CONQUISTAS DESBLOQUEADAS
              </h2>
              <div style={{ color: "#aaa" }}>
                As conquistas serão desbloqueadas conforme você progride no jogo.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
