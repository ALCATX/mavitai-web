'use client';

import React, { useState } from 'react';
import { X, Camera, Sparkles, CheckCircle2, Flame, RefreshCw, AlertCircle } from 'lucide-react';

interface ScannerFittModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AnalysisResult {
  dishName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  healthScore: number;
  aiAdvice: string;
}

export default function ScannerFittModal({ isOpen, onClose }: ScannerFittModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Converte o arquivo selecionado para base64 e envia para a API do Gemini
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        analyzeMealWithGemini(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeMealWithGemini = async (imageBase64: string) => {
    setIsAnalyzing(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageBase64 }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor.');
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setErrorMsg('Não foi possível analisar a foto. Verifique se a chave GEMINI_API_KEY no .env.local está correta e tente novamente.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setIsAnalyzing(false);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#0d1527] border border-slate-800 w-full max-w-lg rounded-2xl p-6 relative shadow-2xl my-8">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-600 hover:text-slate-900 p-1 rounded-lg hover:bg-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Título */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/10 border border-amber-500/30 flex items-center justify-center text-emerald-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Scanner IA Mavi (Gemini Vision)</h3>
            <p className="text-xs text-slate-600">Análise nutricional real com inteligência artificial</p>
          </div>
        </div>

        {/* TELA 1: CARREGAR IMAGEM */}
        {!selectedImage && (
          <div className="space-y-4">
            <label className="border-2 border-dashed border-slate-200 hover:border-amber-500/50 bg-[#080d1a] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition group">
              <div className="w-14 h-14 rounded-full bg-white group-hover:bg-emerald-600/20 text-slate-600 group-hover:text-emerald-600 flex items-center justify-center mb-3 transition">
                <Camera className="w-7 h-7" />
              </div>
              <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition">
                Tirar foto ou enviar da galeria
              </p>
              <p className="text-xs text-slate-500 mt-1">O Gemini irá identificar cada ingrediente real</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        )}

        {/* TELA 2: PROCESSANDO COM GEMINI */}
        {selectedImage && isAnalyzing && (
          <div className="text-center py-8 space-y-4">
            <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-amber-500 shadow-lg">
              <img src={selectedImage} alt="Prato Enviado" className="w-full h-full object-cover" />
              {/* Linha de Scanner Animada */}
              <div className="absolute inset-x-0 h-1 bg-emerald-500 shadow-[0_0_15px_#f59e0b] animate-bounce top-1/2" />
            </div>
            <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-sm">
              <RefreshCw className="w-4 h-4 animate-spin" />
              O Gemini 2.5 Flash está analisando sua refeição...
            </div>
            <p className="text-xs text-slate-600">Identificando ingredientes, peso aproximado e nutrientes</p>
          </div>
        )}

        {/* MENSAGEM DE ERRO (CASO OCORRA) */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              Erro na Leitura da Imagem
            </div>
            <p className="text-xs text-slate-700">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="w-full bg-white hover:bg-slate-200 text-slate-900 text-xs font-bold py-2.5 rounded-xl transition"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* TELA 3: RESULTADO DA ANÁLISE REAL */}
        {selectedImage && !isAnalyzing && result && (
          <div className="space-y-5">
            {/* Foto e Nome do Prato Reconhecido */}
            <div className="flex gap-4 items-center bg-[#080d1a] p-3 rounded-xl border border-slate-800">
              <img src={selectedImage} alt="Refeição" className="w-20 h-20 rounded-lg object-cover border border-slate-200" />
              <div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Ingredientes identificados pela IA
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{result.dishName}</h4>
                <div className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                  <span>Score Nutricional:</span>
                  <span className="font-bold text-emerald-400">{result.healthScore}/100</span>
                </div>
              </div>
            </div>

            {/* Total Calórico */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-orange-500/10 border border-amber-500/30 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-600 flex items-center justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-600 block">Total Calórico Calculado</span>
                  <span className="text-2xl font-black text-emerald-600">{result.calories} kcal</span>
                </div>
              </div>
            </div>

            {/* Macronutrientes Reais */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#080d1a] p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-600 block font-semibold">Proteínas</span>
                <span className="text-lg font-bold text-blue-400">{result.protein}g</span>
              </div>
              <div className="bg-[#080d1a] p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-600 block font-semibold">Carboidratos</span>
                <span className="text-lg font-bold text-emerald-400">{result.carbs}g</span>
              </div>
              <div className="bg-[#080d1a] p-3 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-600 block font-semibold">Gorduras</span>
                <span className="text-lg font-bold text-rose-400">{result.fats}g</span>
              </div>
            </div>

            {/* Dica do Gemini */}
            <div className="bg-[#080d1a] p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Análise da IA Mavi
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{result.aiAdvice}</p>
            </div>

            {/* Ações */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleReset}
                className="w-1/3 bg-white hover:bg-slate-200 text-slate-700 text-xs font-bold py-3 rounded-xl transition"
              >
                Escanear Outro
              </button>
              <button
                onClick={onClose}
                className="w-2/3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Salvar no Diário
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}