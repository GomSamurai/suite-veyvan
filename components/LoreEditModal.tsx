import React, { useState, useEffect } from 'react';
import { X, Save, Edit3, Sparkles, Check, AlertCircle } from 'lucide-react';
import { 
  LeaderProfile, 
  CharacterDossier, 
  DeckSector, 
  HistoricalEra, 
  ThalvusWork,
  StationGlobalMetrics 
} from '../data/stationLoreData';

interface Props {
  entity: {
    type: 'leader' | 'character' | 'deck' | 'thalvusWork' | 'era' | 'metrics';
    item: any;
    workIndex?: number;
  } | null;
  onClose: () => void;
  onSave: (type: string, data: any, extra?: any) => void;
}

const LoreEditModal: React.FC<Props> = ({ entity, onClose, onSave }) => {
  const [formData, setFormData] = useState<any>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (entity) {
      setFormData(JSON.parse(JSON.stringify(entity.item)));
      setSavedSuccess(false);
    } else {
      setFormData(null);
    }
  }, [entity]);

  if (!entity || !formData) return null;

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: string, value: string) => {
    const arr = value.split('\n').map(s => s.trim()).filter(Boolean);
    setFormData((prev: any) => ({
      ...prev,
      [field]: arr
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(entity.type, formData, entity.workIndex);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const modalTitle = () => {
    switch (entity.type) {
      case 'leader': return `Editar Jerarca: ${formData.name || 'Líder'}`;
      case 'character': return `Editar Personaje: ${formData.name || 'Dossier'}`;
      case 'deck': return `Editar Sector: ${formData.name || 'Cubiertas'}`;
      case 'thalvusWork': return `Editar Obra de Thalvus: ${formData.title || 'Tratado'}`;
      case 'era': return `Editar Época Histórica: ${formData.title || 'Era'}`;
      case 'metrics': return `Editar Métricas Globales de Estación Humanidad`;
      default: return 'Editor de Lore // Modo Escriba';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in select-text">
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-950/95 border border-cyan-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado del Modal */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-slate-900/60 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
              <Edit3 size={16} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                Modo Escriba // Bóveda de Memoria
              </span>
              <h3 className="text-base sm:text-lg font-bold font-rajdhani text-white uppercase tracking-wider">
                {modalTitle()}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Cerrar sin guardar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulario Scrolleable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar text-xs font-sans">
          {savedSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 font-mono text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Check size={16} className="text-emerald-400" />
              <span>¡Cambios guardados con éxito en la memoria persistente!</span>
            </div>
          )}

          {/* ================================================================= */}
          {/* CAMPOS PARA LÍDER                                                */}
          {/* ================================================================= */}
          {entity.type === 'leader' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Nombre del Líder:</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-cyan-200 font-mono text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Epíteto / Apodo Histórico:</label>
                  <input
                    type="text"
                    value={formData.epithet || ''}
                    onChange={(e) => handleChange('epithet', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-cyan-200 font-mono text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Título Formal:</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Período de Mandato:</label>
                  <input
                    type="text"
                    value={formData.period || ''}
                    onChange={(e) => handleChange('period', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Años en el Trono:</label>
                  <input
                    type="number"
                    value={formData.mandateYears || 0}
                    onChange={(e) => handleChange('mandateYears', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Origen Terrestre / Nave:</label>
                  <input
                    type="text"
                    value={formData.origin || ''}
                    onChange={(e) => handleChange('origin', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Año Nacimiento:</label>
                  <input
                    type="text"
                    value={formData.birthYear || ''}
                    onChange={(e) => handleChange('birthYear', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Año Muerte / Destino:</label>
                  <input
                    type="text"
                    value={formData.deathYear || ''}
                    onChange={(e) => handleChange('deathYear', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400 font-bold">Cita Célebre / Frase de Mandato:</label>
                <textarea
                  value={formData.iconQuote || ''}
                  onChange={(e) => handleChange('iconQuote', e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-amber-200 italic font-serif text-xs outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Biografía & Ascenso:</label>
                <textarea
                  value={formData.biography || ''}
                  onChange={(e) => handleChange('biography', e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Crisis Definitoria del Mandato:</label>
                <textarea
                  value={formData.crisisAndAscent || ''}
                  onChange={(e) => handleChange('crisisAndAscent', e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Hitos Clave del Gobierno (un hito por línea):</label>
                <textarea
                  value={Array.isArray(formData.keyMilestones) ? formData.keyMilestones.join('\n') : ''}
                  onChange={(e) => handleArrayChange('keyMilestones', e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 font-mono text-xs outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-rose-400 font-bold">Ocaso, Muerte o Destitución:</label>
                  <textarea
                    value={formData.downfallAndLegacy || ''}
                    onChange={(e) => handleChange('downfallAndLegacy', e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-rose-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-amber-400 font-bold">Veredicto Histórico de la Estación:</label>
                  <textarea
                    value={formData.historicalVerdict || ''}
                    onChange={(e) => handleChange('historicalVerdict', e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* CAMPOS PARA PERSONAJE                                             */}
          {/* ================================================================= */}
          {entity.type === 'character' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Nombre Completo:</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-cyan-200 font-mono text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Alias / Sobrenombre:</label>
                  <input
                    type="text"
                    value={formData.alias || ''}
                    onChange={(e) => handleChange('alias', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-cyan-200 font-mono text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Rol / Oficio:</label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Facción o Alianza:</label>
                  <input
                    type="text"
                    value={formData.faction || ''}
                    onChange={(e) => handleChange('faction', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Cubierta de Origen:</label>
                  <input
                    type="text"
                    value={formData.deckOrigin || ''}
                    onChange={(e) => handleChange('deckOrigin', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400 font-bold">Cita Característica:</label>
                <textarea
                  value={formData.quote || ''}
                  onChange={(e) => handleChange('quote', e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-amber-200 italic font-serif text-xs outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Descripción Física:</label>
                  <textarea
                    value={formData.physicalDesc || ''}
                    onChange={(e) => handleChange('physicalDesc', e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Psicología & Modo de Ser:</label>
                  <textarea
                    value={formData.psychology || ''}
                    onChange={(e) => handleChange('psychology', e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-rose-400 font-bold">Dilema Moral:</label>
                  <textarea
                    value={formData.moralDilemma || ''}
                    onChange={(e) => handleChange('moralDilemma', e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-rose-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Arma, Objeto o Herramienta:</label>
                  <textarea
                    value={formData.weaponOrTool || ''}
                    onChange={(e) => handleChange('weaponOrTool', e.target.value)}
                    rows={2}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Resumen del Arco Narrativo:</label>
                <textarea
                  value={formData.arcSummary || ''}
                  onChange={(e) => handleChange('arcSummary', e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* CAMPOS PARA SECTOR DE CUBIERTAS                                   */}
          {/* ================================================================= */}
          {entity.type === 'deck' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Nombre del Sector:</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-cyan-200 font-mono text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Rango de Cubiertas (ej. C001 - C012):</label>
                  <input
                    type="text"
                    value={formData.deckRange || ''}
                    onChange={(e) => handleChange('deckRange', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-cyan-200 font-mono text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Asignación Energética:</label>
                  <input
                    type="text"
                    value={formData.energyPct || ''}
                    onChange={(e) => handleChange('energyPct', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Rango de Temperatura:</label>
                  <input
                    type="text"
                    value={formData.tempRange || ''}
                    onChange={(e) => handleChange('tempRange', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Estado:</label>
                  <select
                    value={formData.status || 'funcional'}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  >
                    <option value="privilegiado">Privilegiado</option>
                    <option value="funcional">Funcional</option>
                    <option value="precario">Precario</option>
                    <option value="peligro">Peligro</option>
                    <option value="critico">Crítico</option>
                    <option value="muerto">Muerto / Abandonado</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Descripción Topológica:</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Vida Social y Ecosistema Humano:</label>
                <textarea
                  value={formData.socialLife || ''}
                  onChange={(e) => handleChange('socialLife', e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Lugares Notables (uno por línea):</label>
                <textarea
                  value={Array.isArray(formData.notableLocations) ? formData.notableLocations.join('\n') : ''}
                  onChange={(e) => handleArrayChange('notableLocations', e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 font-mono text-xs outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* CAMPOS PARA OBRA DE JOREN THALVUS                                 */}
          {/* ================================================================= */}
          {entity.type === 'thalvusWork' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Título del Tratado:</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-cyan-200 font-mono text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Año de Publicación:</label>
                  <input
                    type="number"
                    value={formData.year || 0}
                    onChange={(e) => handleChange('year', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-cyan-200 font-mono text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Concepto Clave:</label>
                <input
                  type="text"
                  value={formData.keyConcept || ''}
                  onChange={(e) => handleChange('keyConcept', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400 font-bold">Cita Textual de la Obra:</label>
                <textarea
                  value={formData.quote || ''}
                  onChange={(e) => handleChange('quote', e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-amber-200 italic font-serif text-xs outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Tesis Filosófica Central:</label>
                <textarea
                  value={formData.centralThesis || ''}
                  onChange={(e) => handleChange('centralThesis', e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50 leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Impacto Histórico en la Nave:</label>
                <textarea
                  value={formData.impactInStation || ''}
                  onChange={(e) => handleChange('impactInStation', e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-emerald-500/50 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* CAMPOS PARA MÉTRICAS GLOBALES                                     */}
          {/* ================================================================= */}
          {entity.type === 'metrics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Año Actual d.C.:</label>
                  <input
                    type="number"
                    value={formData.yearCurrent || 2952}
                    onChange={(e) => handleChange('yearCurrent', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-cyan-200 font-mono text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Años de Travesía:</label>
                  <input
                    type="number"
                    value={formData.travelYears || 344}
                    onChange={(e) => handleChange('travelYears', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-cyan-200 font-mono text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Cubiertas Activas:</label>
                  <input
                    type="number"
                    value={formData.activeDecks || 132}
                    onChange={(e) => handleChange('activeDecks', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-cyan-200 font-mono text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-bold">Población Activa Actual:</label>
                  <input
                    type="number"
                    value={formData.currentPopulation || 1200000}
                    onChange={(e) => handleChange('currentPopulation', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-amber-400 font-bold">Estado del Reactor:</label>
                  <input
                    type="text"
                    value={formData.reactorStatus || ''}
                    onChange={(e) => handleChange('reactorStatus', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-amber-200 text-xs outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Ubicación Actual / Estrella:</label>
                  <input
                    type="text"
                    value={formData.currentLocation || ''}
                    onChange={(e) => handleChange('currentLocation', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 text-xs outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Planeta Prometido (Destino):</label>
                  <input
                    type="text"
                    value={formData.promisedLand || ''}
                    onChange={(e) => handleChange('promisedLand', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-emerald-200 text-xs outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer de Acciones del Formulario */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
              <Sparkles size={12} className="text-amber-400" />
              <span>Los cambios se guardan directamente en tu navegador.</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white font-mono text-xs transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold font-mono text-xs uppercase transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.35)] flex items-center gap-1.5"
              >
                <Save size={14} />
                <span>Guardar en Memoria</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoreEditModal;
