import React, { useMemo } from 'react';
import { Term, Tonality } from '../types';
import { 
  calculateLetterDistribution, 
  calculateVowelConsonantRatio, 
  calculateWordLengthDist,
  calculateTonalityDist,
  calculateCategoryDist
} from '../utils/statistics';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, Legend, AreaChart, Area, CartesianGrid 
} from 'recharts';

interface Props {
  terms: Term[];
}

const ChartContainer = ({ title, children, wide = false }: { title: string, children?: React.ReactNode, wide?: boolean }) => (
  <div className={`bg-slate-950 border border-slate-800 relative p-6 ${wide ? 'lg:col-span-2' : ''} group hover:border-cyan-900/50 transition-colors`}>
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500"></div>
    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500"></div>
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500"></div>
    
    <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-6 flex items-center gap-2">
      <span className="w-1 h-4 bg-cyan-500 inline-block"></span>
      {title}
    </h3>
    {children}
  </div>
);

const StatsDashboard: React.FC<Props> = ({ terms }) => {
  const letterDist = useMemo(() => calculateLetterDistribution(terms), [terms]);
  const vcRatio = useMemo(() => calculateVowelConsonantRatio(terms), [terms]);
  const lengthDist = useMemo(() => calculateWordLengthDist(terms), [terms]);
  const tonalityDist = useMemo(() => calculateTonalityDist(terms), [terms]);
  const categoryDist = useMemo(() => calculateCategoryDist(terms), [terms]);

  const totalTerms = terms.length;
  const avgLength = useMemo(() => {
    if (totalTerms === 0) return 0;
    const totalChars = terms.reduce((acc, t) => acc + (t.root ? String(t.root).length : 0), 0);
    return (totalChars / totalTerms).toFixed(2);
  }, [terms, totalTerms]);

  // Neon Palette
  const COLORS = {
    cyan: '#06b6d4',
    teal: '#14b8a6',
    purple: '#a855f7',
    orange: '#f97316',
    slate: '#475569',
    grid: '#1e293b',
    text: '#94a3b8'
  };

  return (
    <div className="p-2 md:p-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in max-w-[1600px] mx-auto">
      
      {/* KPI Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 mb-2">
        <div className="bg-slate-950 p-6 border-l-4 border-cyan-500 relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10 text-cyan-500"><svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg></div>
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Total Registros</h3>
          <p className="text-5xl font-bold text-white font-mono-nums">{totalTerms}</p>
        </div>
        
        <div className="bg-slate-950 p-6 border-l-4 border-emerald-500 relative overflow-hidden">
          <div className="absolute right-0 top-0 p-4 opacity-10 text-emerald-500"><svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg></div>
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Longitud Media</h3>
          <p className="text-5xl font-bold text-emerald-400 font-mono-nums">{avgLength} <span className="text-sm text-slate-600 align-top mt-2 inline-block">CHARS</span></p>
        </div>
        
        <div className="bg-slate-950 p-6 border-l-4 border-purple-500 relative overflow-hidden">
           <div className="absolute right-0 top-0 p-4 opacity-10 text-purple-500"><svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg></div>
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Clases Activas</h3>
          <p className="text-5xl font-bold text-purple-400 font-mono-nums">{categoryDist.length}</p>
        </div>
      </div>

      {/* Tonalidad Chart */}
      <ChartContainer title="Espectro Tonal">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={tonalityDist}
              innerRadius={70}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {tonalityDist.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#fff', fontSize: '12px', textTransform: 'uppercase' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend 
               layout="vertical" verticalAlign="middle" align="right"
               wrapperStyle={{fontSize: '10px', textTransform: 'uppercase', fontFamily: 'monospace'}}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Word Length Chart */}
      <ChartContainer title="Densidad de Caracteres">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={lengthDist}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
            <XAxis dataKey="name" stroke={COLORS.text} fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke={COLORS.text} fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#fff' }}
              cursor={{stroke: COLORS.cyan, strokeWidth: 1}}
            />
            <Area type="step" dataKey="value" stroke={COLORS.cyan} fill={COLORS.cyan} fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Top Letters Chart */}
      <ChartContainer title="Frecuencia de Glifos">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={letterDist}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
            <XAxis dataKey="name" stroke={COLORS.text} fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke={COLORS.text} fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{fill: COLORS.grid}}
              contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#fff' }}
            />
            <Bar dataKey="value" fill={COLORS.purple} radius={[2, 2, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

       {/* Category Distribution (Horizontal Bar) */}
       <ChartContainer title="Distribución Categórica" wide>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryDist} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} horizontal={false} />
            <XAxis type="number" stroke={COLORS.text} fontSize={10} tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" width={180} stroke={COLORS.text} style={{fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase'}} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{fill: COLORS.grid}}
              contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#fff' }}
            />
            <Bar dataKey="value" fill={COLORS.orange} radius={[0, 2, 2, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Vowel vs Consonant */}
      <ChartContainer title="Ratio Fonético">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={vcRatio}
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={0}
              dataKey="value"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
              stroke="none"
            >
               {vcRatio.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.cyan : '#334155'} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#fff' }}
            />
            <Legend layout="horizontal" verticalAlign="bottom" wrapperStyle={{fontSize: '10px', textTransform: 'uppercase'}} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

    </div>
  );
};

export default StatsDashboard;