'use client';

import React, { useState } from 'react';
import { PlanType } from '@/types/plans';
import MavicoinsModal from '@/components/MavicoinsModal';
import ScannerMaviModal from '@/components/ScannerMaviModal';
import ShortsFeed from '@/components/ShortsFeed';
import AuthModal from '@/components/AuthModal';
import CorridaCard from '@/components/CorridaCard';

export default function Dashboard() {
  const [userPlan, setUserPlan] = useState<PlanType>('FREE');
  const [mavicoins, setMavicoins] = useState<number>(150);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [showUpsellBanner, setShowUpsellBanner] = useState<boolean>(false);

  const handleAccessFitt = () => {
    if (userPlan !== 'DIAMOND') {
      setShowUpsellBanner(true);
    } else {
      setShowUpsellBanner(false);
      setIsScannerOpen(true);
    }
  };

  const handleAddMavicoins = (amount: number) => {
    setMavicoins((prev) => prev + amount);
  };

  const handleLoginSuccess = (name: string, bonusMavicoins: number = 0) => {
    setUserName(name);
    if (bonusMavicoins > 0) {
      handleAddMavicoins(bonusMavicoins);
    }
  };

  return (
    <main ><div className="min-h-screen bg-slate-50 text-slate-900 p-6 pb-24">
      {/* HEADER */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center pb-6 border-b border-slate-800 gap-4">
        <div>
        <div className="flex items-center">
      <img src="/logo.png" alt="Mavitai" className="h-13 w-auto object-contain" />
    </div>
      </div>
  

        <div className="flex items-center gap-4">
          {/* Botão de Autenticação / Nome do Usuário */}
          {userName ? (
            <span className="text-xs font-bold text-emerald-600 bg-emerald-600/10 border border-amber-500/30 px-3 py-2 rounded-xl">
              Olá, {userName}!
            </span>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="text-xs font-bold text-slate-800 hover:text-slate-900 bg-white hover:bg-slate-200 border border-slate-200 px-4 py-2.5 rounded-xl transition"
            >
              Entrar / Criar Conta
            </button>
          )}

          {/* Badge de Mavicoins */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              <div>
                <p className="text-xs text-slate-600 font-semibold">Seus Mavicoins</p>
                <p className="text-lg font-bold text-emerald-600">{mavicoins} MV</p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-3 py-2 rounded-lg transition"
            >
              Obter Moedas
            </button>
          </div>
        </div>
      </header>

      {/* BANNER PLANOS */}
      <section className="max-w-6xl mx-auto my-6 p-4 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-600 block">Plano Atual (Simulação):</span>
          <span className="font-bold text-emerald-600">{userPlan}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setUserPlan('FREE')}
            className={`px-3 py-1 text-xs rounded-md ${userPlan === 'FREE' ? 'bg-emerald-600 text-black font-bold' : 'bg-slate-200'}`}
          >
            FREE
          </button>
          <button
            onClick={() => setUserPlan('BASIC')}
            className={`px-3 py-1 text-xs rounded-md ${userPlan === 'BASIC' ? 'bg-emerald-600 text-black font-bold' : 'bg-slate-200'}`}
          >
            BÁSICO
          </button>
          <button
            onClick={() => setUserPlan('DIAMOND')}
            className={`px-3 py-1 text-xs rounded-md ${userPlan === 'DIAMOND' ? 'bg-emerald-600 text-black font-bold' : 'bg-slate-200'}`}
          >
            DIAMANTE
          </button>
        </div>
      </section>

      {/* CARDS PRINCIPAIS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                🤖 IA Mavi <span className="text-xs bg-emerald-600/20 text-emerald-600 px-2 py-0.5 rounded-full border border-amber-500/30">Exclusivo Diamante</span>
              </h2>
            </div>
            <p className="text-slate-700 text-sm mb-4">
              Tire uma foto do seu prato e nossa Inteligência Artificial calcula instantaneamente as calorias e macronutrientes.
            </p>

            {showUpsellBanner && userPlan !== 'DIAMOND' && (
              <div className="mb-4 p-4 bg-emerald-600/10 border border-amber-500/40 rounded-xl">
                <p className="text-emerald-600 font-bold text-sm">🔒 A IA Mavi é um recurso exclusivo do Plano Diamante!</p>
                <p className="text-xs text-slate-700 mt-1">
                  Faça o upgrade para o Plano Diamante para escanear suas refeições sem limites.
                </p>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-3 text-xs bg-emerald-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg"
                >
                  Fazer Upgrade para Diamante
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleAccessFitt}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold py-3 rounded-xl transition shadow-lg"
          >
            Escanear Prato com Mavi
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200">
          <h3 className="text-lg font-bold mb-4">Desafios Diários</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between items-center p-2 bg-slate-900/50 rounded-lg">
              <span>Check-in diário</span>
              <span className="text-emerald-600 font-bold">+10 MV</span>
            </li>
            <li className="flex justify-between items-center p-2 bg-slate-900/50 rounded-lg">
              <span>Postar foto de treino</span>
              <span className="text-emerald-600 font-bold">+25 MV</span>
            </li>
          </ul>
        </div>
      </div>
{/* MONITOR DE CORRIDA */}
<CorridaCard onEarnMavicoins={handleAddMavicoins} />
      {/* SEÇÃO DO SHORTS FEED (VÍDEOS CURTOS) */}
      <section className="max-w-6xl mx-auto border-t border-slate-800 pt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              🎬 Mavitai Shorts
            </h2>
            <p className="text-xs text-slate-600 mt-1">Assista a vídeos curtos e ganhe Mavicoins a cada reprodução</p>
          </div>
        </div>
        
        <ShortsFeed onEarnMavicoins={handleAddMavicoins} />
      </section>

      {/* MODAIS */}
      <MavicoinsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} userBalance={mavicoins} />
      <ScannerMaviModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
  
    </div>
  </main>
);
}