import React, { useState, useEffect } from 'react';
import { Term, CATEGORIES, Tonality } from '../types';
import { X, Edit2, Save } from 'lucide-react';

interface Props {
  editingTerm: Term | null;
  setEditingTerm: (term: Term | null) => void;
  onUpdateTerm: (term: Term) => void;
}

const GlossaryEditModal: React.FC<Props> = ({ editingTerm, setEditingTerm, onUpdateTerm }) => {
  const [editRoot, setEditRoot] = useState('');
  const [editMeaning, setEditMeaning] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editTonality, setEditTonality] = useState<Tonality>(Tonality.NEUTRAL);
  const [editSyllables, setEditSyllables] = useState(1);

  useEffect(() => {
    if (editingTerm) {
      setEditRoot(editingTerm.root);
      setEditMeaning(editingTerm.meaning);
      setEditDescription(editingTerm.description);
      setEditCategory(editingTerm.category);
      setEditTonality(editingTerm.tonality);
      setEditSyllables(editingTerm.syllables);
    }
  }, [editingTerm]);

  if (!editingTerm) return null;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTerm: Term = {
      ...editingTerm,
      root: editRoot,
      meaning: editMeaning,
      description: editDescription,
      category: editCategory,
      tonality: editTonality,
      syllables: editSyllables
    };
    onUpdateTerm(updatedTerm);
    setEditingTerm(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
       <div className="bg-slate-950 border border-slate-700 w-full max-w-2xl shadow-2xl relative corner-accent">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-widest">
              <Edit2 size={16} className="text-cyan-400" />
              Modificar Registro: <span className="text-cyan-400">{editingTerm.root}</span>
            </h2>
            <button onClick={() => setEditingTerm(null)} className="text-slate-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSaveEdit} className="p-8 space-y-6">
             <div className="grid grid-cols-2 gap-6">
               <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Raíz</label>
                 <input 
                  type="text" 
                  value={editRoot} 
                  onChange={e => setEditRoot(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-none px-3 py-2 text-white focus:border-cyan-500 outline-none font-mono"
                />
               </div>
               <div>
                 <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Significado Base</label>
                 <input 
                  type="text" 
                  value={editMeaning} 
                  onChange={e => setEditMeaning(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-none px-3 py-2 text-white focus:border-cyan-500 outline-none font-mono"
                />
               </div>
             </div>

             <div>
               <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Descripción / Matiz</label>
               <textarea 
                rows={3}
                value={editDescription} 
                onChange={e => setEditDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-none px-3 py-2 text-white focus:border-cyan-500 outline-none resize-none font-mono text-sm"
              />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Categoría</label>
                  <select 
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-none px-3 py-2 text-white focus:border-cyan-500 outline-none text-xs uppercase"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Tonalidad</label>
                  <select 
                    value={editTonality}
                    onChange={e => setEditTonality(e.target.value as Tonality)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-none px-3 py-2 text-white focus:border-cyan-500 outline-none text-xs uppercase"
                  >
                    {Object.values(Tonality).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">Sílabas</label>
                  <input 
                    type="number"
                    min="1"
                    max="10"
                    value={editSyllables}
                    onChange={e => setEditSyllables(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-none px-3 py-2 text-white focus:border-cyan-500 outline-none font-mono"
                  />
               </div>
             </div>

             <div className="flex justify-end pt-4 gap-4 border-t border-slate-800 mt-4">
               <button 
                type="button" 
                onClick={() => setEditingTerm(null)}
                className="px-6 py-2 text-slate-400 hover:text-white border border-transparent hover:border-slate-600 transition-colors uppercase text-xs font-bold tracking-widest"
              >
                Abortar
               </button>
               <button 
                type="submit"
                className="px-6 py-2 bg-cyan-700 hover:bg-cyan-600 text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2 border border-cyan-500"
              >
                <Save size={14} /> Confirmar Cambios
               </button>
             </div>
          </form>
       </div>
    </div>
  );
};

export default GlossaryEditModal;
