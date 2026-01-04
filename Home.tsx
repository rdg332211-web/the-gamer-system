import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import StatusWindow from "@/components/StatusWindow";
import DailyQuestsPanel from "@/components/DailyQuestsPanel";
import ChatBubble from "@/components/ChatBubble";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-white text-center">
          <div className="animate-spin mb-4">⚙️</div>
          <p>Inicializando o Sistema...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
        <style>{`
          @keyframes glow {
            0%, 100% { text-shadow: 0 0 10px rgba(0, 204, 255, 0.5); }
            50% { text-shadow: 0 0 20px rgba(0, 204, 255, 0.8); }
          }
          
          .glow-text {
            animation: glow 2s ease-in-out infinite;
          }
        `}</style>
        
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-5xl font-bold mb-4 glow-text">THE GAMER SYSTEM</h1>
          <p className="text-xl text-cyan-300 mb-8">Transforme sua vida em um RPG</p>
          <p className="text-gray-300 mb-12 text-lg">
            Cumpra missões diárias, evolua seus atributos e suba de nível enquanto melhora seus hábitos pessoais.
          </p>
          
          <a href={getLoginUrl()}>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-8 py-6 text-lg">
              INICIAR SISTEMA
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <ChatBubble />
      <style>{`
        body {
          background-color: #0a0a0a;
        }
        
        .header-nav {
          background: rgba(10, 25, 50, 0.9);
          border-bottom: 2px solid #00ccff;
          padding: 15px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-title {
          font-family: 'Orbitron', monospace;
          font-size: 1.5rem;
          letter-spacing: 2px;
          color: #00ccff;
        }

        .nav-buttons {
          display: flex;
          gap: 10px;
        }

        .nav-btn {
          background: rgba(0, 204, 255, 0.2);
          border: 1px solid #00ccff;
          color: #00ccff;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Orbitron', monospace;
        }

        .nav-btn:hover {
          background: rgba(0, 204, 255, 0.4);
          transform: translateY(-2px);
        }

        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .welcome-text {
          text-align: center;
          margin-bottom: 30px;
          font-family: 'Orbitron', monospace;
        }

        .welcome-text h2 {
          font-size: 2rem;
          color: #00ccff;
          margin-bottom: 10px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="header-nav">
        <div className="nav-title">⚔️ THE GAMER SYSTEM</div>
        <div className="nav-buttons">
          <a href="/leaderboard" style={{ textDecoration: 'none' }}>
            <button className="nav-btn">RANKING</button>
          </a>
          <a href="/profile" style={{ textDecoration: 'none' }}>
            <button className="nav-btn">PERFIL</button>
          </a>
          <a href="/custom-quests" style={{ textDecoration: 'none' }}>
            <button className="nav-btn">MISSÕES</button>
          </a>
          <button className="nav-btn" onClick={() => logout()}>LOGOUT</button>
        </div>
      </div>

      <div className="main-content">
        <div className="welcome-text">
          <h2>Bem-vindo, {user?.name || "Jogador"}!</h2>
          <p>Seu Sistema foi ativado. Prepare-se para evoluir.</p>
        </div>

        <div className="content-grid">
          <div>
            <StatusWindow />
          </div>
          <div>
            <DailyQuestsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
