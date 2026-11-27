'use client';

import React, { useEffect, useState } from 'react';
import { X, User, Mail, Lock, Target, Gift, ArrowRight, CheckCircle2, Calendar, Scale, Ruler, Utensils } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userName: string, bonusFitcoins?: number, weightKg?: number) => void;
  blocking?: boolean;
  notice?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  blocking = false,
  notice,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');
  const [step, setStep] = useState<number>(1);

  // Etapa 1: Credenciais
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Etapa 2: Dados Físicos
  const [birthDate, setBirthDate] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  // Etapa 3: Dieta e Rotina
  const [dietType, setDietType] = useState<string>('Flexível');
  const [weeklyFrequency, setWeeklyFrequency] = useState<string>('3 a 4x por semana');

  // Etapa 4: Objetivos (Até 3 opções)
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Perder Peso & Definir']);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !blocking) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, blocking, onClose]);

  if (!isOpen) return null;

  const availableGoals = [
    'Perder Peso & Definir',
    'Ganhar Massa Muscular (Hipertrofia)',
    'Condicionamento & Saúde',
    'Aumento de Força & Performance',
    'Melhorar Qualidade do Sono',
    'Manutenção & Longevidade'
  ];

  const handleGoalToggle = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      if (selectedGoals.length === 1) return; // Mantém pelo menos 1 selecionado
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      if (selectedGoals.length < 3) {
        setSelectedGoals([...selectedGoals, goal]);
      }
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleCompleteRegister = () => {
    const parsedWeight = parseFloat(weight.replace(',', '.'));
    onLoginSuccess(
      name || 'Novo Atleta',
      50,
      !Number.isNaN(parsedWeight) && parsedWeight > 0 ? parsedWeight : undefined
    );
    onClose();
    setStep(1);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(email ? email.split('@')[0] : 'Atleta Mavitai', 0);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onMouseDown={(event) => {
        if (blocking) return;
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="bg-[#0d1527] border border-slate-800 w-full max-w-lg rounded-2xl p-6 relative shadow-2xl my-8"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {!blocking && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {notice && (
          <p className="mb-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-200">
            {notice}
          </p>
        )}

        {/* Abas Login / Cadastro */}
        <div className="flex bg-[#080d1a] p-1 rounded-xl mb-6 border border-slate-800">
          <button
            onClick={() => { setActiveTab('login'); setStep(1); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'login' ? 'bg-emerald-600 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'register' ? 'bg-emerald-600 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* FORMULÁRIO DE LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white">Bem-vindo de volta!</h3>
              <p className="text-xs text-slate-300 mt-1">Acesse sua conta no MAVITAI para continuar seus treinos.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1">E-mail</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#080d1a] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-amber-500 text-white placeholder:text-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-200 mb-1">Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#080d1a] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg mt-2"
            >
              Entrar na Conta
            </button>
          </form>
        )}

        {/* CADASTRO (5 ETAPAS) */}
        {activeTab === 'register' && (
          <div>
            {/* Barra de Progresso */}
            <div className="flex items-center justify-between mb-6 px-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition ${
                      step >= i
                        ? 'bg-emerald-600 text-slate-950'
                        : 'bg-white text-slate-500 border border-slate-200'
                    }`}
                  >
                    {i}
                  </div>
                  {i < 5 && <div className={`w-6 sm:w-8 h-0.5 ${step > i ? 'bg-emerald-600' : 'bg-white'}`} />}
                </div>
              ))}
            </div>

            {/* ETAPA 1: DADOS DE ACESSO */}
            {step === 1 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-white">Criar sua Conta</h3>
                  <p className="text-xs text-slate-300 mt-1">Passo 1 de 5: Seus dados de acesso</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">Nome Completo</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#080d1a] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">E-mail</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#080d1a] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-amber-500 text-white placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">Senha</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#080d1a] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 mt-2"
                >
                  Continuar <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* ETAPA 2: DADOS FÍSICOS */}
            {step === 2 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-white">Dados Corporais</h3>
                  <p className="text-xs text-slate-300 mt-1">Passo 2 de 5: Para calcularmos suas métricas</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">Data de Nascimento</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="date"
                      required
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-[#080d1a] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1">Altura (cm)</label>
                    <div className="relative">
                      <Ruler className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="number"
                        required
                        placeholder="Ex: 175"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full bg-[#080d1a] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-200 mb-1">Peso Atual (kg)</label>
                    <div className="relative">
                      <Scale className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                      <input
                        type="number"
                        step="0.1"
                        required
                        placeholder="Ex: 72.5"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full bg-[#080d1a] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-white hover:bg-slate-200 text-slate-200 text-xs font-bold py-3 rounded-xl transition"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    Avançar <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ETAPA 3: DIETA E TREINO */}
            {step === 3 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-white">Estilo de Vida & Dieta</h3>
                  <p className="text-xs text-slate-300 mt-1">Passo 3 de 5: Como é a sua rotina atual?</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">Tipo de Dieta Preferida</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Flexível', 'Low Carb', 'Vegetariana / Vegana', 'Hipercalórica'].map((diet) => (
                      <button
                        key={diet}
                        type="button"
                        onClick={() => setDietType(diet)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                          dietType === diet
                            ? 'border-amber-500 bg-emerald-600/10 text-emerald-600'
                            : 'border-slate-800 bg-[#080d1a] text-slate-200 hover:border-slate-200'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <Utensils className="w-3.5 h-3.5" />
                          {diet}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-200 mb-1">Frequência de Treinos Semanais</label>
                  <select
                    value={weeklyFrequency}
                    onChange={(e) => setWeeklyFrequency(e.target.value)}
                    className="w-full bg-[#080d1a] border border-slate-800 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Sedentário (Não pratico exercícios)">Sedentário (Não pratico exercícios)</option>
                    <option value="1 a 2x por semana">1 a 2x por semana</option>
                    <option value="3 a 4x por semana">3 a 4x por semana</option>
                    <option value="5 a 6x por semana">5 a 6x por semana</option>
                    <option value="Todos os dias (Atleta)">Todos os dias (Atleta)</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 bg-white hover:bg-slate-200 text-slate-200 text-xs font-bold py-3 rounded-xl transition"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    Avançar <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ETAPA 4: OBJETIVOS (ATÉ 3 OPÇÕES) */}
            {step === 4 && (
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="text-center mb-3">
                  <h3 className="text-lg font-bold text-white">Quais são os seus Objetivos?</h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Passo 4 de 5: Selecione <span className="text-emerald-600 font-bold">até 3 opções</span> ({selectedGoals.length}/3 selecionadas)
                  </p>
                </div>

                <div className="space-y-2">
                  {availableGoals.map((goal) => {
                    const isSelected = selectedGoals.includes(goal);
                    return (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => handleGoalToggle(goal)}
                        className={`w-full p-3 rounded-xl text-left border text-xs font-bold transition flex items-center justify-between ${
                          isSelected
                            ? 'border-amber-500 bg-emerald-600/10 text-emerald-600'
                            : 'border-slate-800 bg-[#080d1a] text-slate-200 hover:border-slate-200'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-emerald-600" />
                          {goal}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-1/3 bg-white hover:bg-slate-200 text-slate-200 text-xs font-bold py-3 rounded-xl transition"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    Finalizar Cadastro <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ETAPA 5: BÔNUS DE BOAS-VINDAS */}
            {step === 5 && (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 bg-emerald-600/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
                  <Gift className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">Perfil Configurado, {name || 'Atleta'}!</h3>
                  <p className="text-xs text-slate-300 mt-1">Suas metas e dados de saúde foram salvos com sucesso.</p>
                </div>

                <div className="bg-[#080d1a] border border-amber-500/30 p-4 rounded-xl text-center">
                  <span className="text-xs text-slate-300 block">Bônus de Boas-Vindas MAVITAI</span>
                  <span className="text-2xl font-black text-emerald-600">+50 Mavicoins</span>
                </div>

                <button
                  onClick={handleCompleteRegister}
                  className="w-full bg-gradient-to-r from-emerald-500 to-orange-500 hover:opacity-90 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg"
                >
                  Ir para o Dashboard
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}