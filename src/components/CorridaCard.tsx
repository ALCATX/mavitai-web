'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CorridaCardProps {
  onEarnMavicoins: (amount: number) => void;
}

type Modalidade = 'corrida-rua' | 'esteira' | 'bike-rua' | 'bike-academia';
type IntensidadeBike = 'leve' | 'moderada' | 'intensa';

const CONFIG_MODALIDADES: Record<
  Modalidade,
  {
    label: string;
    icone: string;
    usaGps: boolean;
    tipo: 'corrida' | 'bike';
    mvPorKm: number;
  }
> = {
  'corrida-rua': {
    label: 'Corrida Rua (GPS)',
    icone: '🏃‍♂️',
    usaGps: true,
    tipo: 'corrida',
    mvPorKm: 20,
  },
  esteira: {
    label: 'Esteira',
    icone: '👟',
    usaGps: false,
    tipo: 'corrida',
    mvPorKm: 20,
  },
  'bike-rua': {
    label: 'Bike Rua (GPS)',
    icone: '🚴‍♂️',
    usaGps: true,
    tipo: 'bike',
    mvPorKm: 10,
  },
  'bike-academia': {
    label: 'Bike Academia',
    icone: '🚲',
    usaGps: false,
    tipo: 'bike',
    mvPorKm: 10,
  },
};

