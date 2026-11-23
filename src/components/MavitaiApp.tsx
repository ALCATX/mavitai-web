"use client";

import React, { useState, useRef } from "react";
import { 
  Flame, 
  Coins, 
  Trophy, 
  Dumbbell, 
  Sparkles, 
  Camera, 
  Heart, 
  MessageCircle, 
  Share2, 
  Crown, 
  Search, 
  Apple, 
  Megaphone,
  Plus,
  UserPlus,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Bot,
  Target,
  CheckCircle2,
  Send,
  Brain,
  Activity,
  Award
} from "lucide-react";

import MavicoinsModal from "./MavicoinsModal";

type PlanType = "FREE" | "BASIC" | "DIAMOND";
type TabType = "feed" | "workouts" | "ai-scanner" | "daily-challenges" | "mavi-assistant";

interface Post {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isPrivate: boolean;
  isFollowing: boolean;
  dietType: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSponsored?: boolean;
  sponsorBrand?: string;
  sponsorCtaUrl?: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  target: number;
  completed: boolean;
  category: "Físico" | "Alimentação" | "Mental" | "Social";
}

export function FittarApp() {
  // Estado do Usuário e Gamificação
  const [userPlan, setUserPlan] = useState<PlanType>("FREE");
  const [mavicoins, setFitcoins] = useState<number>(1250);
  const [streakDays, setStreakDays] = useState<number>(7);
  const [hasDoneDailyCheckin, setHasDoneDailyCheckin] = useState<boolean>(true);
  const [scansUsedToday, setScansUsedToday] = useState<number>(0);
  
  // Modais e Navegação
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [isFitcoinsModalOpen, setIsFitcoinsModalOpen] = useState(false);
  const [fitcoinsModalTab, setFitcoinsModalTab] = useState<"buy" | "challenges" | "creator">("buy");

  // Estado da Busca de Usuários
  const [searchQuery, setSearchQuery] = useState("");

  // Carrossel de Dietas com Ref para rolagem pelas setas
  const [dietFilter, setDietFilter] = useState<string>("TODAS");
  const dietScrollRef = useRef<HTMLDivElement>(null);

  const dietOptions = [
    "TODAS", 
    "TRADICIONAL", 
    "VEGANA", 
    "VEGETARIANA", 
    "CARNÍVORA", 
    "MEDITERRÂNEA", 
    "LOW CARB", 
    "PALEOLÍTICA",
    "CETOGÊNICA",
    "JEJUM INTERMITENTE",
    "FODMAP"
  ];

  const scrollDiets = (direction: "left" | "right") => {
    if (dietScrollRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      dietScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Limite máximo de scans com base no plano (Free: 1/dia, Básico: 5/dia, Diamante: ilimitado)
  const maxScans = userPlan === "DIAMOND" ? Infinity : userPlan === "BASIC" ? 5 : 1;

  // Lista de Desafios Diários
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "1",
      title: "Scanner Nutricional",
      description: "Escaneie ao menos 1 refeição hoje com a IA.",
      reward: 50,
      progress: 1,
      target: 1,
      completed: true,
      category: "Alimentação"
    },
    {
      id: "2",
      title: "Treino Concluído",
      description: "Realize e registre 1 sessão de treino no app.",
      reward: 80,
      progress: 0,
      target: 1,
      completed: false,
      category: "Físico"
    },
    {
      id: "3",
      title: "Interação Comunitária",
      description: "Curta ou comente em 3 publicações do Feed.",
      reward: 30,
      progress: 2,
      target: 3,
      completed: false,
      category: "Social"
    },
    {
      id: "4",
      title: "Mindset & Pausa Ativa",
      description: "Converse com a Mavi IA sobre gestão de estresse ou meta diária.",
      reward: 40,
      progress: 0,
      target: 1,
      completed: false,
      category: "Mental"
    }
  ]);

  const handleCompleteChallenge = (id: string) => {
    setChallenges(prev => prev.map(ch => {
      if (ch.id === id && !ch.completed) {
        setFitcoins(f => f + ch.reward);
        return { ...ch, progress: ch.target, completed: true };
      }
      return ch;
    }));
  };

  // Chat com a Assistente Mavi IA
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "mavi"; text: string }>>([
    {
      sender: "mavi",
      text: "Olá, Marcos! Sou a Mavi, sua assistente integrativa. Combino estratégias de nutrição, psicologia esportiva, nutrologia e preparação física. Como posso ajudar seu corpo e sua mente hoje?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const userText = inputMessage;
    setChatMessages(prev => [...prev, { sender: "user", text: userText }]);
    setInputMessage("");

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: "mavi",
          text: `Entendi perfeitamente sua dúvida sobre "${userText}". Sob a ótica nutricional e emocional, o ideal é manter a constância nos treinos e equilibrar os macronutrientes sem restrições severas. Como está seu nível de estresse e sono hoje?`
        }
      ]);
    }, 1000);
  };

  // Feed de Publicações
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      authorName: "Lucas Silva",
      authorHandle: "@lucasfit",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      isPrivate: false,
      isFollowing: true,
      dietType: "LOW CARB",
      timestamp: "Há 15 min",
      content: "Treino de pernas hoje foi insano! Batendo 140kg no agachamento. Dieta Low Carb mantendo a energia no topo! 🏋️‍♂️💪",
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
      likes: 42,
      comments: 8,
      isLiked: false
    },
    {
      id: "ad-1",
      authorName: "Growth Supplements",
      authorHandle: "@growthoficial",
      authorAvatar: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=150&auto=format&fit=crop&q=80",
      isPrivate: false,
      isFollowing: false,
      dietType: "TRADICIONAL",
      timestamp: "Patrocinado",
      content: "🔥 Cupom especial de 15% OFF + Bônus de 100 Mavicoins na compra de qualquer Whey Protein Concentrado!",
      imageUrl: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop&q=80",
      likes: 128,
      comments: 14,
      isSponsored: true,
      sponsorBrand: "Growth Supplements",
      sponsorCtaUrl: "https://gsuplementos.com.br"
    },
    {
      id: "2",
      authorName: "Juliana Costa",
      authorHandle: "@jutivegan",
      authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      isPrivate: false,
      isFollowing: true,
      dietType: "MEDITERRÂNEA",
      timestamp: "Há 1 hora",
      content: "Salada mediterrânea incrível com azeite extra virgem, nozes e peixe grelhado! 🌱🐟 Rica em ômega 3.",
      imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
      likes: 89,
      comments: 12,
      isLiked: true
    }
  ]);

  const handleDailyCheckin = () => {
    if (!hasDoneDailyCheckin) {
      setHasDoneDailyCheckin(true);
      setStreakDays(prev => prev + 1);
      setFitcoins(prev => prev + 50);
      alert("✅ Check-in diário realizado com sucesso! Você ganhou +50 Mavicoins!");
    }
  };

  const handleBuyExtraScan = (cost: number, scanAmount: number) => {
    if (mavicoins < cost) {
      alert(`⚠️ Saldo insuficiente! Você precisa de ${cost} Mavicoins (Seu saldo: ${mavicoins} MV).`);
      return;
    }
    setFitcoins(prev => prev - cost);
    setScansUsedToday(prev => Math.max(0, prev - scanAmount));
    alert(`🎉 Sucesso! Você resgatou +${scanAmount} Scan(s) por ${cost} Mavicoins.`);
  };

  const handleUseAIScanner = () => {
    if (userPlan === "FREE" && !hasDoneDailyCheckin) {
      alert("⚠️ No plano Free, faça seu Check-in Diário primeiro para liberar o Scan Grátis!");
      return;
    }
    setActiveTab("ai-scanner");
  };

  const handleExecuteScanAction = () => {
    if (userPlan !== "DIAMOND" && scansUsedToday >= maxScans) {
      alert("🔒 Limite diário atingido! Troque 100 Mavicoins por um scan extra ou assine o Plano Diamante.");
      return;
    }
    setScansUsedToday(prev => prev + 1);
    alert("🔍 Análise do Prato concluída com sucesso! Refeição com 520 kcal (42g Proteína, 58g Carboidratos, 12g Gordura).");
  };

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : p.likes - 1
        };
      }
      return p;
    }));
  };

  const handleOpenFitcoinsModal = (tab: "buy" | "challenges" | "creator" = "buy") => {
    setFitcoinsModalTab(tab);
    setIsFitcoinsModalOpen(true);
  };

  const filteredPosts = posts.filter(post => {
    if (userPlan !== "FREE" && post.isSponsored) return false;
    if (dietFilter !== "TODAS" && post.dietType !== dietFilter && !post.isSponsored) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchName = post.authorName.toLowerCase().includes(q);
      const matchHandle = post.authorHandle.toLowerCase().includes(q);
      const matchContent = post.content.toLowerCase().includes(q);
      return matchName || matchHandle || matchContent;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      {/* HEADER SUPERIOR FIXO */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("feed")}>
              <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 p-2 rounded-xl text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
                ⚡
              </div>
              <span className="font-extrabold text-2xl tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                MAVITAI
              </span>
            </div>

            {/* Alternador de Planos */}
            <div className="flex items-center gap-1 bg-white/80 p-1 rounded-full border border-slate-200">
              {(["FREE", "BASIC", "DIAMOND"] as PlanType[]).map((plan) => (
                <button
                  key={plan}
                  onClick={() => {
                    setUserPlan(plan);
                    setScansUsedToday(0);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all ${
                    userPlan === plan 
                      ? plan === "DIAMOND" 
                        ? "bg-gradient-to-r from-amber-400 to-emerald-600 text-slate-950 shadow-md"
                        : "bg-emerald-500 text-slate-950 shadow-md"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {plan}
                </button>
              ))}
            </div>
          </div>

          {/* BARRA DE PESQUISA DE USUÁRIOS E PERFIS */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar atletas, perfis ou treinos..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* GAMIFICAÇÃO & SALDO */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDailyCheckin}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition border ${
                hasDoneDailyCheckin
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                  : "bg-emerald-600 hover:bg-emerald-500 text-slate-950 border-amber-400 animate-bounce"
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>{hasDoneDailyCheckin ? "Check-in Feito!" : "Fazer Check-in"}</span>
            </button>

            <div className="flex items-center gap-1 bg-emerald-600/10 border border-emerald-600/30 px-2.5 py-1.5 rounded-full text-emerald-600 font-bold text-xs">
              <Flame className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span>{streakDays}d</span>
            </div>

            <button 
              onClick={() => handleOpenFitcoinsModal("buy")}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black px-3 py-1.5 rounded-full text-xs shadow-lg shadow-amber-500/20 transition hover:scale-105"
            >
              <Coins className="w-3.5 h-3.5 text-slate-950" />
              <span>{mavicoins.toLocaleString()}</span>
              <Plus className="w-3 h-3 bg-slate-950/20 rounded-full" />
            </button>
          </div>

        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUNA ESQUERDA: PERFIL E MENU DE NAVEGAÇÃO */}
        <aside className="lg:col-span-3 space-y-4">
          
          {/* Card do Perfil */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col items-center text-center">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                alt="Avatar" 
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400 p-0.5"
              />
              <h2 className="mt-2 font-bold text-base text-slate-900">Marcos Freitas</h2>
              <p className="text-xs text-slate-600">@marcosfittar</p>

              <span className={`mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wide ${
                userPlan === "DIAMOND"
                  ? "bg-gradient-to-r from-amber-400 to-emerald-600 text-slate-950"
                  : userPlan === "BASIC"
                  ? "bg-cyan-500 text-slate-950"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}>
                {userPlan === "DIAMOND" && <Crown className="w-3 h-3" />}
                PLANO {userPlan}
              </span>
            </div>
          </div>

          {/* NAVEGAÇÃO PRINCIPAL DO APP */}
          <nav className="bg-slate-900 border border-slate-800 rounded-2xl p-2 space-y-1">
            <button
              onClick={() => setActiveTab("feed")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                activeTab === "feed" ? "bg-emerald-500 text-slate-950" : "text-slate-700 hover:bg-white"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Feed de Rotinas</span>
            </button>

            {/* FITT IA (ASSISTENTE COMPLETA) */}
            <button
              onClick={() => setActiveTab("mavi-assistant")}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                activeTab === "mavi-assistant" 
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950" 
                  : "text-slate-700 hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span>Mavi (Assistente IA)</span>
              </div>
              <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-black border border-cyan-500/30">
                PRO
              </span>
            </button>

            {/* ABA DESAFIOS DIÁRIOS */}
            <button
              onClick={() => setActiveTab("daily-challenges")}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                activeTab === "daily-challenges" ? "bg-emerald-500 text-slate-950" : "text-slate-700 hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>Desafios Diários</span>
              </div>
              <span className="text-[9px] bg-emerald-600/20 text-emerald-600 px-1.5 py-0.5 rounded font-black">
                +MV
              </span>
            </button>

            {/* ATIVIDADES FÍSICAS */}
            <button
              onClick={() => setActiveTab("workouts")}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                activeTab === "workouts" ? "bg-emerald-500 text-slate-950" : "text-slate-700 hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Dumbbell className="w-4 h-4" />
                <span>Atividades Físicas & Treinos</span>
              </div>
            </button>

            {/* SCANNER DE PRATOS (IA) */}
            <button
              onClick={handleUseAIScanner}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-xs transition ${
                activeTab === "ai-scanner" ? "bg-emerald-500 text-slate-950" : "text-slate-700 hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Apple className="w-4 h-4" />
                <span>Escanear Prato (IA)</span>
              </div>
              <span className="text-[9px] bg-white text-emerald-600 px-2 py-0.5 rounded font-black border border-amber-500/30">
                {userPlan === "DIAMOND" ? "∞" : `${Math.max(0, maxScans - scansUsedToday)}/${maxScans}`}
              </span>
            </button>
          </nav>

          {/* CARD DE INDICAÇÃO */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Indique Amigos e Ganhe!</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              Ganhe <strong className="text-emerald-600">+150 MV</strong> e seu amigo recebe <strong className="text-emerald-400">+50 MV</strong>!
            </p>
            <button 
              onClick={() => {
                navigator.clipboard.writeText("https://mavitai.app/invite/marcosfittar");
                alert("📋 Link de indicação copiado!");
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20"
            >
              Copiar Link
            </button>
          </div>

        </aside>

        {/* COLUNA CENTRAL: CONTEÚDO */}
        <section className="lg:col-span-6 space-y-5">
          
          {/* ABA 1: FEED DE ROTINAS */}
          {activeTab === "feed" && (
            <>
              {/* Caixa de Criação de Post */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
                    alt="Avatar" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <input 
                    type="text" 
                    placeholder="Compartilhe seu treino, dieta ou evolução..." 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-white text-xs font-medium transition">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      <span>Mídia</span>
                    </button>

                    <button 
                      onClick={handleUseAIScanner}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 hover:bg-white text-xs font-medium transition"
                    >
                      <Apple className="w-4 h-4 text-emerald-600" />
                      <span>Escanear Prato</span>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        ({userPlan === "DIAMOND" ? "∞" : `${Math.max(0, maxScans - scansUsedToday)}/${maxScans}`})
                      </span>
                    </button>
                  </div>

                  <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs transition shadow-lg shadow-emerald-500/20">
                    Publicar
                  </button>
                </div>
              </div>

              {/* CARROSSEL DE DIETAS COM SETAS NAVEGÁVEIS */}
              <div className="relative flex items-center">
                {/* Seta Esquerda */}
                <button 
                  onClick={() => scrollDiets("left")}
                  className="z-10 bg-slate-900/90 border border-slate-200 hover:bg-white text-slate-800 p-1 rounded-full shadow-lg mr-1 transition"
                  title="Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Lista Horizontal de Categorias */}
                <div 
                  ref={dietScrollRef}
                  className="flex items-center gap-1.5 overflow-x-auto scrollbar-none scroll-smooth py-1 w-full"
                >
                  {dietOptions.map((diet) => (
                    <button
                      key={diet}
                      onClick={() => setDietFilter(diet)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
                        dietFilter === diet
                          ? "bg-white text-emerald-400 border border-emerald-500/40 shadow-sm"
                          : "bg-slate-100 text-slate-600 border border-slate-800 hover:text-slate-800"
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>

                {/* Seta Direita */}
                <button 
                  onClick={() => scrollDiets("right")}
                  className="z-10 bg-slate-900/90 border border-slate-200 hover:bg-white text-slate-800 p-1 rounded-full shadow-lg ml-1 transition"
                  title="Próximo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* LISTA DE POSTS */}
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <article 
                    key={post.id} 
                    className={`bg-slate-900 border rounded-2xl p-5 shadow-xl transition ${
                      post.isSponsored 
                        ? "border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/10" 
                        : "border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={post.authorAvatar} 
                          alt={post.authorName} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-slate-900">{post.authorName}</h3>
                            {post.isSponsored && (
                              <span className="flex items-center gap-1 text-[10px] font-black bg-emerald-600/20 text-emerald-600 border border-amber-500/30 px-2 py-0.5 rounded-md">
                                <Megaphone className="w-2.5 h-2.5" /> MAVITAI ADS
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600">{post.authorHandle} • {post.timestamp}</p>
                        </div>
                      </div>

                      {!post.isSponsored && (
                        <span className="text-[10px] font-bold bg-white text-slate-700 border border-slate-200 px-2 py-1 rounded-md">
                          {post.dietType}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-sm text-slate-800 leading-relaxed">{post.content}</p>

                    {post.imageUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-slate-800">
                        <img 
                          src={post.imageUrl} 
                          alt="Post Content" 
                          className="w-full h-72 object-cover hover:scale-105 transition duration-500"
                        />
                      </div>
                    )}

                    {!post.isSponsored && (
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-slate-600 text-xs">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-1.5 font-semibold transition ${
                            post.isLiked ? "text-rose-500" : "hover:text-slate-900"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.isLiked ? "fill-rose-500" : ""}`} />
                          <span>{post.likes}</span>
                        </button>

                        <button className="flex items-center gap-1.5 font-semibold hover:text-slate-900 transition">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments} comentários</span>
                        </button>

                        <button className="flex items-center gap-1.5 font-semibold hover:text-slate-900 transition">
                          <Share2 className="w-4 h-4" />
                          <span>Ganhar 5 MV</span>
                        </button>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}

          {/* ABA FITT (ASSISTENTE IA MULTIDISCIPLINAR) */}
          {activeTab === "mavi-assistant" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[580px]">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-slate-950 font-black">
                    <Bot className="w-6 h-6 text-slate-950" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                      Mavi IA Integrativa
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">Online</span>
                    </h2>
                    <p className="text-[11px] text-slate-600">Nutrição, Psicologia Esportiva, Nutrologia e Preparação Física</p>
                  </div>
                </div>
              </div>

              {/* Mensagens do Chat */}
              <div className="flex-1 overflow-y-auto space-y-3 py-4 pr-1">
                {chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-emerald-500 text-slate-950 font-medium rounded-tr-none"
                        : "bg-slate-950 border border-slate-800 text-slate-800 rounded-tl-none shadow-md"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Campo de Entrada de Texto */}
              <div className="border-t border-slate-800 pt-3 flex items-center gap-2">
                <input 
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Pergunte sobre dieta, treino, motivação ou estado emocional..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-cyan-500 transition"
                />
                <button 
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-slate-950 font-bold p-2.5 rounded-xl transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ABA DESAFIOS DIÁRIOS */}
          {activeTab === "daily-challenges" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h2 className="font-extrabold text-lg text-slate-900">Desafios Diários de Recompensa</h2>
                    <p className="text-xs text-slate-600">Cumpra as metas do dia para acumular Mavicoins rápidos</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {challenges.map((ch) => (
                  <div 
                    key={ch.id} 
                    className={`p-4 rounded-xl border transition flex items-center justify-between gap-4 ${
                      ch.completed 
                        ? "bg-slate-950/60 border-slate-800 opacity-75" 
                        : "bg-slate-950 border-amber-500/30 hover:border-amber-400"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-white text-slate-700 px-2 py-0.5 rounded">
                          {ch.category}
                        </span>
                        <h3 className="font-bold text-xs text-slate-900">{ch.title}</h3>
                      </div>
                      <p className="text-[11px] text-slate-600">{ch.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-black text-emerald-600 block">+{ch.reward} MV</span>
                        <span className="text-[10px] text-slate-500">{ch.progress}/{ch.target}</span>
                      </div>

                      <button
                        onClick={() => handleCompleteChallenge(ch.id)}
                        disabled={ch.completed}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          ch.completed 
                            ? "bg-white text-emerald-400 cursor-default" 
                            : "bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-md"
                        }`}
                      >
                        {ch.completed ? <CheckCircle2 className="w-4 h-4 inline" /> : "Resgatar"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA ATIVIDADES FÍSICAS */}
          {activeTab === "workouts" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <Dumbbell className="w-6 h-6 text-emerald-400" />
                <div>
                  <h2 className="font-extrabold text-lg text-slate-900">Atividades Físicas & Treinos Personalizados</h2>
                  <p className="text-xs text-slate-600">Rotinas geradas por IA com base nas suas métricas corporais</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: "Treino de Hipertrofia A (Peito & Tríceps)", duration: "45 min", level: "Intermediário", calories: "380 kcal" },
                  { title: "Treino Funcional HIIT (Queima de Gordura)", duration: "30 min", level: "Todos os níveis", calories: "450 kcal" },
                  { title: "Treino em Casa sem Equipamentos", duration: "25 min", level: "Iniciante", calories: "220 kcal" },
                  { title: "Mobilidade e Alongamento Guiado", duration: "15 min", level: "Recuperação", calories: "90 kcal" }
                ].map((workout, index) => (
                  <div key={index} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-emerald-500/40 transition">
                    <h3 className="font-bold text-sm text-slate-900">{workout.title}</h3>
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>⏱️ {workout.duration}</span>
                      <span>🔥 {workout.calories}</span>
                      <span className="bg-white text-slate-700 px-2 py-0.5 rounded font-bold">{workout.level}</span>
                    </div>
                    <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-lg text-xs transition">
                      Iniciar Treino (+20 MV)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABA SCANNER DE PRATOS (REAJUSTADO PARA 100 MAVICOINS) */}
          {activeTab === "ai-scanner" && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              
              <div className="text-center max-w-md mx-auto space-y-2">
                <Apple className="w-12 h-12 text-emerald-600 mx-auto animate-pulse" />
                <h2 className="font-extrabold text-xl text-slate-900">Scanner Nutricional com IA</h2>
                <p className="text-xs text-slate-600">
                  Calcule calorias e macronutrientes da sua refeição instantaneamente por foto.
                </p>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs mt-3">
                  <span className="text-slate-600 font-medium">Uso hoje no Plano {userPlan}:</span>
                  <span className="font-black text-emerald-600">
                    {userPlan === "DIAMOND" ? "Ilimitado ∞" : `${scansUsedToday} / ${maxScans} scans utilizados`}
                  </span>
                </div>
              </div>

              {/* Área de Envio da Foto */}
              <div className="max-w-md mx-auto space-y-3">
                <div 
                  onClick={handleExecuteScanAction}
                  className="border-2 border-dashed border-slate-200 hover:border-amber-400 rounded-2xl p-8 cursor-pointer transition text-center bg-slate-950/50"
                >
                  <Camera className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800">Clique para selecionar ou capturar foto do prato</p>
                  <p className="text-[10px] text-slate-500 mt-1">Formatos suportados: JPG, PNG</p>
                </div>

                <button 
                  onClick={handleExecuteScanAction}
                  className="w-full bg-gradient-to-r from-amber-400 to-emerald-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black py-3 rounded-xl text-xs transition shadow-lg shadow-amber-500/20"
                >
                  Escanear e Calcular Refeição
                </button>
              </div>

              {/* RECOMPRA AVULSA POR 100 MAVICOINS */}
              {userPlan !== "DIAMOND" && (
                <div className="border-t border-slate-800 pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-emerald-600" />
                        <span>Precisa de mais scans hoje?</span>
                      </h3>
                      <p className="text-[11px] text-slate-600">Troque seus Mavicoins por scans extras instantaneamente!</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">1 Scan Extra</span>
                        <span className="text-[10px] text-emerald-600 font-extrabold">100 Mavicoins</span>
                      </div>
                      <button 
                        onClick={() => handleBuyExtraScan(100, 1)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black px-3 py-1.5 rounded-lg text-xs transition"
                      >
                        Trocar
                      </button>
                    </div>

                    <div className="bg-slate-950 border border-amber-500/30 p-3.5 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">Pacote 3 Scans (Desconto)</span>
                        <span className="text-[10px] text-emerald-600 font-extrabold">250 Mavicoins</span>
                      </div>
                      <button 
                        onClick={() => handleBuyExtraScan(250, 3)}
                        className="bg-gradient-to-r from-amber-400 to-emerald-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black px-3 py-1.5 rounded-lg text-xs transition"
                      >
                        Trocar
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </section>

        {/* COLUNA DIREITA: RANKING E BOTÃO RÁPIDO FITT IA */}
        <aside className="lg:col-span-3 space-y-4">
          
          {/* Card de Acesso Rápido à Mavi (IA) */}
          <div className="bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/40 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs">
              <Bot className="w-4 h-4" />
              <span>Mavi - Sua IA da Saúde</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              Respostas baseadas nos melhores nutrólogos, psicólogos e coaches.
            </p>
            <button 
              onClick={() => setActiveTab("mavi-assistant")}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black py-2 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20"
            >
              Conversar Agora
            </button>
          </div>

          {/* Ranking Semanal */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Ranking da Semana</h3>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { rank: 1, name: "Gabriel Souza", coins: "14,200 MV", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
                { rank: 2, name: "Fernanda Lima", coins: "11,850 MV", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
                { rank: 3, name: "Marcos Freitas", coins: "1,250 MV", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", isUser: true }
              ].map((item) => (
                <div 
                  key={item.rank}
                  className={`flex items-center justify-between p-2 rounded-xl transition ${
                    item.isUser ? "bg-emerald-500/10 border border-emerald-500/30" : "bg-slate-950/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full text-center text-xs font-black flex items-center justify-center ${
                      item.rank === 1 ? "bg-emerald-500 text-slate-950" : item.rank === 2 ? "bg-slate-300 text-slate-950" : "bg-amber-700 text-slate-900"
                    }`}>
                      {item.rank}
                    </span>
                    <img src={item.avatar} alt={item.name} className="w-7 h-7 rounded-full object-cover" />
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[90px]">{item.name}</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600">{item.coins}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </main>

      {/* MODAL DE MAVICOINS */}
      <MavicoinsModal 
        isOpen={isFitcoinsModalOpen}
        onClose={() => setIsFitcoinsModalOpen(false)}
        initialTab={fitcoinsModalTab}
        userBalance={mavicoins}
      />
    </div>
  );
}

export default FittarApp;