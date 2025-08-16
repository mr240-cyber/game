
import React, { useState } from 'react';
import { BackIcon, DanaLogo, OvoLogo } from './icons';
import { PaymentMethod } from '../types';

interface WithdrawalScreenProps {
  balance: number;
  onBackClick: () => void;
}

const WITHDRAWAL_AMOUNTS = [5000, 10000, 25000, 50000, 100000, 200000];

const WithdrawalScreen: React.FC<WithdrawalScreenProps> = ({ balance, onBackClick }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.None);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const isConfirmDisabled = selectedAmount === null || selectedMethod === PaymentMethod.None || balance < selectedAmount;

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-lg rounded-3xl p-6 text-gray-800 shadow-2xl animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBackClick} className="p-2 -ml-2 text-gray-600 hover:text-black transition-colors">
            <BackIcon className="w-7 h-7" />
          </button>
          <h1 className="text-2xl font-bold">Penarikan Tunai</h1>
          <div className="w-7"></div>
        </div>

        {/* Balance */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 mb-6">
          <p className="text-sm opacity-80">Saldo Anda Saat Ini</p>
          <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
        </div>

        {/* Amount Selection */}
        <div className="mb-6">
            <h2 className="font-semibold mb-3">Pilih Jumlah Penarikan</h2>
            <div className="grid grid-cols-3 gap-3">
                {WITHDRAWAL_AMOUNTS.map(amount => (
                    <button 
                        key={amount}
                        onClick={() => setSelectedAmount(amount)}
                        className={`p-2 rounded-lg font-bold text-center transition-all duration-200 ${selectedAmount === amount ? 'bg-yellow-400 text-black ring-2 ring-yellow-500' : 'bg-gray-200 hover:bg-gray-300'} ${balance < amount ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={balance < amount}
                    >
                        {formatCurrency(amount).replace('Rp', 'Rp ')}
                    </button>
                ))}
            </div>
        </div>
        
        {/* Payment Method */}
        <div className="mb-8">
            <h2 className="font-semibold mb-3">Pilih Metode Pembayaran</h2>
            <div className="flex gap-4">
                <button onClick={() => setSelectedMethod(PaymentMethod.DANA)} className={`flex-1 flex items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 ${selectedMethod === PaymentMethod.DANA ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                    <DanaLogo className="h-6" />
                </button>
                <button onClick={() => setSelectedMethod(PaymentMethod.OVO)} className={`flex-1 flex items-center justify-center p-4 border-2 rounded-xl transition-all duration-200 ${selectedMethod === PaymentMethod.OVO ? 'border-purple-600 bg-purple-50' : 'border-gray-300'}`}>
                    <OvoLogo className="h-6" />
                </button>
            </div>
        </div>

        {/* Confirm Button */}
        <button 
          disabled={isConfirmDisabled}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold text-xl py-3.5 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:scale-100"
        >
            Konfirmasi Penarikan
        </button>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WithdrawalScreen;
