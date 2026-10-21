import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialData } from '../data/initialData';
import { Term, TaelimPreset, LexiData, NavigationTab } from '../types';

interface LexiconContextType {
  terms: Term[];
  presets: TaelimPreset[];
  isLoading: boolean;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  targetTaelimWord: string;
  setTargetTaelimWord: (word: string) => void;
  traceInTaelim: (word: string) => void;
  targetCalligramExpression: string;
  setTargetCalligramExpression: (expr: string) => void;
  forgeCalligram: (expr: string) => void;
  addTerm: (term: Term) => void;
  updateTerm: (term: Term) => void;
  deleteTerm: (id: string) => void;
  handleSavePreset: (preset: TaelimPreset) => void;
  handleDeletePreset: (id: string) => void;
  handleExport: () => void;
  handleImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LexiconContext = createContext<LexiconContextType | undefined>(undefined);

const STORAGE_KEY = 'lexicosmos_full_data_v4';

export const LexiconProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('glossary');
  const [targetTaelimWord, setTargetTaelimWord] = useState<string>('');
  const [targetCalligramExpression, setTargetCalligramExpression] = useState<string>('Thima · Varin\'Vim ·· Vor\'aen · Nu-Dar');
  const [terms, setTerms] = useState<Term[]>([]);
  const [presets, setPresets] = useState<TaelimPreset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const traceInTaelim = (word: string) => {
    setTargetTaelimWord(word);
    setActiveTab('taelim');
  };

  const forgeCalligram = (expr: string) => {
    if (expr && expr.trim()) {
      setTargetCalligramExpression(expr.trim());
    }
    setActiveTab('calligram');
  };

  // Load and Merge Strategy
  useEffect(() => {
    const loadData = () => {
      try {
        const storedJson = localStorage.getItem(STORAGE_KEY);
        // Fallback checks
        const oldJsonV3 = localStorage.getItem('lexicosmos_full_data_v3');
        const oldJsonV2 = localStorage.getItem('lexicosmos_data_v2');
        const oldJsonV1 = localStorage.getItem('lexicosmos_data');
        
        let loadedTerms: Term[] = [];
        let loadedPresets: TaelimPreset[] = [];

        if (storedJson) {
          const data = JSON.parse(storedJson) as LexiData;
          loadedTerms = data.terms || [];
          loadedPresets = data.presets || [];
        } else if (oldJsonV3) {
          const data = JSON.parse(oldJsonV3) as LexiData;
          loadedTerms = data.terms || [];
          loadedPresets = data.presets || [];
        } else if (oldJsonV2) {
          loadedTerms = JSON.parse(oldJsonV2);
        } else if (oldJsonV1) {
          loadedTerms = JSON.parse(oldJsonV1);
        }

        // Map initial canonical terms
        const initialMap = new Map(initialData.map(t => [t.root.toLowerCase(), t]));
        
        // Enrich any existing term with new canonical fields (tomo, phonetics, level, rich description)
        const enrichedExisting = loadedTerms.map(lt => {
          const match = initialMap.get(lt.root.toLowerCase());
          if (match) {
            return {
              ...match,
              ...lt,
              tomo: match.tomo || lt.tomo,
              phonetics: match.phonetics || lt.phonetics,
              level: match.level || lt.level,
              description: (match.description && match.description.length > (lt.description || '').length) ? match.description : lt.description
            };
          }
          return lt;
        });

        // Add any missing canonical terms from initialData
        const existingKeys = new Set(enrichedExisting.map(t => t.root.toLowerCase()));
        const mergedTerms = [...enrichedExisting];

        initialData.forEach(staticTerm => {
          if (!existingKeys.has(staticTerm.root.toLowerCase())) {
            mergedTerms.push(staticTerm);
            existingKeys.add(staticTerm.root.toLowerCase());
          }
        });

        // Sort by Root A-Z
        mergedTerms.sort((a, b) => a.root.localeCompare(b.root));

        setTerms(mergedTerms);
        setPresets(loadedPresets);
      } catch (e) {
        console.error("Failed to load/merge data", e);
        setTerms(initialData);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Persist data on change
  useEffect(() => {
    if (!isLoading) {
      const dataToSave: LexiData = {
        version: 3,
        terms: terms,
        presets: presets
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [terms, presets, isLoading]);

  const addTerm = (term: Term) => {
    setTerms(prev => {
      const updated = [term, ...prev];
      updated.sort((a, b) => a.root.localeCompare(b.root));
      return updated;
    });
    alert(`Radical "${term.root}" guardado exitosamente.`);
    setActiveTab('glossary'); 
  };

  const updateTerm = (updatedTerm: Term) => {
    setTerms(prev => prev.map(t => t.id === updatedTerm.id ? updatedTerm : t));
  };
  
  const deleteTerm = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este término?')) {
      setTerms(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSavePreset = (preset: TaelimPreset) => {
    setPresets(prev => [...prev, preset]);
  };

  const handleDeletePreset = (id: string) => {
    setPresets(prev => prev.filter(p => p.id !== id));
  };

  const handleExport = () => {
    const data: LexiData = {
      version: 3,
      terms: terms,
      presets: presets
    };
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `glosario_transversal_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const parsed = JSON.parse(json);
        
        let newTerms: Term[] = [];
        let newPresets: TaelimPreset[] = [];

        if (Array.isArray(parsed)) {
          newTerms = parsed;
        } else if (parsed.terms) {
          newTerms = parsed.terms;
          newPresets = parsed.presets || [];
        } else {
           throw new Error("Formato desconocido");
        }

        if (confirm(`Se han detectado ${newTerms.length} términos y ${newPresets.length} presets de estilos. ¿Deseas reemplazar la sesión actual?`)) {
          setTerms(newTerms);
          setPresets(newPresets);
          alert("Sesión restaurada correctamente.");
        }
      } catch (error) {
        alert("Error al importar el archivo. Asegúrate de que es un JSON válido.");
        console.error(error);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <LexiconContext.Provider value={{
      terms,
      presets,
      isLoading,
      activeTab,
      setActiveTab,
      targetTaelimWord,
      setTargetTaelimWord,
      traceInTaelim,
      targetCalligramExpression,
      setTargetCalligramExpression,
      forgeCalligram,
      addTerm,
      updateTerm,
      deleteTerm,
      handleSavePreset,
      handleDeletePreset,
      handleExport,
      handleImport
    }}>
      {children}
    </LexiconContext.Provider>
  );
};

export const useLexicon = () => {
  const context = useContext(LexiconContext);
  if (context === undefined) {
    throw new Error('useLexicon must be used within a LexiconProvider');
  }
  return context;
};
