import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend, ComposedChart, Area
} from 'recharts';
import { VARIABLES, CURRENT_NE, calcThresholdSE, calcThresholdE0 } from './mockData';
import type { Screen } from './types';

interface Props { onNavigate: (s: Screen, id?: string) => void; }

export default function ScreenTrends({ onNavigate }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>(['v1']);
  const [showNE, setShowNE] = useState(true);

  const toggleVar = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

  const selectedVars = VARIABLES.filter(v => selectedIds.includes(v.id));

  // Build unified dataset from shared trend dates (all variables share same dates)
  const dates = VARIABLES[0].trend_dates;
  const chartData = dates.map((date, i) => {
    const row: Record<string, number | string> = { date };
    VARIABLES.forEach(v => {
      if (selectedIds.includes(v.id)) {
        row[v.id] = v.trend[i];
      }
    });
    if (showNE) row['ne'] = VARIABLES[0].ne_trend[i];
    return row;
  });

  const mainVar = selectedVars[0] || VARIABLES[0];
  const tSE = calcThresholdSE(CURRENT_NE);
  const tE0 = calcThresholdE0(CURRENT_NE);

  // Compute simple trend analysis
  const analyzeTrend = (v: typeof VARIABLES[0]) => {
    const recent = v.trend.slice(-4);
    const delta = recent[recent.length - 1] - recent[0];
    if (delta > 5) return { label: 'Ascendente', icon: <TrendingUp size={13} className="text-red-500" />, color: 'text-red-600' };
    if (delta < -5) return { label: 'Descendente', icon: <TrendingDown size={13} className="text-emerald-500" />, color: 'text-emerald-600' };
    return { label: 'Estable', icon: <Minus size={13} className="text-slate-400" />, color: 'text-slate-500' };
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Gráficos de tendencia y análisis</h2>
        <p className="text-xs text-slate-500">Últimas 12 lecturas · Presa de Bembézar</p>
      </div>

      {/* Variable selector */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Seleccionar variables a representar</p>
        <div className="flex flex-wrap gap-2">
          {VARIABLES.map((v, i) => (
            <button
              key={v.id}
              onClick={() => toggleVar(v.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${selectedIds.includes(v.id) ? 'border-blue-400 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: selectedIds.includes(v.id) ? COLORS[i] : '#e2e8f0' }} />
              {v.name}
            </button>
          ))}
          <button
            onClick={() => setShowNE(v => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${showNE ? 'border-teal-400 bg-teal-50 text-teal-800' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: showNE ? '#0d9488' : '#e2e8f0' }} />
            NE Embalse (SAIH)
          </button>
        </div>
      </div>

      {/* Main multi-var chart */}
      {selectedVars.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-sm font-bold text-slate-700 mb-1">Evolución temporal — variables seleccionadas</p>
          <p className="text-xs text-slate-400 mb-4">Nota: variables con unidades distintas pueden presentar escalas diferentes</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} yAxisId="left" domain={['auto', 'auto']} />
              {showNE && <YAxis tick={{ fontSize: 10 }} yAxisId="right" orientation="right" domain={['auto', 'auto']} />}
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {selectedVars.map((v, i) => (
                <Line key={v.id} yAxisId="left" type="monotone" dataKey={v.id} name={`${v.name} (${v.unit})`} stroke={COLORS[i]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              ))}
              {showNE && <Line yAxisId="right" type="monotone" dataKey="ne" name="NE Embalse (m.s.n.m.)" stroke="#0d9488" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />}
              {selectedIds.includes('v1') && <ReferenceLine yAxisId="left" y={tSE} stroke="#f59e0b" strokeDasharray="5 3" label={{ value: 'Umbral S.E.', fontSize: 9, fill: '#b45309', position: 'right' }} />}
              {selectedIds.includes('v1') && <ReferenceLine yAxisId="left" y={tE0} stroke="#ef4444" strokeDasharray="5 3" label={{ value: 'Umbral E.0', fontSize: 9, fill: '#dc2626', position: 'right' }} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Individual var analysis cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedVars.map((v, i) => {
          const trend = analyzeTrend(v);
          const last = v.trend[v.trend.length - 1];
          const prev = v.trend[v.trend.length - 2];
          const delta = last - prev;
          const pct = prev !== 0 ? ((delta / prev) * 100) : 0;

          return (
            <div key={v.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{v.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{v.code}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${trend.color}`}>
                  {trend.icon}
                  {trend.label}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-3">
                {[
                  { label: 'Valor actual', value: `${last.toFixed(1)} ${v.unit}`, color: 'text-slate-800' },
                  { label: 'Variación', value: `${delta >= 0 ? '+' : ''}${delta.toFixed(1)} ${v.unit}`, color: delta > 0 ? 'text-red-600' : delta < 0 ? 'text-emerald-600' : 'text-slate-500' },
                  { label: '% cambio', value: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`, color: pct > 5 ? 'text-red-600' : pct < -5 ? 'text-emerald-600' : 'text-slate-500' },
                ].map(item => (
                  <div key={item.label} className="text-center bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
                    <p className={`text-sm font-bold font-mono ${item.color}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              {v.threshold_se && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Margen respecto umbral S.E.</span>
                    <span className={`font-bold font-mono ${last > v.threshold_se ? 'text-red-600' : 'text-emerald-600'}`}>
                      {last > v.threshold_se ? '+' : ''}{(last - v.threshold_se).toFixed(1)} {v.unit}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${last > v.threshold_se ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min((last / (v.threshold_e0 ?? v.threshold_se * 2)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* NE correlation note */}
      {selectedIds.includes('v1') && showNE && (
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
          <p className="text-xs font-bold text-teal-800 uppercase tracking-wide mb-1">Correlación NE — Filtración Total</p>
          <p className="text-sm text-teal-800">
            El nivel del embalse (NE) ha pasado de 381,2 m.s.n.m. (07/05) a {CURRENT_NE} m.s.n.m. (19/05), un incremento de +2,4 m. Este aumento explica parcialmente el incremento observado en la filtración total, ya que el umbral de S.E. se calcula dinámicamente en función de NE.
          </p>
        </div>
      )}
    </div>
  );
}