// Cálculo da distância entre duas coordenadas (Fórmula de Haversine em km)
function calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function CorridaCard({ onEarnMavicoins }: CorridaCardProps) {
  const [modalidade, setModalidade] = useState<Modalidade>('corrida-rua');
  const [intensidadeBike, setIntensidadeBike] = useState<IntensidadeBike>('moderada');
  const [ativo, setAtivo] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [distanciaGpsKm, setDistanciaGpsKm] = useState(0);
  const [distanciaIndoorInput, setDistanciaIndoorInput] = useState('');
  const [velocidadeMediaInput, setVelocidadeMediaInput] = useState('');
  const [pesoKg, setPesoKg] = useState(70);
  const [erroGps, setErroGps] = useState<string | null>(null);
  const [ultimoResumo, setUltimoResumo] = useState<{
    atividade: string;
    km: string;
    calorias: number;
    mv: number;
  } | null>(null);

  const ultimaPosicaoRef = useRef<{ lat: number; lon: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const infoAtual = CONFIG_MODALIDADES[modalidade];

  // Cronômetro em segundos
  useEffect(() => {
    if (!ativo) return;
    const intervalo = setInterval(() => {
      setSegundos((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(intervalo);
  }, [ativo]);

  // Rastreamento GPS para modalidades ao ar livre (Corrida Rua e Bike Rua)
  useEffect(() => {
    if (!ativo || !infoAtual.usaGps) {
      if (watchIdRef.current !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setErroGps('GPS não disponível neste navegador. Use o botão de simulação para testar.');
      return;
    }

    setErroGps(null);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        if (accuracy > 50) return;

        if (ultimaPosicaoRef.current) {
          const trecho = calcularDistanciaKm(
            ultimaPosicaoRef.current.lat,
            ultimaPosicaoRef.current.lon,
            latitude,
            longitude
          );
          if (trecho > 0.003) {
            setDistanciaGpsKm((prev) => prev + trecho);
            ultimaPosicaoRef.current = { lat: latitude, lon: longitude };
          }
        } else {
          ultimaPosicaoRef.current = { lat: latitude, lon: longitude };
        }
      },
      () => {
        setErroGps(
          'Permissão de localização negada ou indisponível no PC. Use o botão de simulação para testar.'
        );
      },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    );

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [ativo, infoAtual.usaGps]);

  const formatarTempo = (totalSegundos: number) => {
    const mins = Math.floor(totalSegundos / 60);
    const segs = totalSegundos % 60;
    return `${String(mins).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;
  };

  // Cálculo da distância atual (GPS ou Indoor por km direto / velocidade média × tempo)
  const distanciaDigitada = Math.max(0, parseFloat(distanciaIndoorInput.replace(',', '.')) || 0);
  const velocidadeDigitada = Math.max(0, parseFloat(velocidadeMediaInput.replace(',', '.')) || 0);
  const distanciaPorVelocidade =
    velocidadeDigitada > 0 && segundos > 0 ? velocidadeDigitada * (segundos / 3600) : 0;

  const kmAtual = infoAtual.usaGps
    ? distanciaGpsKm
    : distanciaDigitada > 0
    ? distanciaDigitada
    : distanciaPorVelocidade;

  // Fator calórico por km de acordo com o esporte e intensidade
  const fatorBikePorKm =
    intensidadeBike === 'leve' ? 0.45 : intensidadeBike === 'intensa' ? 0.68 : 0.55;
  const fatorPorKm = infoAtual.tipo === 'corrida' ? 1.036 : fatorBikePorKm;

  const caloriasEstimadas =
    kmAtual > 0
      ? Math.round(pesoKg * kmAtual * fatorPorKm)
      : Math.round((segundos / 60) * (pesoKg * (infoAtual.tipo === 'corrida' ? 0.1 : 0.08)));

  const iniciarTreino = () => {
    setUltimoResumo(null);
    setSegundos(0);
    setDistanciaGpsKm(0);
    setDistanciaIndoorInput('');
    setVelocidadeMediaInput('');
    ultimaPosicaoRef.current = null;
    setAtivo(true);
  };

  const finalizarTreino = () => {
    setAtivo(false);
    const distanciaFinal = kmAtual;
    const mvGanhos =
      distanciaFinal > 0
        ? Math.max(5, Math.round(distanciaFinal * infoAtual.mvPorKm))
        : segundos >= 10
        ? 5
        : 0;

    if (mvGanhos > 0) {
      onEarnMavicoins(mvGanhos);
    }

    setUltimoResumo({
      atividade: infoAtual.label,
      km: distanciaFinal.toFixed(2),
      calorias: caloriasEstimadas,
      mv: mvGanhos,
    });
  };

  const incrementoSimulacao = infoAtual.tipo === 'bike' ? 1.0 : 0.5;

  return (
    <section className="max-w-6xl mx-auto mt-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      {/* Cabeçalho */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-2xl">{infoAtual.icone}</span>
            <h2 className="text-xl font-bold text-slate-900">
              Monitor de Atividades (Corrida & Bike)
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              +{infoAtual.mvPorKm} MV / km
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Acompanhe seus km e calorias na rua (GPS), na esteira ou na bike e ganhe Mavicoins.
          </p>
        </div>

        {/* Seletor das 4 Modalidades */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {(Object.keys(CONFIG_MODALIDADES) as Modalidade[]).map((chave) => {
            const item = CONFIG_MODALIDADES[chave];
            const selecionado = modalidade === chave;
            return (
              <button
                key={chave}
                type="button"
                disabled={ativo}
                onClick={() => setModalidade(chave)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  selecionado
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200'
                } ${ativo ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {item.icone} {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Painel de Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500">Distância</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            {kmAtual.toFixed(2)} <span className="text-sm font-semibold text-emerald-600">km</span>
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500">Tempo</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{formatarTempo(segundos)}</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500">Calorias Perdidas</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {caloriasEstimadas} <span className="text-sm font-semibold text-slate-600">kcal</span>
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500">Seu Peso (p/ cálculo)</p>
          <div className="flex items-center gap-1.5 mt-1">
            <input
              type="number"
              min={30}
              max={250}
              value={pesoKg}
              onChange={(e) => setPesoKg(Math.max(30, Number(e.target.value) || 70))}
              className="w-16 px-2 py-1 text-base font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-500"
            />
            <span className="text-sm font-semibold text-slate-600">kg</span>
          </div>
        </div>
      </div>

      {/* Seletor de Intensidade específico para Bike */}
      {infoAtual.tipo === 'bike' && (
        <div className="mb-5 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-slate-800">Intensidade do Pedal</p>
            <p className="text-xs text-slate-600">
              Ajusta o gasto calórico conforme a carga ou ritmo da pedalada.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(
              [
                { id: 'leve', nome: 'Leve' },
                { id: 'moderada', nome: 'Moderada' },
                { id: 'intensa', nome: 'Intensa / Spinning' },
              ] as { id: IntensidadeBike; nome: string }[]
            ).map((nivel) => (
              <button
                key={nivel.id}
                type="button"
                onClick={() => setIntensidadeBike(nivel.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                  intensidadeBike === nivel.id
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {nivel.nome}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Campos específicos para modalidades Indoor (Esteira ou Bike Academia) */}
      {!infoAtual.usaGps && (
        <div className="mb-5 bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-800">
              Distância marcada no visor (km)
            </label>
            <p className="text-xs text-slate-600 mb-2">
              {modalidade === 'esteira'
                ? 'Informe os km mostrados no painel da esteira.'
                : 'Informe os km mostrados no visor da bicicleta ergométrica.'}
            </p>
            <input
              type="text"
              inputMode="decimal"
              placeholder={modalidade === 'esteira' ? 'Ex: 3.5' : 'Ex: 12.4'}
              value={distanciaIndoorInput}
              onChange={(e) => setDistanciaIndoorInput(e.target.value)}
              className="w-full sm:w-44 px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800">
              Ou velocidade média (km/h)
            </label>
            <p className="text-xs text-slate-600 mb-2">
              Se o visor não marcar km, calculamos a distância pelo tempo × velocidade.
            </p>
            <input
              type="text"
              inputMode="decimal"
              placeholder={modalidade === 'esteira' ? 'Ex: 8.5' : 'Ex: 22.0'}
              value={velocidadeMediaInput}
              onChange={(e) => setVelocidadeMediaInput(e.target.value)}
              disabled={distanciaDigitada > 0}
              className="w-full sm:w-44 px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            />
          </div>
        </div>
      )}

      {/* Aviso de GPS */}
      {erroGps && infoAtual.usaGps && (
        <div className="mb-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
          {erroGps}
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex flex-wrap items-center gap-3">
        {!ativo ? (
          <button
            type="button"
            onClick={iniciarTreino}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
          >
            ▶ Iniciar {infoAtual.label}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={finalizarTreino}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
            >
              ⏹ Finalizar e Resgatar MV
            </button>

            {infoAtual.usaGps && (
              <button
                type="button"
                onClick={() => setDistanciaGpsKm((prev) => prev + incrementoSimulacao)}
                className="px-4 py-3 rounded-xl font-semibold text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 transition"
              >
                +{incrementoSimulacao.toFixed(1)} km (Simular teste)
              </button>
            )}
          </>
        )}
      </div>

      {/* Resumo ao concluir o treino */}
      {ultimoResumo && (
        <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-sm text-emerald-900">
            <strong>Treino concluído ({ultimoResumo.atividade}):</strong> {ultimoResumo.km} km
            percorridos • <strong>{ultimoResumo.calorias} kcal</strong> queimadas.
          </div>
          <span className="text-sm font-extrabold text-emerald-700">
            +{ultimoResumo.mv} MV adicionados!
          </span>
        </div>
      )}
    </section>
  );
}