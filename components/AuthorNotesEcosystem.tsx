import React, { useState, useMemo, useEffect } from 'react';
import { 
  AuthorNote, 
  NoteThematicCategory, 
  NotePriority, 
  SmartLinkType, 
  SmartLoreLink 
} from '../utils/loreStorage';
import { 
  LORE_ENTITIES_CATALOG, 
  LORE_ENTITIES_MAP, 
  LoreEntityDefinition, 
  RELATIONSHIP_ROLES, 
  detectLoreEntitiesInText, 
  suggestThematicFromContent 
} from '../utils/loreEntitiesRegistry';
import { 
  Edit3, 
  Plus, 
  Trash2, 
  Pin, 
  Search, 
  Filter, 
  CheckCircle2, 
  Copy, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  Users, 
  Pill, 
  Layers, 
  Clock, 
  Compass, 
  Shield, 
  AlertTriangle, 
  Crown, 
  Tag, 
  Link2,
  FileText,
  AlertCircle,
  ExternalLink,
  Network,
  Zap,
  Download,
  Flame,
  ArrowRight
} from 'lucide-react';

export interface AuthorNotesEcosystemProps {
  sectionId: string;
  noteKey?: string;
  title: string;
  subtitle?: string;
  placeholder?: string;
  authorNotes: AuthorNote[];
  customThematics?: string[];
  onSaveNote: (note: AuthorNote) => void;
  onDeleteNote: (noteId: string) => void;
  onTogglePin?: (noteId: string) => void;
  onSaveCustomThematic?: (thematic: string) => void;
  onNavigateToEntity?: (type: 'character' | 'deck' | 'substance' | 'vortex' | 'section', id: string) => void;
}

export const CANONICAL_THEMATICS: Array<{
  id: string;
  label: string;
  color: string;
  border: string;
  bg: string;
  icon: React.ReactNode;
}> = [
  { id: 'Canon & Verdad', label: 'Canon & Verdad', color: 'text-emerald-300', border: 'border-emerald-500/40', bg: 'bg-emerald-500/15', icon: <Crown size={12} /> },
  { id: 'Borrador de Novela', label: 'Borrador de Novela', color: 'text-amber-300', border: 'border-amber-500/40', bg: 'bg-amber-500/15', icon: <FileText size={12} /> },
  { id: 'Personajes & Vínculos', label: 'Personajes & Vínculos', color: 'text-purple-300', border: 'border-purple-500/40', bg: 'bg-purple-500/15', icon: <Users size={12} /> },
  { id: 'Filosofía & Ontología', label: 'Filosofía & Ontología', color: 'text-indigo-300', border: 'border-indigo-500/40', bg: 'bg-indigo-500/15', icon: <Compass size={12} /> },
  { id: 'Farmacología & Quimio', label: 'Farmacología & Quimio', color: 'text-rose-300', border: 'border-rose-500/40', bg: 'bg-rose-500/15', icon: <Pill size={12} /> },
  { id: 'Topología & Cubiertas', label: 'Topología & Cubiertas', color: 'text-cyan-300', border: 'border-cyan-500/40', bg: 'bg-cyan-500/15', icon: <Layers size={12} /> },
  { id: 'Dossier HAVA & Secreto', label: 'Dossier HAVA & Secreto', color: 'text-red-400', border: 'border-red-500/40', bg: 'bg-red-500/15', icon: <AlertTriangle size={12} /> },
  { id: 'Tiempo & Cronosistema', label: 'Tiempo & Cronosistema', color: 'text-amber-400', border: 'border-amber-400/40', bg: 'bg-amber-400/15', icon: <Clock size={12} /> },
  { id: 'Castas & Alévoros', label: 'Castas & Alévoros', color: 'text-teal-300', border: 'border-teal-500/40', bg: 'bg-teal-500/15', icon: <Shield size={12} /> },
  { id: 'Trama & Estructura', label: 'Trama & Estructura', color: 'text-sky-300', border: 'border-sky-500/40', bg: 'bg-sky-500/15', icon: <BookOpen size={12} /> },
  { id: 'Duda / Por Resolver', label: 'Duda / Por Resolver', color: 'text-yellow-300', border: 'border-yellow-500/40', bg: 'bg-yellow-500/15', icon: <AlertCircle size={12} /> },
];

