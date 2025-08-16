
import React, { useState } from 'react';
import GameScreen from './components/GameScreen';
import WithdrawalScreen from './components/WithdrawalScreen';
import { Screen } from './types';
import type { PlayerData } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Game);
  const [playerData, setPlayerData] = useState<PlayerData>({
    level: 15,
    balance: 135700,
  });

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const addBalance = (amount: number) => {
    setPlayerData(prevData => ({
      ...prevData,
      balance: prevData.balance + amount,
    }));
  };

  return (
    <div className="relative w-[375px] h-[812px] overflow-hidden rounded-[40px] shadow-2xl bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/375/812?image=993')"}}>
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative z-10 h-full">
        {currentScreen === Screen.Game && (
          <GameScreen 
            playerData={playerData} 
            onWithdrawClick={() => navigateTo(Screen.Withdrawal)}
            onAddBalance={addBalance}
          />
        )}
        {currentScreen === Screen.Withdrawal && (
          <WithdrawalScreen
            balance={playerData.balance}
            onBackClick={() => navigateTo(Screen.Game)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
