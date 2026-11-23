'use client';

import React, { useState, useEffect } from 'react';

interface VideoPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  description: string;
  tags: string[];
  likes: number;
  comments: number;
  shares: number;
  fitcoinsReward: number;
  videoBgColor: string; // Simulação visual do vídeo
}

interface ShortsFeedProps {
  onEarnMavicoins: (amount: number) => void;
}

const MOCK_VIDEOS: VideoPost[] = [
  {
    id: '1',
    author: 'Lucas Treinos',
    handle: '@lucas_fit',
    avatar: '🏋️‍♂️',
    description: 'Treino insano de pernas em 15 minutos! Bota pra moer 🔥💪',
    tags: ['#LegDay', '#Crossfit', '#Mavitai'],
    likes: 1240,
    comments: 89,
    shares: 45,
    fitcoinsReward: 10,
    videoBgColor: 'from-amber-900 to-slate-900'
  },
  {
    id: '2',
    author: 'Nutri Carol',
    handle: '@carol_nutri',
    avatar: '🥗',
    description: 'Receita rápida de pré-treino anabólico em 2 minutos! Pega a dica 👇',
    tags: ['#DietaFitness', '#ReceitasFit', '#FittarNutri'],
    likes: 3420,
    comments: 210,
    shares: 112,
    fitcoinsReward: 15,
    videoBgColor: 'from-emerald-900 to-slate-900'
  }
];

export default function ShortsFeed({ onEarnMavicoins }: ShortsFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [watchProgress, setWatchProgress] = useState(0);
  const [claimedRewards, setClaimedRewards] = useState<Record<string, boolean>>({});
  const [likesCount, setLikesCount] = useState<Record<string, number>>({
    '1': 1240,
    '2': 3420
  });
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({});

  const currentVideo = MOCK_VIDEOS[currentIndex];

  // Simulação da barra de progresso do Kwai (recompensa por assistir)
  useEffect(() => {
    setWatchProgress(0);
    const interval = setInterval(() => {
      setWatchProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleClaimCoins = () => {
    if (!claimedRewards[currentVideo.id] && watchProgress >= 100) {
      setClaimedRewards((prev) => ({ ...prev, [currentVideo.id]: true }));
      onEarnMavicoins(currentVideo.fitcoinsReward);
    }
  };

  const toggleLike = (id: string) => {
    const liked = isLiked[id];
    setIsLiked((prev) => ({ ...prev, [id]: !liked }));
    setLikesCount((prev) => ({
      ...prev,
      [id]: liked ? prev[id] - 1 : prev[id] + 1
    }));
  };

  const handleNext = () => {
    if (currentIndex < MOCK_VIDEOS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // Loop de exemplo
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto h-[600px] bg-black rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl flex flex-col justify-between">
      {/* SIMULADOR DE VÍDEO (FUNDO DINÂMICO) */}
      <div className={`absolute inset-0 bg-gradient-to-b ${currentVideo.videoBgColor} flex items-center justify-center`}>
        <div className="text-center p-6">
          <span className="text-6xl animate-bounce block mb-2">{currentVideo.avatar}</span>
          <p className="text-xs text-slate-600 font-mono">[ Em execução: Vídeo Curto #{currentVideo.id} ]</p>
        </div>
      </div>

      {/* TOP BAR: RECOMPENSA DE MAVICOINS ESTILO KWAI */}
      <div className="relative z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-amber-500/40">
          <div className="relative flex items-center justify-center w-7 h-7 bg-emerald-600 text-slate-950 font-bold text-xs rounded-full">
            🪙
          </div>
          <div className="w-24 bg-white h-2 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${watchProgress}%` }}
            />
          </div>
          <button
            onClick={handleClaimCoins}
            disabled={watchProgress < 100 || claimedRewards[currentVideo.id]}
            className={`text-xs px-2 py-1 rounded-full font-bold transition ${
              claimedRewards[currentVideo.id]
                ? 'bg-slate-200 text-slate-600 cursor-not-allowed'
                : watchProgress === 100
                ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 animate-pulse'
                : 'bg-white text-slate-500 opacity-50'
            }`}
          >
            {claimedRewards[currentVideo.id] ? 'Coletado' : `+${currentVideo.fitcoinsReward} MV`}
          </button>
        </div>

        <button 
          onClick={handleNext}
          className="bg-slate-100 hover:bg-white text-xs text-slate-700 border border-slate-200 px-3 py-1.5 rounded-full"
        >
          Próximo ⬇️
        </button>
      </div>

      {/* PAINEL LATERAL DE ENGAJAMENTO (DIREITA) */}
      <div className="relative z-10 p-4 flex flex-col justify-end items-end gap-5">
        {/* BOTÃO CURTIR */}
        <button 
          onClick={() => toggleLike(currentVideo.id)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={`p-3 rounded-full border transition ${
            isLiked[currentVideo.id] 
              ? 'bg-rose-500/20 border-rose-500 text-rose-500' 
              : 'bg-slate-100 border-slate-200 text-slate-900 group-hover:bg-white'
          }`}>
            ❤️
          </div>
          <span className="text-xs font-bold text-slate-900 drop-shadow">
            {likesCount[currentVideo.id]}
          </span>
        </button>

        {/* BOTÃO COMENTAR */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="p-3 rounded-full bg-slate-100 border border-slate-200 text-slate-900 group-hover:bg-white">
            💬
          </div>
          <span className="text-xs font-bold text-slate-900 drop-shadow">{currentVideo.comments}</span>
        </button>

        {/* BOTÃO COMPARTILHAR */}
        <button className="flex flex-col items-center gap-1 group">
          <div className="p-3 rounded-full bg-slate-100 border border-slate-200 text-slate-900 group-hover:bg-white">
            ↗️
          </div>
          <span className="text-xs font-bold text-slate-900 drop-shadow">{currentVideo.shares}</span>
        </button>
      </div>

      {/* RODAPÉ: AUTOR E DESCRIÇÃO DO VÍDEO */}
      <div className="relative z-10 p-4 bg-gradient-to-t from-black via-black/60 to-transparent">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{currentVideo.avatar}</span>
          <div>
            <h4 className="font-bold text-sm text-slate-900">{currentVideo.author}</h4>
            <p className="text-xs text-emerald-600">{currentVideo.handle}</p>
          </div>
          <button className="ml-auto text-xs bg-emerald-600 text-slate-950 font-bold px-3 py-1 rounded-full hover:bg-emerald-500">
            Seguir
          </button>
        </div>
        <p className="text-xs text-slate-800 line-clamp-2 mb-2">{currentVideo.description}</p>
        <div className="flex gap-1 flex-wrap">
          {currentVideo.tags.map((tag, idx) => (
            <span key={idx} className="text-[10px] text-emerald-600 font-semibold bg-emerald-600/10 px-1.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}