export const PRIORITY_CONFIG: Record<NotePriority, { label: string; badge: string }> = {
  crucial: { label: 'Crucial', badge: 'bg-rose-500/20 text-rose-300 border border-rose-500/40' },
  alta: { label: 'Alta', badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/40' },
  media: { label: 'Media', badge: 'bg-sky-500/20 text-sky-300 border border-sky-500/40' },
  borrador: { label: 'Borrador', badge: 'bg-slate-500/20 text-slate-300 border border-slate-500/40' },
};

export const SMART_LINK_TYPE_CONFIG: Record<SmartLinkType, { label: string; color: string; border: string; bg: string; icon: React.ReactNode }> = {
  personaje: { label: 'Personaje', color: 'text-purple-300', border: 'border-purple-500/40', bg: 'bg-purple-950/60', icon: <Users size={11} /> },
  facción: { label: 'Facción', color: 'text-indigo-300', border: 'border-indigo-500/40', bg: 'bg-indigo-950/60', icon: <Shield size={11} /> },
  cubierta: { label: 'Cubierta', color: 'text-cyan-300', border: 'border-cyan-500/40', bg: 'bg-cyan-950/60', icon: <Layers size={11} /> },
  sustancia: { label: 'Química', color: 'text-rose-300', border: 'border-rose-500/40', bg: 'bg-rose-950/60', icon: <Pill size={11} /> },
  vortice: { label: 'Vórtice', color: 'text-emerald-300', border: 'border-emerald-500/40', bg: 'bg-emerald-950/60', icon: <Compass size={11} /> },
  transversal: { label: 'Transversal', color: 'text-amber-300', border: 'border-amber-500/40', bg: 'bg-amber-950/60', icon: <Sparkles size={11} /> },
  historia: { label: 'Historia', color: 'text-yellow-300', border: 'border-yellow-500/40', bg: 'bg-yellow-950/60', icon: <Crown size={11} /> },
  novela: { label: 'Novela', color: 'text-sky-300', border: 'border-sky-500/40', bg: 'bg-sky-950/60', icon: <BookOpen size={11} /> },
  hava: { label: 'HAVA', color: 'text-red-400', border: 'border-red-500/50', bg: 'bg-red-950/70', icon: <AlertTriangle size={11} /> },
  cronosistema: { label: 'Tiempo', color: 'text-amber-400', border: 'border-amber-400/40', bg: 'bg-amber-950/60', icon: <Clock size={11} /> },
  apunte: { label: 'Apunte Relacionado', color: 'text-teal-300', border: 'border-teal-500/40', bg: 'bg-teal-950/60', icon: <FileText size={11} /> },
  personalizado: { label: 'Personalizado', color: 'text-slate-300', border: 'border-slate-500/40', bg: 'bg-slate-900/80', icon: <Tag size={11} /> },
};

export const AuthorNotesEcosystem: React.FC<AuthorNotesEcosystemProps> = ({
  sectionId,
  noteKey,
  title,
  subtitle,
  placeholder,
  authorNotes = [],
  customThematics = [],
  onSaveNote,
  onDeleteNote,
  onTogglePin,
  onSaveCustomThematic,
  onNavigateToEntity
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedThematicFilter, setSelectedThematicFilter] = useState<string>('all');
  const [selectedEntityFilter, setSelectedEntityFilter] = useState<string>('all');
  const [editingNote, setEditingNote] = useState<AuthorNote | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  
  // Modales
  const [previewEntity, setPreviewEntity] = useState<LoreEntityDefinition | null>(null);
  const [showGlobalMatrix, setShowGlobalMatrix] = useState<boolean>(false);
  const [showLinkPickerModal, setShowLinkPickerModal] = useState<boolean>(false);

  // Selector de vínculos inteligentes dentro del formulario
  const [linkPickerQuery, setLinkPickerQuery] = useState<string>('');
  const [linkPickerType, setLinkPickerType] = useState<SmartLinkType | 'all'>('all');
  const [customLinkName, setCustomLinkName] = useState<string>('');
  const [customLinkType, setCustomLinkType] = useState<SmartLinkType>('personalizado');
  const [customLinkRole, setCustomLinkRole] = useState<string>('Mención');

  // Formulario de edición/creación
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formThematic, setFormThematic] = useState<string>('Canon & Verdad');
  const [newCustomThematicInput, setNewCustomThematicInput] = useState('');
  const [isAddingNewThematic, setIsAddingNewThematic] = useState(false);
  const [formCustomTag, setFormCustomTag] = useState('');
  const [formPriority, setFormPriority] = useState<NotePriority>('alta');
  const [formSmartLinks, setFormSmartLinks] = useState<SmartLoreLink[]>([]);
  const [activeRolePopoverIndex, setActiveRolePopoverIndex] = useState<number | null>(null);

  // Autocompletado ágil en el editor (@ o [[)
  const [inlineMentionQuery, setInlineMentionQuery] = useState<string | null>(null);
  const [inlineMentionPrefix, setInlineMentionPrefix] = useState<'@' | '[[' | null>(null);
  const [mentionCursorPos, setMentionCursorPos] = useState<number>(0);
  const [downloadedNoteId, setDownloadedNoteId] = useState<string | null>(null);

  // Notas filtradas para esta sección o entidad específica
  const sectionNotes = useMemo(() => {
    return authorNotes.filter(n => {
      if (noteKey) {
        if (n.key === noteKey) return true;
        // Si es una entidad específica (ej: char_dreda, deck_C302-C320, leader_vireus),
        // incluir también cualquier apunte que tenga un vínculo inteligente a esa entidad
        const entityIdFromKey = noteKey.replace(/^(char_|deck_|leader_|era_|vortex_)/, '').toLowerCase();
        const hasSmartLinkMatch = n.smartLinks?.some(l => 
          l.id.toLowerCase() === entityIdFromKey || 
          l.name.toLowerCase().includes(entityIdFromKey)
        );
        if (hasSmartLinkMatch) return true;
        return false;
      }
      if (n.sectionId === sectionId) return true;
      return false;
    }).sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
    });
  }, [authorNotes, sectionId, noteKey]);

  // Lista unificada de temáticas disponibles (Canónicas + Personalizadas del usuario)
  const allAvailableThematics = useMemo(() => {
    const list: Array<{ id: string; label: string; isCustom?: boolean }> = CANONICAL_THEMATICS.map(c => ({
      id: c.id,
      label: c.label
    }));
    
    // Añadir temáticas custom guardadas
    customThematics.forEach(ct => {
      if (!list.some(l => l.id.toLowerCase() === ct.toLowerCase())) {
        list.push({ id: ct, label: ct, isCustom: true });
      }
    });

    // Añadir temáticas presentes en las notas
    authorNotes.forEach(n => {
      if (n.category && !list.some(l => l.id.toLowerCase() === n.category.toLowerCase())) {
        list.push({ id: n.category, label: n.category, isCustom: true });
      }
    });

    return list;
  }, [customThematics, authorNotes]);

  // Sugerencia dinámica inteligente de temática
  const suggestedThematic = useMemo(() => {
    return suggestThematicFromContent(`${formTitle} ${formContent}`, sectionId);
  }, [formTitle, formContent, sectionId]);

  // Escáner inteligente en vivo: Entidades detectadas en el texto
  const detectedEntitiesInForm = useMemo(() => {
    const existingIds = formSmartLinks.map(l => l.id);
    return detectLoreEntitiesInText(`${formTitle} ${formContent}`, existingIds);
  }, [formTitle, formContent, formSmartLinks]);

  // Filtrado reactivo de notas
  const filteredNotes = useMemo(() => {
    return sectionNotes.filter(n => {
      // Filtro por temática
      if (selectedThematicFilter !== 'all') {
        const normNoteTheme = (n.category || '').toLowerCase();
        const normFilter = selectedThematicFilter.toLowerCase();
        if (normNoteTheme !== normFilter) return false;
      }

      // Filtro por entidad vinculada
      if (selectedEntityFilter !== 'all') {
        const hasEntity = n.smartLinks?.some(l => l.id === selectedEntityFilter || l.name === selectedEntityFilter);
        if (!hasEntity) return false;
      }

      // Búsqueda textual
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const inTitle = n.title?.toLowerCase().includes(q);
      const inContent = n.content?.toLowerCase().includes(q);
      const inTag = n.customTag?.toLowerCase().includes(q);
      const inTheme = n.category?.toLowerCase().includes(q);
      const inLinks = n.smartLinks?.some(l => l.name.toLowerCase().includes(q) || l.role?.toLowerCase().includes(q));
      return inTitle || inContent || inTag || inTheme || inLinks;
    });
  }, [sectionNotes, selectedThematicFilter, selectedEntityFilter, searchQuery]);

  // Abrir creador con valores por defecto inteligentes y auto-previnculación
  const handleOpenCreate = () => {
    const defaultTheme = suggestThematicFromContent('', sectionId);
    setFormTitle('');
    setFormContent('');
    setFormThematic(defaultTheme);
    setFormCustomTag('');
    setFormPriority('alta');

    // Auto-previncular la entidad activa si estamos dentro de su ficha
    const preLinks: SmartLoreLink[] = [];
    if (noteKey) {
      const entityIdFromKey = noteKey.replace(/^(char_|deck_|leader_|era_|vortex_)/, '');
      const matchedEntity = LORE_ENTITIES_MAP.get(entityIdFromKey) || LORE_ENTITIES_CATALOG.find(e => e.id.toLowerCase() === entityIdFromKey.toLowerCase());
      if (matchedEntity) {
        preLinks.push({
          id: matchedEntity.id,
          type: matchedEntity.type,
          name: matchedEntity.name,
          role: matchedEntity.roleHint || 'Mención',
          detail: matchedEntity.detail
        });
      }
    }

    setFormSmartLinks(preLinks);
    setIsAddingNewThematic(false);
    setNewCustomThematicInput('');
    setEditingNote(null);
    setIsCreating(true);
    setIsOpen(true);
  };

  // Abrir editor de nota existente
  const handleOpenEdit = (note: AuthorNote) => {
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormThematic(note.category || 'Canon & Verdad');
    setFormCustomTag(note.customTag || '');
    setFormPriority(note.priority || 'alta');
    setFormSmartLinks(note.smartLinks ? [...note.smartLinks] : []);
    setIsAddingNewThematic(false);
    setNewCustomThematicInput('');
    setEditingNote(note);
    setIsCreating(false);
  };

  // Guardar formulario
  const handleSaveForm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formContent.trim()) {
      alert('Por favor escribe el contenido del apunte antes de guardar.');
      return;
    }

    const now = new Date().toISOString();
    const noteId = editingNote ? editingNote.id : `note_${sectionId}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const autoTitle = formTitle.trim() || formContent.trim().slice(0, 45) + '...';

    // Determinar temática final
    let finalThematic = formThematic.trim();
    if (isAddingNewThematic && newCustomThematicInput.trim()) {
      finalThematic = newCustomThematicInput.trim();
      if (onSaveCustomThematic) {
        onSaveCustomThematic(finalThematic);
      }
    }

    const savedNote: AuthorNote = {
      id: noteId,
      sectionId,
      key: noteKey || `section_${sectionId}`,
      title: autoTitle,
      content: formContent,
      category: finalThematic,
      customTag: formCustomTag.trim() || undefined,
      priority: formPriority,
      isPinned: editingNote ? editingNote.isPinned : false,
      smartLinks: formSmartLinks.length > 0 ? formSmartLinks : undefined,
      createdAt: editingNote ? editingNote.createdAt : now,
      updatedAt: now
    };

    onSaveNote(savedNote);
    setIsCreating(false);
    setEditingNote(null);
  };

  // Vincular entidad detectada automáticamente con un clic
  const handleAddDetectedEntity = (entity: LoreEntityDefinition) => {
    if (formSmartLinks.some(l => l.id === entity.id)) return;
    const newLink: SmartLoreLink = {
      id: entity.id,
      type: entity.type,
      name: entity.name,
      role: entity.roleHint || 'Mención',
      detail: entity.detail
    };
    setFormSmartLinks(prev => [...prev, newLink]);
  };

  // Vincular todas las entidades detectadas a la vez
  const handleAddAllDetectedEntities = () => {
    const toAdd: SmartLoreLink[] = detectedEntitiesInForm.map(entity => ({
      id: entity.id,
      type: entity.type,
      name: entity.name,
      role: entity.roleHint || 'Mención',
      detail: entity.detail
    }));
    setFormSmartLinks(prev => [...prev, ...toAdd]);
  };

  // Eliminar un vínculo inteligente del formulario
  const handleRemoveSmartLink = (index: number) => {
    setFormSmartLinks(prev => prev.filter((_, i) => i !== index));
    if (activeRolePopoverIndex === index) setActiveRolePopoverIndex(null);
  };

  // Cambiar el rol de un vínculo
  const handleSetLinkRole = (index: number, role: string) => {
    setFormSmartLinks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], role };
      return updated;
    });
    setActiveRolePopoverIndex(null);
  };

  // Añadir un vínculo desde el buscador o personalizado
  const handleAddLinkFromPicker = (entity: LoreEntityDefinition) => {
    if (formSmartLinks.some(l => l.id === entity.id)) return;
    setFormSmartLinks(prev => [
      ...prev,
      {
        id: entity.id,
        type: entity.type,
        name: entity.name,
        role: entity.roleHint || 'Mención',
        detail: entity.detail
      }
    ]);
    setShowLinkPickerModal(false);
    setLinkPickerQuery('');
  };

  // Añadir apunte de autor como enlace
  const handleAddNoteAsLink = (targetNote: AuthorNote) => {
    if (formSmartLinks.some(l => l.id === targetNote.id)) return;
    setFormSmartLinks(prev => [
      ...prev,
      {
        id: targetNote.id,
        type: 'apunte',
        name: targetNote.title,
        role: 'Apunte Relacionado',
        detail: `Sección: ${targetNote.sectionId}`
      }
    ]);
    setShowLinkPickerModal(false);
  };

  // Crear vínculo libre / ad-hoc
  const handleAddCustomAdHocLink = () => {
    if (!customLinkName.trim()) return;
    const newId = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setFormSmartLinks(prev => [
      ...prev,
      {
        id: newId,
        type: customLinkType,
        name: customLinkName.trim(),
        role: customLinkRole.trim() || 'Mención',
        detail: 'Concepto definido por el autor'
      }
    ]);
    setCustomLinkName('');
    setShowLinkPickerModal(false);
  };

  // Manejo de escritura con detección de @ y [[ para autocompletado en vivo
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const pos = e.target.selectionStart;
    setFormContent(text);
    setMentionCursorPos(pos);

    const textBeforeCursor = text.slice(0, pos);
    const matchWiki = textBeforeCursor.match(/\[\[([a-zA-Z0-9áéíóúñ\s'-]{0,25})$/i);
    const matchAt = textBeforeCursor.match(/@([a-zA-Z0-9áéíóúñ\s'-]{0,25})$/i);

    if (matchWiki) {
      setInlineMentionPrefix('[[');
      setInlineMentionQuery(matchWiki[1]);
    } else if (matchAt) {
      setInlineMentionPrefix('@');
      setInlineMentionQuery(matchAt[1]);
    } else {
      setInlineMentionQuery(null);
      setInlineMentionPrefix(null);
    }
  };

  const handleSelectInlineMention = (entity: LoreEntityDefinition) => {
    if (!inlineMentionPrefix) return;
    const textBeforeCursor = formContent.slice(0, mentionCursorPos);
    const textAfterCursor = formContent.slice(mentionCursorPos);

    let newBefore = '';
    if (inlineMentionPrefix === '[[') {
      newBefore = textBeforeCursor.replace(/\[\[[a-zA-Z0-9áéíóúñ\s'-]*$/, `[[${entity.name}]]`);
    } else {
      newBefore = textBeforeCursor.replace(/@[a-zA-Z0-9áéíóúñ\s'-]*$/, `[[${entity.name}]]`);
    }

    setFormContent(newBefore + textAfterCursor);
    setInlineMentionQuery(null);
    setInlineMentionPrefix(null);

    // Auto-vincular a smartLinks si aún no está presente
    if (!formSmartLinks.some(l => l.id === entity.id)) {
      setFormSmartLinks(prev => [
        ...prev,
        {
          id: entity.id,
          type: entity.type,
          name: entity.name,
          role: entity.roleHint || 'Mención',
          detail: entity.detail
        }
      ]);
    }
  };

  // Exportar apunte individual a Obsidian con Frontmatter YAML y Wikilinks
  const exportSingleNoteToObsidian = (note: AuthorNote) => {
    const tags = (note.customTag || '').split(/[,\s]+/).filter(t => t.length > 0).map(t => t.replace(/^#/, ''));
    const linksList = (note.smartLinks || []).map(l => `"[[${l.name}]]"`);
    const frontmatter = `---
