'use client';

import React, { useState } from 'react';

interface MavicoinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBalance: number;
  initialTab?: 'buy' | 'challenges' | 'creator';
}

export default function MavicoinsModal({ isOpen, onClose, userBalance, initialTab = 'buy' }: MavicoinsModalProps) {
  const [activeTab, setActiveTab] = useState<'buy' | 'challenges' | 'creator'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Cabeçalho da Modal */}
        <div className="p-6 bg-gradient-to-r from-emerald-500/20 to-orange-500/10 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              🪙 Carteira Mavicoins
            </h2>
            <p className="text-slate-600 text-sm">Seu saldo atual: <span className="text-emerald-600 font-bold">{userBalance} Mavicoins</span></p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-600 hover:text-slate-900 bg-white rounded-full w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-slate-800 bg-slate-950">
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 py-3 text-sm font-semibold transition-all ${
              activeTab === 'buy' ? 'border-b-2 border-amber-500 text-emerald-600 bg-emerald-600/5' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛒 Comprar Moedas
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex-1 py-3 text-sm font-semibold transition-all ${
              activeTab === 'challenges' ? 'border-b-2 border-amber-500 text-emerald-600 bg-emerald-600/5' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎯 Desafios Diários
          </button>
          <button
            onClick={() => setActiveTab('creator')}
            className={`flex-1 py-3 text-sm font-semibold transition-all ${
              activeTab === 'creator' ? 'border-b-2 border-amber-500 text-emerald-600 bg-emerald-600/5' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⭐ Área do Criador
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Aba 1: Comprar Moedas */}
          {activeTab === 'buy' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:border-amber-500 transition-all flex flex-col justify-between">
                <div>
                  <span className="text-3xl">🪙</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">100 Mavicoins</h3>
                  <p className="text-xs text-slate-600 my-2">Ideal para 2 treinos extras ou scanner</p>
                </div>
                <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-bold py-2 rounded-lg text-sm">
                  R$ 4,90
                </button>
              </div>

              <div className="bg-white border border-amber-500/50 rounded-xl p-4 text-center relative hover:border-amber-500 transition-all flex flex-col justify-between">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Mais Popular
                </span>
                <div>
                  <span className="text-3xl">🪙🪙</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">500 Mavicoins</h3>
                  <p className="text-xs text-slate-600 my-2">Libera recursos e scanner semanal</p>
                </div>
                <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-bold py-2 rounded-lg text-sm">
                  R$ 19,90
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:border-amber-500 transition-all flex flex-col justify-between">
                <div>
                  <span className="text-3xl">👑</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">1.500 Mavicoins</h3>
                  <p className="text-xs text-slate-600 my-2">Maior economia para o mês inteiro</p>
                </div>
                <button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-bold py-2 rounded-lg text-sm">
                  R$ 49,90
                </button>
              </div>
            </div>
          )}

          {/* Aba 2: Desafios Diários */}
          {activeTab === 'challenges' && (
            <div className="space-y-3">
              <div className="bg-white/40 border border-slate-200/60 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">💧 Beber Água (Stories 24h)</h4>
                  <p className="text-xs text-slate-600">Poste uma foto/vídeo tomando água (a cada 3h)</p>
                </div>
                <button className="bg-emerald-600/10 text-emerald-600 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-slate-950 transition-all">
                  +10 Mavicoins
                </button>
              </div>

              <div className="bg-white/40 border border-slate-200/60 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">🥗 Foto do Prato Saudável</h4>
                  <p className="text-xs text-slate-600">Publique sua refeição no Feed do app</p>
                </div>
                <button className="bg-emerald-600/10 text-emerald-600 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-slate-950 transition-all">
                  +20 Mavicoins
                </button>
              </div>

              <div className="bg-white/40 border border-slate-200/60 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">🏋️ Check-in de Treino</h4>
                  <p className="text-xs text-slate-600">Vídeo curto de 15s treinando ou na academia</p>
                </div>
                <button className="bg-emerald-600/10 text-emerald-600 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-slate-950 transition-all">
                  +30 Mavicoins
                </button>
              </div>

              <div className="bg-white/40 border border-slate-200/60 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">📹 Transmissão Live Fitness</h4>
                  <p className="text-xs text-slate-600">Faça uma live de no mínimo 15 minutos</p>
                </div>
                <button className="bg-emerald-600/10 text-emerald-600 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-slate-950 transition-all">
                  +100 Mavicoins
                </button>
              </div>
            </div>
          )}

          {/* Aba 3: Área do Criador / Influenciador */}
          {activeTab === 'creator' && (
            <div className="space-y-4">
              <div className="bg-white/60 border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-900 text-sm">🔗 Seu Link de Afiliado</h4>
                <p className="text-xs text-slate-600 mt-1">Ganhe Mavicoins por cada novo usuário indicado que se cadastrar ou comprar moedas.</p>
                <div className="flex gap-2 mt-3">
                  <input 
                    type="text" 
                    readOnly 
                    value="https://mavitai.app/ref/seuusuario" 
                    className="bg-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 w-full"
                  />
                  <button className="bg-emerald-600 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold shrink-0">
                    Copiar
                  </button>
                </div>
              </div>

              <div className="bg-white/60 border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">💸 Resgate de Mavicoins (Cashout)</h4>
                  <p className="text-xs text-slate-600">Converta seus Mavicoins acumulados em Pix ou descontos em parceiros.</p>
                </div>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold">
                  Solicitar Pix
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}