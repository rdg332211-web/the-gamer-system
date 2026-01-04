import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

export default function StatusWindow() {
  const { data: status, isLoading } = trpc.player.getStatus.useQuery();
  const [displayXp, setDisplayXp] = useState(0);

  useEffect(() => {
    if (status?.xp) {
      setDisplayXp(status.xp);
    }
  }, [status?.xp]);

  if (isLoading) {
    return <div className="text-center text-white">Carregando Status...</div>;
  }

  if (!status) {
    return <div className="text-center text-white">Erro ao carregar status</div>;
  }

  const xpPercentage = (displayXp / status.xpToNextLevel) * 100;
  const hpPercentage = (status.hp / status.maxHp) * 100;
  const mpPercentage = (status.mp / status.maxMp) * 100;

  return (
    <div className="status-window">
      <style>{`
        .status-window {
          background: rgba(10, 25, 50, 0.9);
          border: 3px solid #00ccff;
          border-radius: 8px;
          padding: 20px;
          max-width: 400px;
          margin: 0 auto;
          box-shadow: 0 0 30px rgba(0, 204, 255, 0.3);
          color: #ffffff;
          font-family: 'Roboto', sans-serif;
          position: relative;
        }

        .status-window::before {
          content: '';
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          bottom: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          pointer-events: none;
        }

        .header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #00ccff;
          padding-bottom: 10px;
          font-family: 'Orbitron', monospace;
          letter-spacing: 2px;
        }

        .header h1 {
          margin: 0;
          font-size: 1.8rem;
          text-transform: uppercase;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .bar-container {
          margin-bottom: 15px;
        }

        .bar-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          margin-bottom: 3px;
          color: #00ccff;
        }

        .bar {
          height: 12px;
          background: #333;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #555;
        }

        .bar-fill {
          height: 100%;
          transition: width 0.5s ease;
        }

        .hp-fill {
          background: linear-gradient(90deg, #ff4444, #ff6666);
          box-shadow: 0 0 10px #ff4444;
        }

        .mp-fill {
          background: linear-gradient(90deg, #4444ff, #6666ff);
          box-shadow: 0 0 10px #4444ff;
        }

        .xp-fill {
          background: linear-gradient(90deg, #44ff44, #66ff66);
          box-shadow: 0 0 10px #44ff44;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 15px;
        }

        .stat-item {
          background: rgba(255, 255, 255, 0.1);
          padding: 8px;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          border: 1px solid rgba(0, 204, 255, 0.3);
        }

        .stat-name {
          color: #00ccff;
          font-weight: bold;
          font-family: 'Orbitron', monospace;
        }

        .stat-value {
          color: #ffffff;
        }

        .divider {
          height: 1px;
          background: #00ccff;
          margin: 15px 0;
          opacity: 0.5;
        }

        .streak-info {
          text-align: center;
          font-size: 0.9rem;
          margin-top: 15px;
          padding: 10px;
          background: rgba(0, 204, 255, 0.1);
          border-radius: 4px;
        }
      `}</style>

      <div className="header">
        <h1>STATUS WINDOW</h1>
      </div>

      <div className="info-row">
        <span>NOME: {status.name || "JOGADOR"}</span>
        <span>LVL: {status.level}</span>
      </div>

      <div className="bar-container">
        <div className="bar-label">
          <span>HP</span>
          <span>{status.hp} / {status.maxHp}</span>
        </div>
        <div className="bar">
          <div className="bar-fill hp-fill" style={{ width: `${hpPercentage}%` }}></div>
        </div>
      </div>

      <div className="bar-container">
        <div className="bar-label">
          <span>MP</span>
          <span>{status.mp} / {status.maxMp}</span>
        </div>
        <div className="bar">
          <div className="bar-fill mp-fill" style={{ width: `${mpPercentage}%` }}></div>
        </div>
      </div>

      <div className="bar-container">
        <div className="bar-label">
          <span>XP</span>
          <span>{displayXp} / {status.xpToNextLevel}</span>
        </div>
        <div className="bar">
          <div className="bar-fill xp-fill" style={{ width: `${xpPercentage}%` }}></div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-name">STR</span>
          <span className="stat-value">{status.attributes.strength}</span>
        </div>
        <div className="stat-item">
          <span className="stat-name">VIT</span>
          <span className="stat-value">{status.attributes.vitality}</span>
        </div>
        <div className="stat-item">
          <span className="stat-name">AGI</span>
          <span className="stat-value">{status.attributes.agility}</span>
        </div>
        <div className="stat-item">
          <span className="stat-name">INT</span>
          <span className="stat-value">{status.attributes.intelligence}</span>
        </div>
        <div className="stat-item">
          <span className="stat-name">WIS</span>
          <span className="stat-value">{status.attributes.wisdom}</span>
        </div>
        <div className="stat-item">
          <span className="stat-name">LUK</span>
          <span className="stat-value">{status.attributes.luck}</span>
        </div>
      </div>

      <div className="streak-info">
        <strong>STREAK ATUAL:</strong> {status.streak.current} dias
        <br />
        <strong>MAIOR STREAK:</strong> {status.streak.longest} dias
      </div>
    </div>
  );
}