title: "${note.title.replace(/"/g, '\\"')}"
thematic: "${note.category}"
priority: "${note.priority || 'alta'}"
section: "${note.sectionId}"
tags: [${tags.join(', ')}]
links: [${linksList.join(', ')}]
created: "${note.createdAt}"
updated: "${note.updatedAt}"
---

# ${note.title}
> *Sección: [[${note.sectionId}]] | Temática: ${note.category} | Prioridad: ${note.priority || 'alta'}*

${note.content}
`;
    const blob = new Blob([frontmatter], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = note.title.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/gi, '_').slice(0, 45);
    a.download = `${safeTitle}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadedNoteId(note.id);
    setTimeout(() => setDownloadedNoteId(null), 2000);
  };

  // Exportar todos los apuntes consolidados para Bóveda Obsidian
  const exportAllNotesToObsidianVault = (notes: AuthorNote[]) => {
    let masterDoc = `# ARCHIVO MAESTRO // CUADERNO DEL AUTOR // ESTACIÓN HUMANIDAD\n\n`;
    masterDoc += `> Compilación canónica de ${notes.length} apuntes, borradores y conexiones del Lore.\n`;
    masterDoc += `> Destino: Bóveda Obsidian [[ESTACION_HUMANIDAD]] // Fecha de Exportación: ${new Date().toISOString().slice(0, 10)}\n\n`;
    masterDoc += `## ÍNDICE DE APUNTES\n\n`;
    notes.forEach((n, idx) => {
      masterDoc += `${idx + 1}. [[${n.title}]] — *${n.category}* (Sección: [[${n.sectionId}]])\n`;
    });
    masterDoc += `\n---\n\n`;
    notes.forEach((n, idx) => {
      const linksList = (n.smartLinks || []).map(l => `[[${l.name}]]`).join(', ');
      masterDoc += `## ${idx + 1}. ${n.title}\n`;
      masterDoc += `* **Sección:** [[${n.sectionId}]]\n`;
      masterDoc += `* **Temática:** ${n.category}\n`;
      masterDoc += `* **Prioridad:** ${n.priority || 'alta'}\n`;
      if (linksList) masterDoc += `* **Vínculos Inteligentes:** ${linksList}\n`;
      if (n.customTag) masterDoc += `* **Tags:** ${n.customTag}\n`;
      masterDoc += `\n${n.content}\n\n---\n\n`;
    });

    const blob = new Blob([masterDoc], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Estacion_Humanidad_Cuaderno_Autor_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = (note: AuthorNote) => {
    const linksList = note.smartLinks?.map(l => `[[${l.name}]] (${l.role || l.type})`).join(', ') || 'Sin vínculos';
    const textToCopy = `### ${note.title}\n*Temática: ${note.category} | Prioridad: ${note.priority || 'normal'}*\n*Vínculos Inteligentes: ${linksList}*\n\n${note.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePin = (note: AuthorNote) => {
    if (onTogglePin) {
      onTogglePin(note.id);
    } else {
      onSaveNote({ ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() });
    }
  };

  const confirmDelete = (noteId: string) => {
    onDeleteNote(noteId);
    setDeletingId(null);
  };

  // Renderizador de texto con Wikilinks interactivos [[...]]
  const renderInteractiveContent = (content: string) => {
    const parts = content.split(/(\[\[[^\]]+\]\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const entityName = part.slice(2, -2).trim();
        const matchedEntity = LORE_ENTITIES_CATALOG.find(e => 
          e.name.toLowerCase() === entityName.toLowerCase() ||
          e.aliases.some(a => a.toLowerCase() === entityName.toLowerCase())
        );

        return (
          <button
            key={i}
            onClick={() => {
              if (matchedEntity) {
                setPreviewEntity(matchedEntity);
              }
            }}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 font-mono text-[11px] font-bold cursor-pointer transition-colors shadow-sm"
            title={matchedEntity ? `Ver ficha de ${matchedEntity.name}` : `Entidad de Lore: ${entityName}`}
          >
            <Link2 size={10} className="text-cyan-400" />
            <span>{entityName}</span>
          </button>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  // Buscar conexiones en el ecosistema (Backlinks bidireccionales)
  const getEcosystemConnections = (note: AuthorNote) => {
    const noteEntityIds = (note.smartLinks || []).map(l => l.id);
    const relatedNotes = authorNotes.filter(other => {
      if (other.id === note.id) return false;
      // Comparte misma entidad
      const sharesEntity = other.smartLinks?.some(otherLink => noteEntityIds.includes(otherLink.id));
      // O enlaza explícitamente a esta nota
      const linksToThis = other.smartLinks?.some(otherLink => otherLink.id === note.id);
      return sharesEntity || linksToThis;
    });
    return relatedNotes;
  };

  return (
    <div className="p-5 rounded-3xl bg-slate-950/85 border border-amber-500/30 backdrop-blur-2xl space-y-4 shadow-[0_0_35px_rgba(245,158,11,0.08)] transition-all">
      {/* ========================================================================= */}
      {/* CABECERA PRINCIPAL CON CONTADORES DINÁMICOS & ACCESOS GLOBALES */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-3.5">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-400 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Edit3 size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                Cuaderno del Autor // {title}
              </span>
              {sectionNotes.length > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {sectionNotes.length} {sectionNotes.length === 1 ? 'apunte' : 'apuntes'}
                </span>
              ) : (
                <span className="text-[10px] font-mono text-slate-500">0 apuntes</span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-sans block">
              {subtitle || "Ecosistema de apuntes interconectados para notas, borradores de la novela y canon..."}
            </span>
          </div>
        </div>

        {/* ACCIONES DE CABECERA: RED GLOBAL + NUEVO APUNTE + TOGGLE */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Botón Red Global del Autor */}
          <button
            onClick={() => setShowGlobalMatrix(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(34,211,238,0.2)]"
            title="Abrir la Red Global de Apuntes del Autor"
          >
            <Network size={14} className="text-cyan-400" />
            <span className="hidden md:inline">Red Global de Apuntes</span>
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/30 text-[10px]">{authorNotes.length}</span>
          </button>

          {/* Botón Nuevo Apunte */}
          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-mono text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Plus size={14} />
            <span>Nuevo Apunte</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isOpen ? "Plegar cuaderno" : "Desplegar cuaderno"}
          >
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-4 pt-1 animate-fade-in">
          {/* ========================================================================= */}
          {/* BARRA DE BÚSQUEDA Y FILTRADO MULTIDIMENSIONAL */}
          {/* ========================================================================= */}
          {sectionNotes.length > 0 && (
            <div className="p-3 rounded-2xl bg-black/50 border border-white/5 space-y-2.5">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Buscador de texto libre */}
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por título, contenido, etiqueta # o entidad..."
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 font-sans"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Filtro por Temática */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar text-[10px] font-mono">
                  <button
                    onClick={() => setSelectedThematicFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all shrink-0 cursor-pointer ${
                      selectedThematicFilter === 'all'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                        : 'text-slate-400 hover:text-slate-200 bg-white/5'
                    }`}
                  >
                    Todas ({sectionNotes.length})
                  </button>
                  {allAvailableThematics.map(cat => {
                    const count = sectionNotes.filter(n => (n.category || '').toLowerCase() === cat.id.toLowerCase()).length;
                    if (count === 0) return null;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedThematicFilter(cat.id)}
                        className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                          selectedThematicFilter.toLowerCase() === cat.id.toLowerCase()
                            ? 'bg-amber-500/25 text-amber-200 border border-amber-500/50 font-bold'
                            : 'text-slate-400 hover:text-slate-200 bg-white/5'
                        }`}
                      >
                        <span>{cat.label}</span>
                        <span className="opacity-70">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* FORMULARIO DINÁMICO DE CREACIÓN / EDICIÓN CON VÍNCULOS INTELIGENTES */}
          {/* ========================================================================= */}
          {(isCreating || editingNote) && (
            <div className="p-5 rounded-3xl bg-slate-900/95 border border-amber-500/40 shadow-2xl space-y-4 animate-fade-in relative backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="font-mono text-xs font-bold text-amber-300 uppercase flex items-center gap-2">
                  <Sparkles size={15} className="text-amber-400 animate-pulse" />
                  <span>{editingNote ? "Editar Apunte Inteligente" : "Crear Nuevo Apunte con Enlaces al Lore"}</span>
                </span>
                <button
                  onClick={() => { setIsCreating(false); setEditingNote(null); }}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>

              {/* TÍTULO Y PRIORIDAD */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 font-mono text-xs">
                <div className="md:col-span-8 space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block font-bold">Título del Apunte:</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ej: Juramento de castración y votos del Dun'vai'rhy en C-210"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 font-sans"
                  />
                </div>

                <div className="md:col-span-4 space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block font-bold">Relevancia / Prioridad:</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as NotePriority)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500/50 font-mono text-xs cursor-pointer"
                  >
                    <option value="crucial">🔴 Crucial / Revelación</option>
                    <option value="alta">🟡 Alta / Trama Principal</option>
                    <option value="media">🔵 Media / Worldbuilding</option>
                    <option value="borrador">⚪ Borrador / Hipótesis</option>
                  </select>
                </div>

                {/* TEMÁTICA DINÁMICA & INTELIGENTE */}
                <div className="md:col-span-6 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] text-slate-400 uppercase block font-bold">Temática Principal:</label>
                    {!isAddingNewThematic ? (
                      <button
                        type="button"
                        onClick={() => setIsAddingNewThematic(true)}
                        className="text-[10px] text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={10} />
                        <span>Crear Temática Personalizada</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsAddingNewThematic(false)}
                        className="text-[10px] text-slate-400 hover:text-white cursor-pointer"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>

                  {!isAddingNewThematic ? (
                    <select
                      value={formThematic}
                      onChange={(e) => setFormThematic(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500/50 font-mono text-xs cursor-pointer"
                    >
                      {allAvailableThematics.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label} {cat.isCustom ? '★ (Personalizada)' : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCustomThematicInput}
                        onChange={(e) => setNewCustomThematicInput(e.target.value)}
                        placeholder="Ej: Ingeniería Hidráulica, Tabú del Fuego, etc."
                        className="flex-1 bg-black/70 border border-amber-500/50 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none font-sans text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newCustomThematicInput.trim()) {
                            setFormThematic(newCustomThematicInput.trim());
                            if (onSaveCustomThematic) onSaveCustomThematic(newCustomThematicInput.trim());
                            setIsAddingNewThematic(false);
                          }
                        }}
                        className="px-3 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors"
                      >
                        Usar
                      </button>
                    </div>
                  )}

                  {/* Sugerencia inteligente de temática */}
                  {suggestedThematic && suggestedThematic !== formThematic && (
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                      <Sparkles size={11} className="text-amber-400" />
                      <span>Sugerida por contexto: </span>
                      <button
                        type="button"
                        onClick={() => setFormThematic(suggestedThematic)}
                        className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold border border-amber-500/40 transition-colors cursor-pointer"
                      >
                        {suggestedThematic} (Aplicar)
                      </button>
                    </div>
                  )}
                </div>

                {/* ETIQUETAS LIBRES (#TAGS) */}
                <div className="md:col-span-6 space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase block font-bold">Etiquetas Libres (#TAGS):</label>
                  <input
                    type="text"
                    value={formCustomTag}
                    onChange={(e) => setFormCustomTag(e.target.value)}
                    placeholder="Ej: #DredaAran, #RitoSilencio, #Capitulo4, #Obsidiana"
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 font-sans"
                  />
                </div>
              </div>

              {/* ========================================================================= */}
              {/* VÍNCULOS INTELIGENTES DEL APUNTE (TOTALMENTE DINÁMICO & CONFIGURABLE) */}
              {/* ========================================================================= */}
              <div className="pt-3 border-t border-white/10 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-cyan-300 font-bold uppercase flex items-center gap-1.5">
                      <Link2 size={13} />
                      <span>Vínculos Inteligentes al Lore ({formSmartLinks.length})</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">
                      — Conecta personajes, cubiertas, química, vórtices y otros apuntes
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowLinkPickerModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all self-start sm:self-auto"
                  >
                    <Plus size={13} />
                    <span>+ Añadir Vínculo Inteligente</span>
                  </button>
                </div>

                {/* BANNER DE DETECCIÓN INTELIGENTE EN TIEMPO REAL */}
                {detectedEntitiesInForm.length > 0 && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-fade-in">
                    <div className="flex items-start sm:items-center gap-2">
                      <Zap size={14} className="text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-300 block sm:inline">
                          ⚡ Menciones detectadas en tu texto ({detectedEntitiesInForm.length}):{' '}
                        </span>
                        <span className="text-xs text-slate-300">
                          {detectedEntitiesInForm.slice(0, 3).map(e => e.name).join(', ')}
                          {detectedEntitiesInForm.length > 3 ? ` y ${detectedEntitiesInForm.length - 3} más` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={handleAddAllDetectedEntities}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold font-mono text-[11px] hover:bg-amber-400 transition-colors cursor-pointer"
                      >
                        Vincular Todas
                      </button>
                    </div>
                  </div>
                )}

                {/* LISTA DE VÍNCULOS ACTIVOS COMO CHIPS INTERACTIVOS */}
                {formSmartLinks.length === 0 ? (
                  <div className="p-3 rounded-xl bg-black/40 border border-dashed border-white/10 text-center text-xs font-mono text-slate-500">
                    No has añadido vínculos todavía. Pulsa "+ Añadir Vínculo Inteligente" o escribe nombres de personajes y lugares en el texto para auto-detectarlos.
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {formSmartLinks.map((link, idx) => {
                      const typeCfg = SMART_LINK_TYPE_CONFIG[link.type] || SMART_LINK_TYPE_CONFIG.personalizado;
                      const isPopoverOpen = activeRolePopoverIndex === idx;

                      return (
                        <div
                          key={`${link.id}_${idx}`}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-mono relative transition-all ${typeCfg.bg} ${typeCfg.border} ${typeCfg.color}`}
                        >
                          <span className="opacity-80">{typeCfg.icon}</span>
                          <span className="font-bold">{link.name}</span>

                          {/* Selector de rol de relación */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setActiveRolePopoverIndex(isPopoverOpen ? null : idx)}
                              className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 hover:border-white/30 text-[10px] text-slate-300 font-sans flex items-center gap-1 cursor-pointer"
                              title="Configurar rol de la relación"
                            >
                              <span>{link.role || 'Mención'}</span>
                              <ChevronDown size={10} />
                            </button>

                            {/* POPOVER DE SELECCIÓN DE ROL */}
                            {isPopoverOpen && (
                              <div className="absolute left-0 top-full mt-1 w-48 p-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 shadow-2xl z-30 space-y-1">
                                <span className="text-[9px] text-slate-400 uppercase font-mono px-1.5 block">Rol en el Apunte:</span>
                                {RELATIONSHIP_ROLES.map(role => (
                                  <button
                                    key={role}
                                    type="button"
                                    onClick={() => handleSetLinkRole(idx, role)}
                                    className={`w-full text-left px-2 py-1 rounded-lg text-xs font-sans transition-colors cursor-pointer ${
                                      link.role === role ? 'bg-cyan-500/20 text-cyan-200 font-bold' : 'text-slate-300 hover:bg-white/5'
                                    }`}
                                  >
                                    {role}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Quitar vínculo */}
                          <button
                            type="button"
                            onClick={() => handleRemoveSmartLink(idx)}
                            className="p-0.5 rounded hover:bg-white/10 text-slate-400 hover:text-rose-400 transition-colors ml-0.5"
                            title="Quitar vínculo"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* CUERPO DEL APUNTE */}
              <div className="space-y-1.5 pt-2 border-t border-white/10 relative">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span>Contenido del apunte:</span>
                    <span className="text-cyan-400 font-bold bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-500/30">
                      Tip: Escribe @ o [[ para autocompletar lore
                    </span>
                  </span>
                  <span>{formContent.length} caracteres</span>
                </div>

                {/* SUGERENCIAS FLOTANTES DE AUTOCOMPLETADO AL ESCRIBIR @ O [[ */}
                {inlineMentionQuery !== null && (
                  <div className="p-2 rounded-2xl bg-slate-900 border border-cyan-500/50 shadow-2xl space-y-1 animate-fade-in z-20">
                    <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300 px-1 border-b border-white/5 pb-1">
                      <span className="flex items-center gap-1 font-bold">
                        <Sparkles size={11} className="text-cyan-400 animate-pulse" />
                        <span>Autocompletar Lore: {inlineMentionPrefix}{inlineMentionQuery}</span>
                      </span>
                      <button 
                        type="button" 
                        onClick={() => { setInlineMentionQuery(null); setInlineMentionPrefix(null); }}
                        className="text-slate-400 hover:text-white"
                      >
                        <X size={11} />
                      </button>
                    </div>
                    <div className="max-h-44 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {(() => {
                        const q = (inlineMentionQuery || '').toLowerCase();
                        const matches = LORE_ENTITIES_CATALOG
                          .filter(ent => !q || ent.name.toLowerCase().includes(q) || ent.aliases.some(a => a.toLowerCase().includes(q)))
                          .slice(0, 6);

                        if (matches.length === 0) {
                          return (
                            <div className="p-2 text-center text-[11px] font-mono text-slate-500">
                              Sin coincidencias para "{inlineMentionQuery}". Pulsa Esc o × para cerrar.
                            </div>
                          );
                        }

                        return matches.map(entity => {
                          const typeCfg = SMART_LINK_TYPE_CONFIG[entity.type] || SMART_LINK_TYPE_CONFIG.personalizado;
                          return (
                            <button
                              key={entity.id}
                              type="button"
                              onClick={() => handleSelectInlineMention(entity)}
                              className="w-full text-left p-1.5 rounded-xl bg-black/60 hover:bg-cyan-950/60 border border-white/5 hover:border-cyan-500/40 flex items-center justify-between gap-2 transition-colors cursor-pointer text-xs"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className={`p-1 rounded ${typeCfg.bg} ${typeCfg.color}`}>{typeCfg.icon}</span>
                                <span className="font-mono font-bold text-slate-100 truncate">{entity.name}</span>
                                <span className="text-[10px] text-slate-400 truncate hidden sm:inline">[{entity.category}]</span>
                              </div>
                              <span className="text-[10px] font-mono text-cyan-400 font-bold shrink-0">+ Insertar [[{entity.name}]]</span>
                            </button>
                          );
                        });
                      })()}
                    </div>
                  </div>
                )}

                <textarea
                  value={formContent}
                  onChange={handleContentChange}
                  placeholder={placeholder || "Escribe aquí todas las ideas, diálogos, leyes o apuntes... Puedes escribir @Nombre o [[Nombre]] para autocompletar y vincular lore al vuelo."}
                  rows={7}
                  className="w-full bg-black/75 border border-white/10 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/60 font-sans leading-relaxed resize-y select-text shadow-inner"
                />
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingNote(null); }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-mono text-xs cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveForm}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center gap-2 cursor-pointer transition-all"
                >
                  <CheckCircle2 size={14} />
                  <span>{editingNote ? "Guardar Modificaciones" : "Guardar Nuevo Apunte"}</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* LISTA DE APUNTES EXISTENTES */}
          {/* ========================================================================= */}
          {filteredNotes.length === 0 ? (
            <div className="p-8 rounded-2xl bg-black/30 border border-white/5 text-center space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <FileText size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-mono text-xs font-bold text-slate-300 uppercase">
                  {sectionNotes.length === 0 ? "No hay notas en esta sección todavía" : "No hay resultados para este filtro"}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto font-sans leading-relaxed">
                  {sectionNotes.length === 0
                    ? `Crea apuntes personalizados con temática, etiquetas y enlaces inteligentes para conectar tus reflexiones con el lore de ${title}.`
                    : "Prueba a cambiar el filtro de temática o limpiar los términos de búsqueda."}
                </p>
              </div>
              {sectionNotes.length === 0 && (
                <button
                  onClick={handleOpenCreate}
                  className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-mono font-bold inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Crear Primer Apunte</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredNotes.map(note => {
                const priorityInfo = PRIORITY_CONFIG[note.priority || 'alta'];
                const isExpanded = expandedNotes[note.id];
                const isLong = note.content.length > 360;
                const isDeleting = deletingId === note.id;
                const relatedEcosystemNotes = getEcosystemConnections(note);

                return (
                  <div
                    key={note.id}
                    className={`p-4 sm:p-5 rounded-2xl bg-slate-900/70 border transition-all ${
                      note.isPinned 
                        ? 'border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.12)]' 
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* CABECERA DE LA NOTA */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        {note.isPinned && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono flex items-center gap-1 font-bold border border-amber-500/30">
                            <Pin size={10} className="fill-current" />
                            <span>FIJADA</span>
                          </span>
                        )}

                        {/* Píldora de Temática con clic para filtrar */}
                        <button
                          onClick={() => setSelectedThematicFilter(note.category)}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-mono flex items-center gap-1 font-bold border bg-amber-500/15 text-amber-300 border-amber-500/30 hover:border-amber-400 transition-colors cursor-pointer"
                          title={`Filtrar por temática: ${note.category}`}
                        >
                          <Compass size={11} />
                          <span>{note.category}</span>
                        </button>

                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-mono ${priorityInfo.badge}`}>
                          {priorityInfo.label}
                        </span>

                        {note.customTag && (
                          <span className="px-2 py-0.5 rounded-lg bg-white/5 text-slate-300 text-[10px] font-mono border border-white/10 flex items-center gap-1">
                            <Tag size={10} className="text-slate-400" />
                            <span>{note.customTag}</span>
                          </span>
                        )}
                      </div>

                      {/* ACCIONES DE LA NOTA */}
                      <div className="flex items-center gap-1 self-end sm:self-auto">
                        <button
                          onClick={() => togglePin(note)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            note.isPinned ? 'text-amber-400 bg-amber-500/20' : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title={note.isPinned ? "Desanclar nota" : "Fijar al principio"}
                        >
                          <Pin size={13} className={note.isPinned ? "fill-current" : ""} />
                        </button>

                        <button
                          onClick={() => exportSingleNoteToObsidian(note)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-300 hover:bg-white/5 transition-colors cursor-pointer"
                          title="Descargar apunte para Obsidian (.md con Frontmatter & Wikilinks)"
                        >
                          {downloadedNoteId === note.id ? <Check size={13} className="text-emerald-400" /> : <Download size={13} />}
                        </button>

                        <button
                          onClick={() => handleCopy(note)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-300 hover:bg-white/5 transition-colors cursor-pointer"
                          title="Copiar apunte en formato Markdown"
                        >
                          {copiedId === note.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(note)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-300 hover:bg-white/5 transition-colors cursor-pointer"
                          title="Editar apunte"
                        >
                          <Edit3 size={13} />
                        </button>

                        <button
                          onClick={() => setDeletingId(note.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Eliminar apunte"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* CONFIRMACIÓN DE ELIMINACIÓN */}
                    {isDeleting && (
                      <div className="mt-2.5 p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 flex items-center justify-between text-xs font-mono animate-fade-in">
                        <span className="text-rose-200">¿Eliminar este apunte de forma permanente?</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setDeletingId(null)}
                            className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[11px] cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => confirmDelete(note.id)}
                            className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] cursor-pointer"
                          >
                            Confirmar Eliminación
                          </button>
                        </div>
                      </div>
                    )}

                    {/* TÍTULO DEL APUNTE */}
                    <div className="mt-2.5">
                      <h4 className="font-mono text-sm font-bold text-slate-100 tracking-wide">
                        {note.title}
                      </h4>
                    </div>

                    {/* CONTENIDO DEL APUNTE (CON WIKILINKS INTERACTIVOS [[...]]) */}
                    <div className="mt-2 text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap select-text">
                      {isLong && !isExpanded ? (
                        <>
                          {renderInteractiveContent(note.content.slice(0, 360))}...
                          <button
                            onClick={() => toggleExpand(note.id)}
                            className="text-amber-400 font-bold ml-1 hover:underline cursor-pointer inline-block"
                          >
                            Ver más ({note.content.length} caracteres)
                          </button>
                        </>
                      ) : (
                        <>
                          {renderInteractiveContent(note.content)}
                          {isLong && (
                            <button
                              onClick={() => toggleExpand(note.id)}
                              className="text-amber-400 font-bold ml-2 hover:underline cursor-pointer block mt-1"
                            >
                              Ver menos
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {/* ENLACES INTELIGENTES DEL APUNTE (CHIPS DE LORE CON CLIC PARA DOSSIER) */}
                    {note.smartLinks && note.smartLinks.length > 0 && (
                      <div className="mt-3.5 pt-2.5 border-t border-white/5 flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                        <span className="text-slate-500 flex items-center gap-1 font-bold">
                          <Link2 size={11} className="text-cyan-400" />
                          <span>Vínculos al Lore:</span>
                        </span>

                        {note.smartLinks.map((link, lIdx) => {
                          const typeCfg = SMART_LINK_TYPE_CONFIG[link.type] || SMART_LINK_TYPE_CONFIG.personalizado;
                          const entityDef = LORE_ENTITIES_MAP.get(link.id);

                          return (
                            <button
                              key={`${link.id}_${lIdx}`}
                              onClick={() => {
                                if (entityDef) {
                                  setPreviewEntity(entityDef);
                                } else {
                                  alert(`Vínculo: ${link.name}\nRol: ${link.role || 'Mención'}\n${link.detail || ''}`);
                                }
                              }}
                              className={`px-2 py-0.5 rounded-lg border flex items-center gap-1 cursor-pointer transition-all hover:scale-105 ${typeCfg.bg} ${typeCfg.border} ${typeCfg.color}`}
                              title={entityDef ? `Ver ficha completa de ${link.name}` : link.name}
                            >
                              <span>{typeCfg.icon}</span>
                              <span className="font-bold">{link.name}</span>
                              {link.role && (
                                <span className="opacity-60 text-[9px]">({link.role})</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* CONEXIONES DEL ECOSISTEMA (BACKLINKS BIDIRECCIONALES) */}
                    {relatedEcosystemNotes.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-white/5 text-[10px] font-mono">
                        <div className="flex items-center gap-1.5 text-teal-400 font-bold">
                          <Network size={11} />
                          <span>Conexiones en la Red de Apuntes ({relatedEcosystemNotes.length} notas relacionadas):</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {relatedEcosystemNotes.map(rel => (
                            <div
                              key={rel.id}
                              className="px-2 py-0.5 rounded bg-teal-950/60 border border-teal-500/30 text-teal-200 text-[10px] flex items-center gap-1"
                              title={rel.content}
                            >
                              <FileText size={9} />
                              <span className="font-bold">{rel.title}</span>
                              <span className="text-slate-500">[{rel.sectionId}]</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* PIE DE FECHA & CONTADOR */}
                    <div className="mt-2.5 pt-1.5 flex items-center justify-between text-[9px] font-mono text-slate-500">
                      <span>{note.content.length} caracteres // {note.smartLinks?.length || 0} vínculos</span>
                      <span>
                        Actualizado: {new Date(note.updatedAt || note.createdAt).toLocaleDateString()} {new Date(note.updatedAt || note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: PICKER UNIVERSAL DE VÍNCULOS INTELIGENTES AL LORE */}
      {/* ========================================================================= */}
      {showLinkPickerModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-950 border border-cyan-500/40 rounded-3xl p-5 max-w-2xl w-full max-h-[85vh] flex flex-col gap-3 shadow-[0_0_50px_rgba(34,211,238,0.2)]">
            {/* Cabecera */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold text-sm">
                <Link2 size={16} />
                <span>Selector Universal de Vínculos al Lore</span>
              </div>
              <button
                onClick={() => setShowLinkPickerModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            {/* Buscador de entidades */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={linkPickerQuery}
                onChange={(e) => setLinkPickerQuery(e.target.value)}
                placeholder="Buscar personajes, cubiertas, sustancias, vórtices, términos..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-sans"
                autoFocus
              />
            </div>

            {/* Pestañas de tipo */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[10px] font-mono">
              <button
                onClick={() => setLinkPickerType('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  linkPickerType === 'all' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Todo
              </button>
              {(Object.keys(SMART_LINK_TYPE_CONFIG) as SmartLinkType[]).map(t => {
                const cfg = SMART_LINK_TYPE_CONFIG[t];
                return (
                  <button
                    key={t}
                    onClick={() => setLinkPickerType(t)}
                    className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                      linkPickerType === t ? `${cfg.bg} ${cfg.color} ${cfg.border} border font-bold` : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cfg.icon}
                    <span>{cfg.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Lista de resultados del catálogo */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-80">
              {/* Sección de otros apuntes si el filtro es 'all' o 'apunte' */}
              {(linkPickerType === 'all' || linkPickerType === 'apunte') && authorNotes.length > 1 && (
                <div className="space-y-1 pt-1 pb-2 border-b border-white/5">
                  <span className="text-[10px] font-mono text-teal-400 uppercase font-bold block">Otros Apuntes del Autor:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {authorNotes.filter(n => n.id !== editingNote?.id).slice(0, 6).map(otherNote => (
                      <div
                        key={otherNote.id}
                        onClick={() => handleAddNoteAsLink(otherNote)}
                        className="p-2 rounded-xl bg-teal-950/40 border border-teal-500/30 hover:border-teal-400 cursor-pointer flex items-center justify-between text-xs transition-colors"
                      >
                        <div className="truncate">
                          <span className="font-mono text-teal-200 font-bold block truncate">{otherNote.title}</span>
                          <span className="text-[10px] text-slate-400">{otherNote.sectionId}</span>
                        </div>
                        <Plus size={14} className="text-teal-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Entidades del catálogo */}
              {LORE_ENTITIES_CATALOG
                .filter(entity => {
                  if (linkPickerType !== 'all' && entity.type !== linkPickerType) return false;
                  if (!linkPickerQuery.trim()) return true;
                  const q = linkPickerQuery.toLowerCase();
                  const inName = entity.name.toLowerCase().includes(q);
                  const inCategory = entity.category.toLowerCase().includes(q);
                  const inDetail = entity.detail.toLowerCase().includes(q);
                  const inAliases = entity.aliases.some(a => a.toLowerCase().includes(q));
                  return inName || inCategory || inDetail || inAliases;
                })
                .map(entity => {
                  const typeCfg = SMART_LINK_TYPE_CONFIG[entity.type] || SMART_LINK_TYPE_CONFIG.personalizado;
                  const isAlreadyAdded = formSmartLinks.some(l => l.id === entity.id);

                  return (
                    <div
                      key={entity.id}
                      onClick={() => !isAlreadyAdded && handleAddLinkFromPicker(entity)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                        isAlreadyAdded 
                          ? 'opacity-40 bg-black/40 border-white/5 cursor-not-allowed' 
                          : 'bg-black/60 border-white/10 hover:border-cyan-500/50 hover:bg-slate-900/80 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-1.5 rounded-lg ${typeCfg.bg} ${typeCfg.color}`}>
                          {typeCfg.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-slate-100 truncate">{entity.name}</span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${typeCfg.bg} ${typeCfg.color}`}>
                              {entity.category}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 line-clamp-1 font-sans">{entity.detail}</span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isAlreadyAdded ? (
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                            <Check size={12} />
                            <span>Añadido</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-500/30 transition-colors"
                          >
                            + Vincular
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* SECCIÓN CREAR VÍNCULO LIBRE AD-HOC */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-amber-300 uppercase font-bold block">
                ¿No está en la lista? Crea un Vínculo Personalizado:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs font-mono">
                <input
                  type="text"
                  value={customLinkName}
                  onChange={(e) => setCustomLinkName(e.target.value)}
                  placeholder="Nombre de la entidad (ej: Esclusa C-114, Batería Criogénica)"
                  className="sm:col-span-5 bg-black/70 border border-white/10 rounded-xl px-3 py-1.5 text-slate-100 placeholder-slate-600 focus:outline-none"
                />
                <select
                  value={customLinkType}
                  onChange={(e) => setCustomLinkType(e.target.value as SmartLinkType)}
                  className="sm:col-span-3 bg-black/70 border border-white/10 rounded-xl px-2 py-1.5 text-slate-200 text-xs"
                >
                  {(Object.keys(SMART_LINK_TYPE_CONFIG) as SmartLinkType[]).map(t => (
                    <option key={t} value={t}>{SMART_LINK_TYPE_CONFIG[t].label}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={customLinkRole}
                  onChange={(e) => setCustomLinkRole(e.target.value)}
                  placeholder="Rol (ej: Escenario)"
                  className="sm:col-span-2 bg-black/70 border border-white/10 rounded-xl px-2 py-1.5 text-slate-100 placeholder-slate-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomAdHocLink}
                  className="sm:col-span-2 px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  + Añadir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DOSSIER RÁPIDO DE ENTIDAD AL HACER CLIC EN UN VÍNCULO */}
      {/* ========================================================================= */}
      {previewEntity && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-950 border border-cyan-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-[0_0_50px_rgba(34,211,238,0.25)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${previewEntity.badgeBg} ${previewEntity.borderColor} border ${previewEntity.color}`}>
                  {SMART_LINK_TYPE_CONFIG[previewEntity.type]?.icon || <Link2 size={16} />}
                </div>
                <div>
                  <h3 className="font-mono font-bold text-base text-slate-100">{previewEntity.name}</h3>
                  <span className={`text-[10px] font-mono px-2 py-0.2 rounded ${previewEntity.badgeBg} ${previewEntity.color}`}>
                    {previewEntity.category}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setPreviewEntity(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            {/* Cita canónica */}
            {previewEntity.quote && (
              <div className="p-3 rounded-2xl bg-black/50 border border-white/5 text-xs text-amber-200/90 italic font-serif leading-relaxed">
                {previewEntity.quote}
              </div>
            )}

            {/* Detalle y ubicación */}
            <div className="space-y-2 text-xs font-sans text-slate-300 leading-relaxed">
              <p>{previewEntity.detail}</p>
              {previewEntity.location && (
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-300 pt-1">
                  <Layers size={12} />
                  <span>Ubicación: {previewEntity.location}</span>
                </div>
              )}
            </div>

            {/* Apuntes del autor relacionados con esta entidad */}
            {(() => {
              const matchingNotes = authorNotes.filter(n => n.smartLinks?.some(l => l.id === previewEntity.id || l.name === previewEntity.name));
              if (matchingNotes.length === 0) return null;
              return (
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <span className="text-[10px] font-mono text-teal-400 uppercase font-bold block">
                    Tus apuntes vinculados ({matchingNotes.length}):
                  </span>
                  <div className="max-h-32 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {matchingNotes.map(n => (
                      <div key={n.id} className="p-1.5 rounded-lg bg-white/5 text-xs font-mono text-slate-300 flex items-center justify-between">
                        <span className="truncate">{n.title}</span>
                        <span className="text-[10px] text-slate-500 shrink-0 ml-2">[{n.sectionId}]</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Botones de Navegación al Atlas */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPreviewEntity(null)}
                className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 font-mono text-xs hover:bg-white/10"
              >
                Cerrar
              </button>

              {previewEntity.atlasTab && onNavigateToEntity && (
                <button
                  type="button"
                  onClick={() => {
                    const tab = previewEntity.atlasTab;
                    const entityId = previewEntity.atlasEntityId || previewEntity.id;
                    setPreviewEntity(null);
                    if (tab) onNavigateToEntity('section', tab);
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Ver en Atlas de Lore</span>
                  <ExternalLink size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: RED GLOBAL DE APUNTES DEL AUTOR (ECOSISTEMA INTERCONECTADO) */}
      {/* ========================================================================= */}
      {showGlobalMatrix && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-950 border border-amber-500/40 rounded-3xl p-6 max-w-4xl w-full max-h-[90vh] flex flex-col gap-4 shadow-[0_0_60px_rgba(245,158,11,0.25)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5 text-amber-300 font-mono font-bold text-base">
                <Network size={20} className="text-amber-400" />
                <span>Ecosistema Global de Apuntes del Autor ({authorNotes.length} notas en total)</span>
              </div>
              <button
                onClick={() => setShowGlobalMatrix(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Estadísticas rápidas de la Red */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 block">TOTAL APUNTES</span>
                <span className="text-lg font-bold text-amber-300">{authorNotes.length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 block">NOTAS FIJADAS</span>
                <span className="text-lg font-bold text-emerald-300">{authorNotes.filter(n => n.isPinned).length}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 block">VÍNCULOS TOTALES</span>
                <span className="text-lg font-bold text-cyan-300">
                  {authorNotes.reduce((acc, n) => acc + (n.smartLinks?.length || 0), 0)}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 block">TEMÁTICAS ACTIVAS</span>
                <span className="text-lg font-bold text-purple-300">
                  {new Set(authorNotes.map(n => n.category)).size}
                </span>
              </div>
            </div>

            {/* Explorador de todas las notas en todas las secciones */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {authorNotes.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-mono text-xs">
                  No se han registrado apuntes en ninguna sección todavía.
                </div>
              ) : (
                authorNotes.map(n => (
                  <div key={n.id} className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-1.5 hover:border-amber-500/30 transition-colors">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2 truncate">
                        <span className="px-2 py-0.5 rounded bg-white/5 text-amber-300 text-[10px] font-bold">
                          {n.sectionId}
                        </span>
                        <span className="font-bold text-slate-100 truncate">{n.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{n.category}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 font-sans">{n.content}</p>
                    {n.smartLinks && n.smartLinks.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {n.smartLinks.map((l, i) => (
                          <span key={i} className="px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-300 text-[9px] font-mono border border-cyan-500/30">
                            {l.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Pie de modal con botón de exportación masiva a Obsidian */}
            <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => exportAllNotesToObsidianVault(authorNotes)}
                className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 border border-purple-500/40 font-mono font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-sm self-stretch sm:self-auto justify-center"
                title="Exportar archivo maestro consolidado listo para tu bóveda de Obsidian"
              >
                <Download size={14} className="text-purple-400" />
                <span>Exportar Todas a Bóveda Obsidian (.md)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowGlobalMatrix(false)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs cursor-pointer self-stretch sm:self-auto"
              >
                Cerrar Red Global
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorNotesEcosystem;
