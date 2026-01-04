import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

export default function DailyQuestsPanel() {
  const { data: quests, isLoading, refetch } = trpc.quests.getTodayQuests.useQuery();
  const updateProgressMutation = trpc.quests.updateProgress.useMutation();
  const completeQuestMutation = trpc.quests.completeQuest.useMutation();
  const failQuestMutation = trpc.quests.failQuest.useMutation();
  
  const [timeRemaining, setTimeRemaining] = useState<string>("23:59:59");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleProgressUpdate = (questId: number, currentProgress: number) => {
    updateProgressMutation.mutate({ questId, progress: currentProgress + 1 }, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleCompleteQuest = (questId: number) => {
    completeQuestMutation.mutate({ questId }, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  if (isLoading) {
    return <div className="text-center text-white">Carregando Missões...</div>;
  }

  return (
    <div className="quests-panel">
      <style>{`
        .quests-panel {
          background: rgba(10, 25, 50, 0.9);
          border: 3px solid #e0e0e0;
          border-radius: 8px;
          padding: 20px;
          max-width: 500px;
          margin: 20px auto;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
          color: #ffffff;
          font-family: 'Roboto', sans-serif;
          position: relative;
          clip-path: polygon(
            0% 5%, 5% 0%, 95% 0%, 100% 5%, 
            100% 95%, 95% 100%, 5% 100%, 0% 95%
          );
        }

        .quests-panel::before {
          content: '';
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          bottom: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          pointer-events: none;
        }

        .panel-header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 10px;
          font-family: 'Orbitron', monospace;
          letter-spacing: 2px;
        }

        .panel-header h2 {
          margin: 0;
          font-size: 1.5rem;
          text-transform: uppercase;
          border: 1px solid #e0e0e0;
          display: inline-block;
          padding: 5px 15px;
        }

        .sub-header {
          font-size: 0.8rem;
          margin-top: 10px;
          opacity: 0.9;
        }

        .goal-label {
          font-family: 'Orbitron', monospace;
          border: 1px solid #e0e0e0;
          display: inline-block;
          padding: 2px 15px;
          margin: 10px 0;
          font-size: 0.9rem;
        }

        .divider {
          height: 2px;
          background: #e0e0e0;
          margin: 15px 0;
        }

        .quests-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .quest-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          margin-bottom: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .quest-name {
          flex: 1;
          font-size: 0.95rem;
        }

        .quest-progress {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: 10px;
        }

        .progress-text {
          font-size: 0.85rem;
          color: #00ccff;
          font-weight: bold;
          min-width: 60px;
          text-align: right;
        }

        .add-btn {
          background: none;
          border: 1px solid #00ccff;
          color: #00ccff;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .add-btn:hover {
          background: rgba(0, 204, 255, 0.2);
          transform: scale(1.1);
        }

        .complete-btn {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.2s;
          margin-top: 15px;
          width: 100%;
        }

        .complete-btn:hover {
          background: #357abd;
          transform: translateY(-2px);
        }

        .footer-section {
          margin-top: 20px;
          text-align: center;
        }

        .warning {
          font-size: 0.75rem;
          line-height: 1.4;
          margin: 10px 0;
        }

        .warning span {
          color: #ff3333;
          font-weight: bold;
        }

        .timer {
          font-family: 'Orbitron', monospace;
          font-size: 2.5rem;
          text-align: center;
          margin-top: 15px;
          letter-spacing: 3px;
          color: #00ccff;
        }

        .quest-completed {
          opacity: 0.5;
          text-decoration: line-through;
        }

        .quest-failed {
          opacity: 0.3;
          background: rgba(255, 51, 51, 0.1) !important;
        }
      `}</style>

      <div className="panel-header">
        <h2>QUEST INFO</h2>
        <div className="sub-header">[Daily Quest: Player Training has arrived]</div>
        <div className="goal-label">GOAL</div>
      </div>

      <div className="divider"></div>

      <ul className="quests-list">
        {quests?.map((quest) => (
          <li key={quest.id} className={`quest-item ${quest.completed ? 'quest-completed' : ''} ${quest.failed ? 'quest-failed' : ''}`}>
            <span className="quest-name">{quest.name}</span>
            <div className="quest-progress">
              <span className="progress-text">[{quest.currentProgress}/{quest.targetProgress}]</span>
              <button 
                className="add-btn"
                onClick={() => handleProgressUpdate(quest.id, quest.currentProgress)}
                disabled={quest.completed || quest.failed}
              >
                +
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="divider"></div>

      <button className="complete-btn" onClick={() => {
        quests?.forEach(q => {
          if (!q.completed && !q.failed && q.currentProgress >= q.targetProgress) {
            handleCompleteQuest(q.id);
          }
        });
      }}>
        COMPLETE QUEST ◯
      </button>

      <div className="footer-section">
        <div className="warning">
          WARNING: Failure to complete the daily quest will result in an appropriate <span>penalty</span>.
        </div>
        <div className="timer">{timeRemaining}</div>
      </div>
    </div>
  );
}
