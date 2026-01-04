import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = trpc.community.getLeaderboard.useQuery({ limit: 50 });
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  if (isLoading) {
    return <div className="text-center text-white p-8">Carregando Ranking...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <style>{`
        .leaderboard-container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .leaderboard-header {
          text-align: center;
          margin-bottom: 30px;
          font-family: 'Orbitron', monospace;
        }

        .leaderboard-header h1 {
          font-size: 2.5rem;
          color: #00ccff;
          margin-bottom: 10px;
          letter-spacing: 2px;
        }

        .leaderboard-table {
          background: rgba(10, 25, 50, 0.9);
          border: 2px solid #00ccff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 0 30px rgba(0, 204, 255, 0.3);
        }

        .table-header {
          background: rgba(0, 204, 255, 0.2);
          border-bottom: 2px solid #00ccff;
          padding: 15px;
          display: grid;
          grid-template-columns: 50px 200px 100px 100px 100px 150px;
          gap: 15px;
          font-weight: bold;
          font-family: 'Orbitron', monospace;
          text-transform: uppercase;
          font-size: 0.9rem;
        }

        .table-row {
          padding: 15px;
          display: grid;
          grid-template-columns: 50px 200px 100px 100px 100px 150px;
          gap: 15px;
          border-bottom: 1px solid rgba(0, 204, 255, 0.2);
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .table-row:hover {
          background: rgba(0, 204, 255, 0.1);
        }

        .rank-badge {
          font-size: 1.2rem;
          font-weight: bold;
          color: #00ccff;
          text-align: center;
        }

        .rank-1 {
          color: #ffd700;
        }

        .rank-2 {
          color: #c0c0c0;
        }

        .rank-3 {
          color: #cd7f32;
        }

        .player-name {
          font-weight: bold;
          color: #ffffff;
        }

        .stat-cell {
          text-align: center;
        }

        .level-badge {
          background: rgba(0, 204, 255, 0.3);
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: bold;
        }

        .xp-bar {
          background: #333;
          height: 6px;
          border-radius: 3px;
          overflow: hidden;
          margin-top: 4px;
        }

        .xp-fill {
          background: linear-gradient(90deg, #44ff44, #66ff66);
          height: 100%;
          width: 60%;
        }

        .attributes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 10px;
        }

        .attr-item {
          background: rgba(0, 204, 255, 0.1);
          padding: 6px;
          border-radius: 4px;
          text-align: center;
          font-size: 0.8rem;
        }

        .attr-label {
          color: #00ccff;
          font-weight: bold;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: rgba(10, 25, 50, 0.95);
          border: 2px solid #00ccff;
          border-radius: 8px;
          padding: 30px;
          max-width: 500px;
          box-shadow: 0 0 50px rgba(0, 204, 255, 0.5);
        }

        .modal-header {
          font-size: 1.5rem;
          color: #00ccff;
          margin-bottom: 20px;
          font-family: 'Orbitron', monospace;
        }

        .close-btn {
          background: none;
          border: none;
          color: #00ccff;
          font-size: 1.5rem;
          cursor: pointer;
          float: right;
        }

        @media (max-width: 768px) {
          .table-header,
          .table-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h1>⚔️ RANKING GLOBAL</h1>
          <p>Os Maiores Guerreiros do Sistema</p>
        </div>

        <div className="leaderboard-table">
          <div className="table-header">
            <div>#</div>
            <div>JOGADOR</div>
            <div>NÍVEL</div>
            <div>XP</div>
            <div>ATRIBUTOS</div>
            <div>STREAK</div>
          </div>

          {leaderboard?.map((player, index) => (
            <div 
              key={player.id} 
              className="table-row"
              onClick={() => setSelectedPlayer(player)}
            >
              <div className={`rank-badge rank-${index + 1}`}>
                {index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
              </div>
              <div className="player-name">{player.name || `Jogador #${player.id}`}</div>
              <div className="stat-cell">
                <div className="level-badge">Lv. {player.level}</div>
              </div>
              <div className="stat-cell">
                <div>{player.xp}</div>
                <div className="xp-bar">
                  <div className="xp-fill"></div>
                </div>
              </div>
              <div className="stat-cell">
                <div style={{ fontSize: '0.8rem' }}>
                  STR: {player.strength} | INT: {player.intelligence}
                </div>
              </div>
              <div className="stat-cell">
                🔥 {player.currentStreak}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPlayer && (
        <div className="modal-overlay" onClick={() => setSelectedPlayer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPlayer(null)}>✕</button>
            <div className="modal-header">
              {selectedPlayer.name || `Jogador #${selectedPlayer.id}`}
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>Nível:</strong> {selectedPlayer.level}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>XP Total:</strong> {selectedPlayer.xp}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Streak Atual:</strong> 🔥 {selectedPlayer.currentStreak} dias
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <strong>Atributos:</strong>
              <div className="attributes-grid">
                <div className="attr-item">
                  <div className="attr-label">STR</div>
                  <div>{selectedPlayer.strength}</div>
                </div>
                <div className="attr-item">
                  <div className="attr-label">VIT</div>
                  <div>{selectedPlayer.vitality}</div>
                </div>
                <div className="attr-item">
                  <div className="attr-label">AGI</div>
                  <div>{selectedPlayer.agility}</div>
                </div>
                <div className="attr-item">
                  <div className="attr-label">INT</div>
                  <div>{selectedPlayer.intelligence}</div>
                </div>
                <div className="attr-item">
                  <div className="attr-label">WIS</div>
                  <div>{selectedPlayer.wisdom}</div>
                </div>
                <div className="attr-item">
                  <div className="attr-label">LUK</div>
                  <div>{selectedPlayer.luck}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
