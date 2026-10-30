import React, { useState } from 'react';
import { MatrixProject, MatrixNode } from './types/matrix';
import { 
  X, 
  FolderOpen, 
  Download, 
  Upload, 
  Save, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles,
  FileCode,
  Image as ImageIcon
} from 'lucide-react';
import { 
  exportSvg, 
  exportPng, 
  exportJson, 
  exportTaelimCode, 
  copySvgCode 
} from './utils/exportUtils';
import { playSoftClick } from './utils/audioEngine';

interface Props {
  isOpen: boolean;
  currentProject: MatrixProject;
  svgElement: SVGSVGElement | null;
  onClose: () => void;
  onLoadProject: (project: MatrixProject) => void;
  onSaveProject: (name: string) => void;
  onShowToast: (msg: string) => void;
}

const STORAGE_KEY = 'taelim_matrix_compositor_projects_v2';
const LEGACY_KEY = 'algante_matrix_studio_projects_v2';

export function getSavedProjects(): MatrixProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveProjectToStorage(project: MatrixProject): MatrixProject[] {
  const current = getSavedProjects().filter(p => p.id !== project.id);
  const updated = [project, ...current].slice(0, 40);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteProjectFromStorage(id: string): MatrixProject[] {
  const current = getSavedProjects().filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  return current;
}

export const ProjectsVaultModal: React.FC<Props> = ({
  isOpen,
  currentProject,
  svgElement,
  onClose,
  onLoadProject,
  onSaveProject,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'vault' | 'export' | 'code'>('vault');
  const [projects, setProjects] = useState<MatrixProject[]>(getSavedProjects());
  const [saveName, setSaveName] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [pngScale, setPngScale] = useState<1 | 2 | 4>(2);
  const [pngBg, setPngBg] = useState<'dark' | 'transparent'>('dark');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!saveName.trim()) return;
    const project: MatrixProject = {
      ...currentProject,
      id: crypto.randomUUID(),
      name: saveName.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = saveProjectToStorage(project);
    setProjects(updated);
    setSaveName('');
    playSoftClick();
    onShowToast(`Proyecto "${project.name}" guardado en la bóveda`);
  };

  const handleDelete = (id: string) => {
    const updated = deleteProjectFromStorage(id);
    setProjects(updated);
    playSoftClick();
    onShowToast('Proyecto eliminado');
  };

  const handleCopySvg = async () => {
    if (!svgElement) return;
    const ok = await copySvgCode(svgElement);
    if (ok) {
      setCopiedCode(true);
      playSoftClick();
      onShowToast('Código SVG copiado al portapapeles');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCopyTaelimCode = async () => {
    const code = exportTaelimCode(currentProject.nodes, currentProject.name);
    await navigator.clipboard.writeText(code);
    setCopiedCode(true);
    playSoftClick();
    onShowToast('Definición de coordenadas Tael\'im copiada');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.nodes && parsed.nodes.length === 24) {
          onLoadProject(parsed);
          onClose();
          onShowToast('Proyecto importado con éxito');
        } else {
          alert('El archivo no contiene una matriz válida de 24 nodos.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#0b1320] border border-slate-700 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 bg-[#080e18] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FolderOpen size={18} className="text-amber-400" />
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Bóveda de Proyectos & Exportación
            </h3>
          </div>
          <button
            onClick={() => { playSoftClick(); onClose(); }}
            className="p-1 text-slate-400 hover:text-white rounded"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-[#070b13] px-4 gap-2">
          <button
            onClick={() => setActiveTab('vault')}
            className={`py-2.5 px-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'vault'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Bóveda Local ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`py-2.5 px-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'export'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Exportar Archivos (SVG / PNG)
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-2.5 px-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'code'
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Integración Tael'im (Código)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          {/* TAB 1: VAULT */}
          {activeTab === 'vault' && (
            <div className="space-y-4">
              {/* Save Current Project Box */}
              <div className="p-3 bg-[#070c14] border border-slate-800 rounded space-y-2">
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                  Guardar Composición Actual
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={saveName}
                    onChange={e => setSaveName(e.target.value)}
                    placeholder="Nombre del proyecto (ej. Retícula Litúrgica Alpha)..."
                    className="flex-1 bg-[#0a121e] border border-slate-700 px-3 py-2 text-xs font-mono text-white rounded outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleSave}
                    disabled={!saveName.trim()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-mono font-bold text-xs uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save size={13} />
                    <span>Guardar</span>
                  </button>
                </div>
              </div>

              {/* Projects List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Proyectos Almacenados en este Equipo:</span>
                  <label className="text-cyan-400 hover:underline cursor-pointer flex items-center gap-1">
                    <Upload size={12} />
                    <span>Importar Archivo JSON</span>
                    <input type="file" accept=".json" onChange={handleImportJson} hidden />
                  </label>
                </div>

                {projects.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded">
                    Aún no has guardado composiciones personalizadas. Asigna un nombre arriba para guardar tu primera matriz.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                    {projects.map(p => (
                      <div
                        key={p.id}
                        className="p-3 bg-[#080d16] border border-slate-800 hover:border-slate-700 rounded flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0">
                          <h5 className="font-mono font-bold text-xs text-white truncate">{p.name}</h5>
                          <span className="text-[10px] font-mono text-slate-500 block truncate">
                            {p.pattern} · {new Date(p.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              playSoftClick();
                              onLoadProject(p);
                              onClose();
                              onShowToast(`Proyecto "${p.name}" cargado`);
                            }}
                            className="px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-cyan-200 text-xs font-mono rounded"
                          >
                            Abrir
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1 hover:bg-red-950/80 text-slate-500 hover:text-red-300 rounded"
                            title="Eliminar"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Export SVG */}
                <div className="p-4 bg-[#070c14] border border-slate-800 rounded space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase">
                      <FileCode size={16} />
                      <span>Vector SVG (Máxima Resolución)</span>
                    </div>
                    <p className="text-[11px] font-sans text-slate-400">
                      Curvas vectoriales nativas puras con capas organizadas de nodos, guías y cálamo. Ideal para Illustrator, Figma o corte láser.
                    </p>
                  </div>
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        if (svgElement) exportSvg(svgElement, currentProject.name);
                        playSoftClick();
                        onShowToast('SVG descargado');
                      }}
                      className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-mono font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2"
                    >
                      <Download size={14} />
                      <span>Descargar Archivo SVG</span>
                    </button>
                    <button
                      onClick={handleCopySvg}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono rounded flex items-center justify-center gap-1.5"
                    >
                      {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      <span>Copiar Código SVG</span>
                    </button>
                  </div>
                </div>

                {/* Export PNG */}
                <div className="p-4 bg-[#070c14] border border-slate-800 rounded space-y-3 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                      <ImageIcon size={16} />
                      <span>Imagen PNG Rasterizada</span>
                    </div>
                    <p className="text-[11px] font-sans text-slate-400">
                      Renderizado rasterizado nítido con resolución multiplicada (hasta 4x Ultra HD Retina) y canal alfa transparente o fondo cósmico.
                    </p>
                  </div>

                  {/* PNG Options */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div>
                      <span className="text-[9px] text-slate-500 block mb-0.5">Resolución</span>
                      <select
                        value={pngScale}
                        onChange={e => setPngScale(Number(e.target.value) as any)}
                        className="w-full bg-[#0a121e] border border-slate-700 p-1.5 rounded text-xs text-white"
                      >
                        <option value={1}>1x (960 × 720)</option>
                        <option value={2}>2x HD (1920 × 1440)</option>
                        <option value={4}>4x Retina (3840 × 2880)</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-500 block mb-0.5">Fondo</span>
                      <select
                        value={pngBg}
                        onChange={e => setPngBg(e.target.value as any)}
                        className="w-full bg-[#0a121e] border border-slate-700 p-1.5 rounded text-xs text-white"
                      >
                        <option value="dark">Cósmico Oscuro</option>
                        <option value="transparent">Transparente</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (svgElement) exportPng(svgElement, pngScale, pngBg, currentProject.name);
                      playSoftClick();
                      onShowToast(`PNG @${pngScale}x generado`);
                    }}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs uppercase tracking-wider rounded flex items-center justify-center gap-2"
                  >
                    <Download size={14} />
                    <span>Descargar Imagen PNG</span>
                  </button>
                </div>
              </div>

              {/* Export JSON */}
              <div className="p-3 bg-[#070c14] border border-slate-800 rounded flex items-center justify-between">
                <div>
                  <h6 className="text-xs font-mono font-bold text-white">Copia de Seguridad JSON</h6>
                  <p className="text-[10px] text-slate-400">Descarga todos los parámetros matemáticos y coordenadas para recuperarlos en cualquier máquina.</p>
                </div>
                <button
                  onClick={() => {
                    exportJson(currentProject);
                    playSoftClick();
                    onShowToast('JSON de proyecto descargado');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded flex items-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Descargar JSON</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CODE */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-purple-300 font-bold uppercase">
                  Definición TypeScript / JavaScript para la Suite Veyvān:
                </span>
                <button
                  onClick={handleCopyTaelimCode}
                  className="px-3 py-1 bg-purple-900/60 hover:bg-purple-800 border border-purple-700 text-purple-200 text-xs font-mono rounded flex items-center gap-1.5"
                >
                  {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>Copiar al Portapapeles</span>
                </button>
              </div>

              <pre className="p-3 bg-[#060a12] border border-slate-800 rounded font-mono text-xs text-cyan-200 overflow-x-auto max-h-72 custom-scrollbar">
                {exportTaelimCode(currentProject.nodes, currentProject.name)}
              </pre>

              <p className="text-[11px] font-mono text-slate-400">
                Pega este fragmento en tu código fuente de Tael'im, Caligramas o glosarios para utilizar esta retícula personalizada como matriz canónica de renderizado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

