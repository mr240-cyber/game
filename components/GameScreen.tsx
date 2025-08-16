
import React, { useState, useEffect } from 'react';
import { CoinIcon, SettingsIcon, StarIcon, GiftIcon } from './icons';
import type { PlayerData } from '../types';
import { showRewardedAd } from '../services/adService';

interface GameScreenProps {
  playerData: PlayerData;
  onWithdrawClick: () => void;
  onAddBalance: (amount: number) => void;
}

const FRUITS = ['🍎', '🍊', '🍋', '🍉', '🍇', '🍓', '🍒', '🍍'];
const GRID_SIZE = 8;
const AD_REWARD = 5000;

const GameScreen: React.FC<GameScreenProps> = ({ playerData, onWithdrawClick, onAddBalance }) => {
  const [grid, setGrid] = useState<string[][]>([]);
  const [adState, setAdState] = useState<'idle' | 'loading' | 'rewarded'>('idle');
  const [balanceKey, setBalanceKey] = useState(0);

  useEffect(() => {
    const newGrid = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => FRUITS[Math.floor(Math.random() * FRUITS.length)])
    );
    setGrid(newGrid);
  }, []);
  
  useEffect(() => {
    if (playerData.balance > 0) {
        setBalanceKey(prev => prev + 1);
    }
  }, [playerData.balance]);

  const handleWatchAd = async () => {
    if (adState !== 'idle') return;

    setAdState('loading');
    try {
      const wasRewarded = await showRewardedAd();
      if (wasRewarded) {
        onAddBalance(AD_REWARD);
        setAdState('rewarded');
        setTimeout(() => {
          setAdState('idle');
        }, 2000); // Tampilkan pesan hadiah selama 2 detik
      } else {
        // Pengguna menutup iklan lebih awal atau terjadi error
        setAdState('idle');
      }
    } catch (error) {
      console.error("Ad failed to show:", error);
      setAdState('idle');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="flex flex-col h-full p-4 text-white font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
          <StarIcon className="w-6 h-6 text-yellow-400" />
          <span className="font-bold text-xl">Level {playerData.level}</span>
        </div>
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2">
           <CoinIcon className="w-6 h-6 text-yellow-400" />
           <span key={balanceKey} className="font-bold text-xl animate-pop-in">{formatCurrency(playerData.balance)}</span>
        </div>
        <button className="p-2 bg-black/40 backdrop-blur-sm rounded-full">
           <SettingsIcon className="w-6 h-6" />
        </button>
      </header>

      {/* Game Board */}
      <main className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-8 gap-1.5 p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg">
          {grid.flat().map((fruit, index) => (
            <div key={index} className="w-9 h-9 flex items-center justify-center bg-black/20 rounded-lg">
              <span className="text-2xl">{fruit}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Ad Reward Modal */}
      {adState !== 'idle' && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-8 text-center">
            {adState === 'loading' && (
                <>
                    <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin mb-4"></div>
                    <p className="text-xl font-bold">Menampilkan Iklan...</p>
                    <p className="text-white/80">Tonton sampai selesai untuk mendapatkan hadiah!</p>
                </>
            )}
            {adState === 'rewarded' && (
                <div className="animate-fade-in">
                    <GiftIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4"/>
                    <p className="text-3xl font-bold text-yellow-300">Hadiah Diterima!</p>
                    <p className="text-xl mt-2">Anda mendapatkan {formatCurrency(AD_REWARD)}</p>
                </div>
            )}
        </div>
      )}

      {/* Footer */}
      <footer className="mt-4 flex flex-col gap-3">
        <button 
          onClick={handleWatchAd}
          disabled={adState !== 'idle'}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 disabled:from-gray-500 disabled:to-gray-600 disabled:scale-100"
        >
          <GiftIcon className="w-7 h-7" />
          Tonton Iklan
        </button>
        <button 
          onClick={onWithdrawClick}
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-2xl py-4 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
        >
          Tarik Tunai
        </button>
      </footer>
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); color: #facc15; }
          100% { transform: scale(1); }
        }
        .animate-pop-in {
            display: inline-block;
            animation: pop-in 0.4s ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GameScreen;
