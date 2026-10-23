import { SmartLinkType, SmartLoreLink } from './loreStorage';

export interface LoreEntityDefinition {
  id: string;
  type: SmartLinkType;
  name: string;
  aliases: string[];
  category: string;
  roleHint?: string;
  detail: string;
  quote?: string;
  location?: string;
  atlasTab?: 'lideres' | 'thalvus' | 'evolucion-madres' | 'dorada-apagon' | 'cronica' | 'cubiertas' | 'personajes' | 'cronosistema' | 'vortices' | 'hava' | 'sociedad' | 'novela' | 'oraculo';
  atlasEntityId?: string;
  color: string;
  badgeBg: string;
  borderColor: string;
}

export const LORE_ENTITIES_CATALOG: LoreEntityDefinition[] = [
  // ==========================================
  // 1. PERSONAJES & PROTAGONISTAS
  // ==========================================
  {
    id: 'pwaoo',
    type: 'personaje',
    name: 'Pwaoo Puari',
    aliases: ['pwaoo', 'puari', 'el jardinero', 'el mudo de la 233'],
    category: 'Protagonista // Los Jardineros',
    roleHint: 'Protagonista',
    detail: 'Jardinero de C233. Mudo selectivo y portador del sigilo de las algas. Capaz de percibir frecuencias del casco.',
    quote: '«La raíz de la espirulina no pide permiso al mamparo de hierro para abrirse paso hacia el calor.»',
    location: 'Cubierta 233 (Invernadero 0508)',
    atlasTab: 'personajes',
    atlasEntityId: 'pwaoo',
    color: 'text-emerald-300',
    badgeBg: 'bg-emerald-950/60',
    borderColor: 'border-emerald-500/40'
  },
  {
    id: 'kiwori',
    type: 'personaje',
    name: 'Kiwori Dahn',
    aliases: ['kiwori', 'dahn', 'la tejedora', 'acustica'],
    category: 'Protagonista // Místicos Veyvān',
    roleHint: 'Protagonista',
    detail: 'Acústica Veyvān y tejedora de armónicos en C233. Traduce las vibraciones del reactor.',
    quote: '«No es silencio; es el pulso de trescientas veinte cubiertas respirando el mismo aire reciclado.»',
    location: 'Cubierta 233 / Ductos de Ventilación',
    atlasTab: 'personajes',
    atlasEntityId: 'kiwori',
    color: 'text-cyan-300',
    badgeBg: 'bg-cyan-950/60',
    borderColor: 'border-cyan-500/40'
  },
  {
    id: 'komokaru',
    type: 'personaje',
    name: "Konokaru 'Taul",
    aliases: ['komokaru', 'konokaru', 'el comandante', 'taul'],
    category: 'Protagonista // Oficial Hereje',
    roleHint: 'Protagonista',
    detail: 'Comandante de Esclusa del Émulo. Rompe sus juramentos de casta por amor a Dreda y por la verdad del HAVA.',
    quote: '«Un mamparo blindado solo separa dos cobardías: la de quien encierra y la de quien se deja encerrar.»',
    location: 'Esclusa Primordial // Nivel C040',
    atlasTab: 'personajes',
    atlasEntityId: 'komokaru',
    color: 'text-amber-300',
    badgeBg: 'bg-amber-950/60',
    borderColor: 'border-amber-500/40'
  },
  {
    id: 'dreda',
    type: 'personaje',
    name: 'Dreda Aran',
    aliases: ['dreda', 'aran', 'la alevora', 'quebrantadora'],
    category: 'Protagonista // Casta Alévora',
    roleHint: 'Protagonista Clave',
    detail: 'Alta Servidora Alévora en los aposentos del Émulo. Quebrantó el voto sagrado del Dun\'vai\'rhy.',
    quote: '«La vasija que renuncia a su sed no es santa; solo ha aprendido a morirse sin hacer ruido.»',
    location: 'Palacio del Émulo (C001-C015)',
    atlasTab: 'personajes',
    atlasEntityId: 'dreda',
    color: 'text-purple-300',
    badgeBg: 'bg-purple-950/60',
    borderColor: 'border-purple-500/40'
  },
  {
    id: 'vireus',
    type: 'personaje',
    name: 'Gran Padre Vireus',
    aliases: ['vireus', 'gran padre', 'regente vireus'],
    category: 'Antagonista // Supremo Regente',
    roleHint: 'Antagonista Principal',
    detail: 'Regente absoluto de la Estación. Arquitecto del protocolo de purga HAVA y defensor del darwinismo frío.',
    quote: '«La piedad en el vacío profundo es un lujo que cuesta megavatios que este reactor ya no puede generar.»',
    location: 'Bóveda de Mando del Émulo',
    atlasTab: 'lideres',
    atlasEntityId: 'vireus',
    color: 'text-red-400',
    badgeBg: 'bg-red-950/60',
    borderColor: 'border-red-500/40'
  },
  {
    id: 'mephesgeister',
    type: 'personaje',
    name: 'Mephesgeister',
    aliases: ['mephesgeister', 'el patriarca del hielo', 'mephes'],
    category: 'Líder // Tribus Polares',
    roleHint: 'Aliado / Fanático',
    detail: 'Patriarca de las Cubiertas Polares (C312). Guía a los Involutivos bajo la mística del frío y el Vórtice Amtti.',
    quote: '«El hielo no castiga, purifica. Quien sobrevive a los 80 grados bajo cero ya no tiene miedo al juicio del Consejo.»',
    location: 'Cubierta 312 // Campamento Central',
    atlasTab: 'personajes',
    atlasEntityId: 'mephesgeister',
    color: 'text-sky-300',
    badgeBg: 'bg-sky-950/60',
    borderColor: 'border-sky-500/40'
  },
  {
    id: 'vorlemm',
    type: 'personaje',
    name: 'Vorlëmm Hatz',
    aliases: ['vorlemm', 'vorlemm hatz', 'primera madre', 'gran madre'],
    category: 'Figura Histórica // Primera Madre',
    roleHint: 'Fundadora Canónica',
    detail: 'Líder fundacional de la partida desde Manicore en 2672. Formuló el primer vórtice de la Evolución Consciente.',
    quote: '«No zarpamos para conquistar estrellas, sino para no morir siendo ciegos en la fosa de la Cuna.»',
    location: 'Mausoleo de la Quilla',
    atlasTab: 'evolucion-madres',
    atlasEntityId: 'vorlemm',
    color: 'text-yellow-300',
    badgeBg: 'bg-yellow-950/60',
    borderColor: 'border-yellow-500/40'
  },
  {
    id: 'divya',
    type: 'personaje',
    name: 'Divya Magna',
    aliases: ['divya', 'divya magna', 'segunda madre', 'madre de la fractura'],
    category: 'Figura Histórica // Segunda Madre',
    roleHint: 'Artífice del Cisma',
    detail: 'Gobernó durante El Gran Apagón (2720 d.C.). Selló la cúpula del Émulo para salvar a la élite sacrificando la periferia.',
    quote: '«Si todos intentamos comer, moriremos juntos antes de que la segunda luna de Phaetim asome en los sensores.»',
    location: 'Cámara de Estado del Émulo',
    atlasTab: 'evolucion-madres',
    atlasEntityId: 'divya',
    color: 'text-orange-300',
    badgeBg: 'bg-orange-950/60',
    borderColor: 'border-orange-500/40'
  },
  {
    id: 'thalvus',
    type: 'personaje',
    name: 'Joren Thalvus',
    aliases: ['thalvus', 'joren thalvus', 'maestro thalvus', 'ner-val'],
    category: 'Filósofo // Escuela Ner\'Val',
    roleHint: 'Referente Filosófico',
    detail: 'Místico y calígrafo maestro. Autor de los Tratados Ner\'Val y codificador de la gramática sagrada Tael\'im.',
    quote: '«Escribir Tael\'im es obligar al pensamiento a doblarse en la misma curvatura que el casco soporta contra el vacío.»',
    location: 'Scriptorium de Cubierta 180',
    atlasTab: 'thalvus',
    atlasEntityId: 'thalvus',
    color: 'text-indigo-300',
    badgeBg: 'bg-indigo-950/60',
    borderColor: 'border-indigo-500/40'
  },
  {
    id: 'bassa',
    type: 'personaje',
    name: 'Bassa Orb',
    aliases: ['bassa', 'bassa orb', 'el susurrador', 'jefe de seguridad'],
    category: 'Seguridad // Policía Interior',
    roleHint: 'Antagonista Táctico',
    detail: 'Consejero de Inteligencia del Émulo y jefe de la red de espionaje térmico. Implacable rastreador de herejías.',
    quote: '«Todo secreto en esta nave deja una firma térmica en mis condensadores.»',
    location: 'Pabellón de Sensores C020',
    atlasTab: 'personajes',
    atlasEntityId: 'bassa',
    color: 'text-rose-400',
    badgeBg: 'bg-rose-950/60',
    borderColor: 'border-rose-500/40'
  },
  {
    id: 'owa',
    type: 'personaje',
    name: 'Owa',
    aliases: ['owa', 'el hacker', 'owa el adicto'],
    category: 'Submundo // Periferia C231',
    roleHint: 'Aliado Tecnológico',
    detail: 'Hacker terminal adicto al Hexpace. Sus manos temblorosas descubrieron el archivo original del protocolo HAVA.',
    quote: '«Dame dos caladas de azul y romperé los cortafuegos del mismísimo Gran Padre.»',
    location: 'Cubierta 231 // Nido de Cables',
    atlasTab: 'personajes',
    atlasEntityId: 'owa',
    color: 'text-teal-300',
    badgeBg: 'bg-teal-950/60',
    borderColor: 'border-teal-500/40'
  },
  {
    id: 'chappa',
    type: 'personaje',
    name: 'Chappa',
    aliases: ['chappa', 'madre chappa', 'matriarca de la 233'],
    category: 'Comunidad // Jardineros',
    roleHint: 'Mentora / Cuidadora',
    detail: 'Matriarca de los invernaderos populares. Crió a Pwaoo y custodia las semillas de la Tierra.',
    quote: '«El mamparo frío no perdona, pero la sopa caliente de espirulina te da otro turno de vida.»',
    location: 'Cubierta 233 // Cocina Comunal',
    atlasTab: 'personajes',
    atlasEntityId: 'chappa',
    color: 'text-lime-300',
    badgeBg: 'bg-lime-950/60',
    borderColor: 'border-lime-500/40'
  },

  // ==========================================
  // 2. FACCIONES & CASTAS
  // ==========================================
  {
    id: 'fac_alevoros',
    type: 'facción',
    name: 'Casta de los Alévoros',
    aliases: ['alevoros', 'alévoro', 'casta alevora', 'vasijas'],
    category: 'Casta Sagrada de Servidumbre',
    roleHint: 'Casta Clave',
    detail: 'Sometidos al juramento del Dun\'vai\'rhy ("El Silencio del Yo"). Esterilidad química ritual, renuncia a la propiedad y servicio silencioso a la nave.',
    quote: '«La vasija no proclama el agua que contiene; se limita a no quebrarse.»',
    location: 'Servicio en todas las cubiertas',
    atlasTab: 'sociedad',
    color: 'text-purple-300',
    badgeBg: 'bg-purple-950/60',
    borderColor: 'border-purple-500/40'
  },
  {
    id: 'fac_veyvan',
    type: 'facción',
    name: 'Místicos Veyvān',
    aliases: ['veyvan', 'los veyvan', 'acusticos veyvan', 'orden veyvan'],
    category: 'Orden Mística Acústica',
    roleHint: 'Custodios del Lenguaje',
    detail: 'Místicos que escuchan las armónicas del reactor y preservan el dialecto sagrado Transversal y el arte Tael\'im.',
    quote: '«El reactor no ruge; susurra la única verdad que queda entre las estrellas.»',
    location: 'Nodos Acústicos C180-C240',
    atlasTab: 'vortices',
    color: 'text-cyan-300',
    badgeBg: 'bg-cyan-950/60',
    borderColor: 'border-cyan-500/40'
  },
  {
    id: 'fac_jardineros',
    type: 'facción',
    name: 'Los Jardineros de la 233',
    aliases: ['jardineros', 'los jardineros', 'hermandad de la 233'],
    category: 'Gremio Obrero & Resistencia',
    roleHint: 'Facción Popular',
    detail: 'Cultivadores hidropónicos de musgo y gel proteico en la periferia activa. Pilar de resistencia solidaria bajo el Vórtice Domeris.',
    quote: '«Si las cubiertas altas respiran es porque nuestras manos en C233 limpian el dióxido.»',
    location: 'Cubiertas C217 - C237',
    atlasTab: 'cubiertas',
    color: 'text-emerald-300',
    badgeBg: 'bg-emerald-950/60',
    borderColor: 'border-emerald-500/40'
  },
  {
    id: 'fac_emulo',
    type: 'facción',
    name: 'Consejo de la Cúpula // Élite del Émulo',
    aliases: ['consejo', 'el consejo', 'elite del emulo', 'administracion central'],
    category: 'Oligarquía Regente',
    roleHint: 'Gobernantes',
    detail: 'Gobernantes absolutistas que habitan bajo la cúpula holográfica del Émulo con el 100% de la energía y comodidades terrestres simuladas.',
    quote: '«Preservar la cultura superior de la Cuna es el mandato divino de esta cúpula.»',
    location: 'Cubiertas C001 - C040',
    atlasTab: 'lideres',
    color: 'text-amber-300',
    badgeBg: 'bg-amber-950/60',
    borderColor: 'border-amber-500/40'
  },
  {
    id: 'fac_involutivos',
    type: 'facción',
    name: 'Comunidad del Infierno // Los Involutivos',
    aliases: ['involutivos', 'los involutivos', 'tribu polar', 'hombres de escarcha'],
    category: 'Marginados Polares',
    roleHint: 'Tribu del Frío',
    detail: 'Población desterrada a las cubiertas polares C302-320 (-80°C). Viven de energía residual robada, comunión de levadura y mística Amtti.',
    quote: '«El Consejo nos llama involutivos; nosotros sabemos que somos los únicos que no necesitamos mentiras para respirar.»',
    location: 'Cubiertas C302 - C320',
    atlasTab: 'cubiertas',
    color: 'text-sky-300',
    badgeBg: 'bg-sky-950/60',
    borderColor: 'border-sky-500/40'
  },
  {
    id: 'fac_protectores',
    type: 'facción',
    name: 'Cuerpo de Protectores',
    aliases: ['protectores', 'los protectores', 'policia interior', 'guardia de mamparo'],
    category: 'Fuerza Militar & Control',
    roleHint: 'Fuerza Represiva',
    detail: 'Policía militarizada armada con bastones de choque y agujas neurales. Garantizan la segregación de castas y la cuota de alimentos.',
    quote: '«Un paso no autorizado fuera de tu cubierta asignada es insubordinación contra el destino de la especie.»',
    location: 'Puestos de Control de Esclusa',
    atlasTab: 'hava',
    color: 'text-red-400',
    badgeBg: 'bg-red-950/60',
    borderColor: 'border-red-500/40'
  },
  {
    id: 'fac_gremio_hielo',
    type: 'facción',
    name: 'Gremio del Hielo & Chatarreros',
    aliases: ['gremio del hielo', 'chatarreros', 'carroñeros'],
    category: 'Contrabando & Chatarrería',
    roleHint: 'Mercado Negro',
    detail: 'Operan en la Zona Abandonada (C259-301). Extraen metales congelados, baterías hackeadas y filtros obsoletos para el mercado negro.',
    quote: '«Si tiene cobre o refrigerante, vale un plato de pasta en la 245.»',
    location: 'Cubiertas C259 - C301',
    atlasTab: 'cubiertas',
    color: 'text-slate-300',
    badgeBg: 'bg-slate-950/60',
    borderColor: 'border-slate-500/40'
  },

  // ==========================================
  // 3. TOPOLOGÍA & CUBIERTAS
  // ==========================================
  {
    id: 'cub_infierno',
    type: 'cubierta',
    name: 'Zona Polar // El Infierno (C302 - C320)',
    aliases: ['el infierno', 'zona polar', 'c302', 'c320', 'c312', 'cubiertas polares'],
    category: 'Topología Extrema // 19 Cubiertas',
    roleHint: 'Escenario Clave',
    detail: 'Frío de -40°C a -80°C. Suministro eléctrico casi nulo (1-3% robado). Hogar de Mephesgeister y los Involutivos.',
    location: 'Extremo Norte de la Estación (Km 18-20)',
    atlasTab: 'cubiertas',
    atlasEntityId: 'sec-polares',
    color: 'text-sky-300',
    badgeBg: 'bg-sky-950/60',
    borderColor: 'border-sky-500/40'
  },
  {
    id: 'cub_vacio',
    type: 'cubierta',
    name: 'Zona Abandonada // El Vacío Muerto (C259 - C301)',
    aliases: ['el vacio muerto', 'zona abandonada', 'c259', 'c301', 'el boquete'],
    category: 'Topología en Ruina // 43 Cubiertas',
    roleHint: 'Peligro / Despresurización',
    detail: '43 niveles inhabitables con bolsas de Neevar tóxico, cables congelados y mamparos agujereados. Territorio de chatarreros armados.',
    location: 'Km 15 - 18',
    atlasTab: 'cubiertas',
    atlasEntityId: 'sec-abandonada',
    color: 'text-indigo-300',
    badgeBg: 'bg-indigo-950/60',
    borderColor: 'border-indigo-500/40'
  },
  {
    id: 'cub_periferia_activa',
    type: 'cubierta',
    name: 'Zona Exterior // Periferia Activa (C217 - C237)',
    aliases: ['periferia activa', 'c217', 'c237', 'c233', 'cubierta 233', 'invernadero 0508'],
    category: 'Topología Popular // 21 Cubiertas',
    roleHint: 'Cuna de la Rebelión',
    detail: 'Aquí reside la Cubierta 233 y el Invernadero 0508 de Pwaoo y Kiwori. Energía precaria al 15-18%. Cultura de resistencia obrera.',
    location: 'Km 12 - 14',
    atlasTab: 'cubiertas',
    atlasEntityId: 'sec-exterior',
    color: 'text-emerald-300',
    badgeBg: 'bg-emerald-950/60',
    borderColor: 'border-emerald-500/40'
  },
  {
    id: 'cub_pulso_gremial',
    type: 'cubierta',
    name: 'Zona Media // El Pulso Gremial (C196 - C216)',
    aliases: ['el pulso gremial', 'zona media', 'c196', 'c216', 'talleres'],
    category: 'Producción & Fundiciones',
    roleHint: 'Corazón Industrial',
    detail: 'Talleres mecánicos, recicladores de aire pesados y fundiciones. Núcleo obrero bajo la ética solidaria del Vórtice Domeris.',
    location: 'Km 10 - 12',
    atlasTab: 'cubiertas',
    atlasEntityId: 'sec-media',
    color: 'text-amber-300',
    badgeBg: 'bg-amber-950/60',
    borderColor: 'border-amber-500/40'
  },
  {
    id: 'cub_huertos',
    type: 'cubierta',
    name: 'Huertos Hidropónicos & Soporte (C120 - C150)',
    aliases: ['huertos hidroponicos', 'c120', 'c150', 'granjas de algas'],
    category: 'Soporte Vital Biológico',
    roleHint: 'Suministro Alimentario',
    detail: 'Enormes tanques cilíndricos de espirulina y microalgas que producen el oxígeno y la pasta proteica que alimentan a toda la nave.',
    location: 'Km 6 - 8',
    atlasTab: 'cubiertas',
    color: 'text-teal-300',
    badgeBg: 'bg-teal-950/60',
    borderColor: 'border-teal-500/40'
  },
  {
    id: 'cub_emulo',
    type: 'cubierta',
    name: 'El Émulo // Cúpula Central (C001 - C040)',
    aliases: ['el emulo', 'la cupula', 'c001', 'c040', 'el cielo falso'],
    category: 'Ciudadela de la Élite // 40 Cubiertas',
    roleHint: 'Fortaleza del Poder',
    detail: 'Cielo holográfico que simula días y noches terrestres, vegetación importada, 22°C constantes y energía garantizada al 100%. Blindada contra la periferia.',
    location: 'Cúspide de la Estación (Km 0 - 2.5)',
    atlasTab: 'cubiertas',
    atlasEntityId: 'sec-emulo',
    color: 'text-yellow-300',
    badgeBg: 'bg-yellow-950/60',
    borderColor: 'border-yellow-500/40'
  },

  // ==========================================
  // 4. FARMACOLOGÍA & SUSTANCIAS
  // ==========================================
  {
    id: 'sub_hexpace',
    type: 'sustancia',
    name: 'Hexpace',
    aliases: ['hexpace', 'azul', 'polvo azul', 'neuro-estimulante'],
    category: 'Estimulante Neuro-Sintético Prohibido',
    roleHint: 'Droga Clandestina',
    detail: 'Acelera los reflejos un 300% y permite procesar código a velocidades inhumanas. Provoca temblores irreversibles y paranoia sónica. Adicción de Owa.',
    location: 'Laboratorios Clandestinos C231',
    atlasTab: 'sociedad',
    color: 'text-rose-400',
    badgeBg: 'bg-rose-950/60',
    borderColor: 'border-rose-500/40'
  },
  {
    id: 'sub_bioina',
    type: 'sustancia',
    name: 'Bioina',
    aliases: ['bioina', 'regenerador militar'],
    category: 'Regenerador Celular Militar Restringido',
    roleHint: 'Fármaco Militar',
    detail: 'Coagulación casi instantánea de hemorragias masivas, sellado de desgarros y alivio de trauma severo.',
    location: 'Dispensarios del Émulo y Protectores',
    atlasTab: 'sociedad',
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-950/60',
    borderColor: 'border-emerald-500/40'
  },
  {
    id: 'sub_h3',
    type: 'sustancia',
    name: 'H-3 (Gas del Letargo)',
    aliases: ['h-3', 'gas del letargo', 'letargo', 'gas h3'],
    category: 'Sedante de Control de Masas Restringido',
    roleHint: 'Arma Química del Consejo',
    detail: 'Sopor inmediato, relajación muscular total, parálisis de la voluntad y pérdida temporal de memoria. Inyectado por ductos en motines.',
    location: 'Silos de Ventilación de Seguridad',
    atlasTab: 'sociedad',
    color: 'text-amber-400',
    badgeBg: 'bg-amber-950/60',
    borderColor: 'border-amber-500/40'
  },
  {
    id: 'sub_hojagris',
    type: 'sustancia',
    name: 'Hoja Gris',
    aliases: ['hoja gris', 'te de escarcha', 'narcotico herbal'],
    category: 'Narcótico Herbal Periférico Clandestino',
    roleHint: 'Droga de Supervivencia',
    detail: 'Musgo secado y ahumado. Induce calor corporal profundo, analgesia suave y ensoñación despierta para soportar el frío polar.',
    location: 'Mercadillos de C233 y C245',
    atlasTab: 'sociedad',
    color: 'text-teal-300',
    badgeBg: 'bg-teal-950/60',
    borderColor: 'border-teal-500/40'
  },
  {
    id: 'sub_lagrima',
    type: 'sustancia',
    name: 'Lágrima de Agua',
    aliases: ['lagrima de agua', 'licor del emulo'],
    category: 'Bebida Alcohólica de Élite Legal',
    roleHint: 'Lujo de la Élite',
    detail: 'Destilada a partir de condensados purificados del cielo del Émulo. Euforia lúcida y desinhibición sin pérdida del control motor ni resaca.',
    location: 'Salones del Émulo',
    atlasTab: 'sociedad',
    color: 'text-cyan-300',
    badgeBg: 'bg-cyan-950/60',
    borderColor: 'border-cyan-500/40'
  },
  {
    id: 'sub_xin',
    type: 'sustancia',
    name: 'Xin (Polvo de Resina)',
    aliases: ['xin', 'polvo de resina', 'euforizante callejero'],
    category: 'Euforizante Callejero Prohibido',
    roleHint: 'Droga Callejera',
    detail: 'Ráfaga de euforia breve (15 minutos) que atenúa el hambre y produce risa histérica. Muy consumida en los turnos dobles de fundición.',
    location: 'Bajos fondos de C210-C250',
    atlasTab: 'sociedad',
    color: 'text-fuchsia-400',
    badgeBg: 'bg-fuchsia-950/60',
    borderColor: 'border-fuchsia-500/40'
  },

  // ==========================================
  // 5. VÓRTICES FILOSÓFICOS & DOCTRINAS
  // ==========================================
  {
    id: 'vor_1',
    type: 'vortice',
    name: 'Vórtice 1: Evolución Consciente (Vor-Veheli)',
    aliases: ['vor-veheli', 'evolucion consciente', 'vortice 1', 'primer vortice'],
    category: 'Doctrina Fundacional',
    roleHint: 'Pilar Filosófico',
    detail: '«Ver y Trascender». La vida en el vacío es un crisol donde la mente humana debe mutar deliberadamente. Deformada por Vireus en darwinismo social.',
    quote: '«No hemos abandonado la Tierra para seguir siendo barro; somos la semilla que aprende a respirar luz.»',
    atlasTab: 'vortices',
    atlasEntityId: 'vor-veheli',
    color: 'text-amber-300',
    badgeBg: 'bg-amber-950/60',
    borderColor: 'border-amber-500/40'
  },
  {
    id: 'vor_2',
    type: 'vortice',
    name: 'Vórtice 2: Tejedores de Sueños (Shefir-aen)',
    aliases: ['shefir-aen', 'tejedores de sueños', 'vortice 2', 'geometria sagrada'],
    category: 'Doctrina Estética & Tael\'im',
    roleHint: 'Arte & Resistencia',
    detail: '«Urdimbre del Vacío». La belleza, la caligrafía Tael\'im y la geometría son las únicas defensas del alma contra la locura de los mamparos ciegos.',
    quote: '«El mamparo que no tiene grabada una línea de belleza es solo una tumba que aún no se ha cerrado.»',
    atlasTab: 'vortices',
    atlasEntityId: 'shefir-aen',
    color: 'text-purple-300',
    badgeBg: 'bg-purple-950/60',
    borderColor: 'border-purple-500/40'
  },
  {
    id: 'vor_3',
    type: 'vortice',
    name: 'Vórtice 3: Escucha Profunda (Nilem-ti)',
    aliases: ['nilem-ti', 'escucha profunda', 'vortice 3', 'acustica cosmica'],
    category: 'Doctrina de la Frecuencia',
    roleHint: 'Mística Veyvān',
    detail: '«Oído en el Silencio». El cosmos y la nave hablan a través de los armónicos del metal. Práctica meditativa de los místicos Veyvān.',
    quote: '«Calla tu lengua durante un Kroma y escucharás el aliento de los que murieron hace tres eras.»',
    atlasTab: 'vortices',
    atlasEntityId: 'nilem-ti',
    color: 'text-cyan-300',
    badgeBg: 'bg-cyan-950/60',
    borderColor: 'border-cyan-500/40'
  },
  {
    id: 'vor_4',
    type: 'vortice',
    name: 'Vórtice 4: Comunidad Unida (Domeris)',
    aliases: ['domeris', 'comunidad unida', 'vortice 4', 'un solo hogar'],
    category: 'Ética Obrero-Solidaria',
    roleHint: 'Fraternidad Popular',
    detail: '«Un Solo Hogar». La supervivencia individual es una quimera; solo la red solidaria de las cubiertas garantiza el mañana.',
    quote: '«Si tu vecino pasa frío en la noche de la Tala, tu propia cobija terminará helándose.»',
    atlasTab: 'vortices',
    atlasEntityId: 'domeris',
    color: 'text-emerald-300',
    badgeBg: 'bg-emerald-950/60',
    borderColor: 'border-emerald-500/40'
  },
  {
    id: 'vor_5',
    type: 'vortice',
    name: 'Vórtice 5: Superación por Sacrificio (Amtti)',
    aliases: ['amtti', 'superacion por sacrificio', 'vortice 5', 'friccion y fuego'],
    category: 'Doctrina Polar de Resistencia',
    roleHint: 'Templanza del Frío',
    detail: '«Fricción y Fuego Interior». El frío, el dolor y la carencia no son castigos sino el filo donde el espíritu se despoja de la ilusión de la carne.',
    quote: '«Agradece a la escarcha su mordisco, pues te recuerda que aún no te has disuelto en la nada.»',
    atlasTab: 'vortices',
    atlasEntityId: 'amtti',
    color: 'text-sky-300',
    badgeBg: 'bg-sky-950/60',
    borderColor: 'border-sky-500/40'
  },
  {
    id: 'vor_nerval',
    type: 'vortice',
    name: 'Tratados Ner\'Val (Joren Thalvus)',
    aliases: ['tratados ner\'val', 'ner-val', 'ner\'val', 'tratados thalvus'],
    category: 'Ontología del Silencio',
    roleHint: 'Tratados Clásicos',
    detail: 'Los doce manuscritos fundamentales sobre el vacío, la vasija sin sed y la curvatura espiritual del alma ante el tránsito interestelar.',
    quote: '«El vacío exterior es finito comparado con el abismo que un solo humano abre cuando rehúsa nombrar lo que ama.»',
    atlasTab: 'thalvus',
    color: 'text-indigo-300',
    badgeBg: 'bg-indigo-950/60',
    borderColor: 'border-indigo-500/40'
  },

  // ==========================================
  // 6. DIALECTO TRANSVERSAL & GLOSARIO
  // ==========================================
  {
    id: 'term_dunvairhy',
    type: 'transversal',
    name: "Dun'vai'rhy («El Silencio del Yo»)",
    aliases: ['dunvairhy', "dun'vai'rhy", 'el silencio del yo', 'voto alevoro'],
    category: 'Juramento Canónico',
    roleHint: 'Voto Sagrado',
    detail: 'Voto sagrado de renuncia al ego, a los hijos y al apego individual impuesto a la casta Alévora. Quebrantado por Dreda al amar a Komokaru.',
    quote: '«El que pronuncia el Dun\'vai\'rhy no renuncia a la voz, sino a la mentira de creerse dueño de su eco.»',
    atlasTab: 'sociedad',
    color: 'text-purple-300',
    badgeBg: 'bg-purple-950/60',
    borderColor: 'border-purple-500/40'
  },
  {
    id: 'term_taelim',
    type: 'transversal',
    name: "Tael'im (Escritura Sagrada)",
    aliases: ['taelim', "tael'im", 'escritura taelim', 'sigilos'],
    category: 'Grafía Sagrada Tridimensional',
    roleHint: 'Escritura Canónica',
    detail: 'Sistema de escritura de trazos continuos, curvaturas y tensiones que reflejan la física del casco y las armonías del reactor.',
    quote: '«Cada trazo es un vector de gravedad; cada nodo, una vida que no se extinguió.»',
    atlasTab: 'thalvus',
    color: 'text-amber-300',
    badgeBg: 'bg-amber-950/60',
    borderColor: 'border-amber-500/40'
  },
  {
    id: 'term_eos',
    type: 'transversal',
    name: "Eos («El Yo-Soberano»)",
    aliases: ['eos', 'pronombre eos', 'el yo soberano'],
    category: 'Pronombre de Soberanía',
    roleHint: 'Estatus Lingüístico',
    detail: 'Pronombre reservado a los ciudadanos de casta alta del Émulo. Implica derecho sobre los recursos, el voto y la progenie.',
    atlasTab: 'sociedad',
    color: 'text-yellow-300',
    badgeBg: 'bg-yellow-950/60',
    borderColor: 'border-yellow-500/40'
  },
  {
    id: 'term_vas',
    type: 'transversal',
    name: "Vas («El Yo-Recipiente / Vasija»)",
    aliases: ['vas', 'pronombre vas', 'yo-recipiente', 'la vasija'],
    category: 'Pronombre Servil',
    roleHint: 'Humildad Sacrificial',
    detail: 'Pronombre de los Alévoros y siervos. Define a quien se vacía de apetito propio para convertirse en herramienta de la nave.',
    atlasTab: 'sociedad',
    color: 'text-teal-300',
    badgeBg: 'bg-teal-950/60',
    borderColor: 'border-teal-500/40'
  },
  {
    id: 'term_tala',
    type: 'cronosistema',
    name: 'Tala (Día Operativo de 48 Horas)',
    aliases: ['tala', 'ciclo tala', 'dia tala'],
    category: 'Métrica Temporal Canónica',
    roleHint: 'Ciclo Diario',
    detail: 'Día estándar de la nave: 262,144 Viras (~48 horas terrestres). 32 horas de vigilia activa y 16 horas de reposo térmico.',
    atlasTab: 'cronosistema',
    color: 'text-amber-400',
    badgeBg: 'bg-amber-950/60',
    borderColor: 'border-amber-500/40'
  },
  {
    id: 'term_nema',
    type: 'cronosistema',
    name: 'Nema (Mes Administrativo de 32 Días)',
    aliases: ['nema', 'mes nema', 'edad en nemas'],
    category: 'Métrica de Edad y Turno',
    roleHint: 'Ciclo Mensual',
    detail: '16 Talas (4,194,304 Viras). Medición oficial de la edad humana en la nave (Pwaoo: 319 nemas).',
    atlasTab: 'cronosistema',
    color: 'text-amber-400',
    badgeBg: 'bg-amber-950/60',
    borderColor: 'border-amber-500/40'
  },
  {
    id: 'term_vira',
    type: 'cronosistema',
    name: 'Vira (Pulsación Base ~0.659s)',
    aliases: ['vira', 'latido vira', 'pulso vira'],
    category: 'Métrica Base del Tiempo',
    roleHint: 'Pulso Fundamental',
    detail: 'Pulsación técnica elemental sincronizada con el ritmo cardíaco humano en reposo.',
    atlasTab: 'cronosistema',
    color: 'text-emerald-300',
    badgeBg: 'bg-emerald-950/60',
    borderColor: 'border-emerald-500/40'
  },

  // ==========================================
  // 7. CRÓNICA & HITOS HISTÓRICOS
  // ==========================================
  {
    id: 'hist_partida',
    type: 'historia',
    name: '2672: Despegue desde Manicore (Brasil)',
    aliases: ['manicore', 'despegue 2672', 'la partida', 'la cuna'],
    category: 'Hito Fundacional',
    roleHint: 'Origen de la Nave',
    detail: 'Partida vertical de Estación Humanidad desde el Gran Desierto del Amazonas con 12.3 millones de tripulantes.',
    atlasTab: 'cronica',
    color: 'text-yellow-300',
    badgeBg: 'bg-yellow-950/60',
    borderColor: 'border-yellow-500/40'
  },
  {
    id: 'hist_apagon',
    type: 'historia',
    name: 'Año 72.4 (2720 d.C.): El Gran Apagón',
    aliases: ['el gran apagon', 'año 72.4', 'apagon de 9 meses', 'colapso del reactor'],
    category: 'Cataclismo Fundacional',
    roleHint: 'Quiebre Histórico',
    detail: 'Fallo crítico del reactor principal. Nueve meses de oscuridad, canibalismo y congelación que sellaron para siempre el destino del arca.',
    atlasTab: 'dorada-apagon',
    color: 'text-red-400',
    badgeBg: 'bg-red-950/60',
    borderColor: 'border-red-500/40'
  },
  {
    id: 'hist_phaetim',
    type: 'historia',
    name: '2952: Maniobra de Frenado en Phaetim',
    aliases: ['phaetim', 'gigante azul', 'maniobra de frenado', 'año 2952'],
    category: 'Momento Presente de la Novela',
    roleHint: 'Clímax Actual',
    detail: 'Aproximación gravitacional a la gigante azul Phaetim. Las aceleraciones desatarán la rebelión y el Protocolo HAVA.',
    atlasTab: 'cronica',
    color: 'text-cyan-300',
    badgeBg: 'bg-cyan-950/60',
    borderColor: 'border-cyan-500/40'
  },
  {
    id: 'hist_protozeus',
    type: 'historia',
    name: '3023: Arribo Estimado a Protozeus',
    aliases: ['protozeus', 'tierra prometida', 'arribo 3023'],
    category: 'Destino Final del Viaje',
    roleHint: 'Horizonte Prometido',
    detail: 'Planeta habitable destino tras 351 años de viaje interestelar. Quedan 71 años de tránsito.',
    atlasTab: 'cronica',
    color: 'text-emerald-300',
    badgeBg: 'bg-emerald-950/60',
    borderColor: 'border-emerald-500/40'
  },

  // ==========================================
  // 8. DOSSIER HAVA & SECRETOS OBSIDIANA
  // ==========================================
  {
    id: 'hava_protocol',
    type: 'hava',
    name: 'Protocolo HAVA (Purga de la Periferia)',
    aliases: ['protocolo hava', 'hava', 'la purga', 'clasificado obsidiana'],
    category: 'Conspiración Máxima del Consejo',
    roleHint: 'Secreto de Estado',
    detail: 'Directriz secreta para cortar el soporte vital de las cubiertas 217 a 320 durante el frenado en Phaetim para ahorrar energía.',
    quote: '«La masa sobrante no puede ser desembarcada en Protozeus; es combustible que ya ha cumplido su ciclo.»',
    atlasTab: 'hava',
    color: 'text-red-500',
    badgeBg: 'bg-red-950/80',
    borderColor: 'border-red-500/60'
  },
  {
    id: 'hava_reactor',
    type: 'hava',
    name: 'Reactor Principal Mutilado al 42%',
    aliases: ['reactor mutilado', 'estado del reactor', 'fallo del reactor'],
    category: 'Verdad Oculta de Energía',
    roleHint: 'Restricción Física Real',
    detail: 'El motor interestelar opera a menos de la mitad de su potencia nominal desde el Gran Apagón. No hay suficiente energía para 1.2 millones de humanos.',
    atlasTab: 'hava',
    color: 'text-amber-500',
    badgeBg: 'bg-amber-950/70',
    borderColor: 'border-amber-500/50'
  },

  // ==========================================
  // 9. LA TRILOGÍA (ESTRUCTURA DE NOVELA)
  // ==========================================
  {
    id: 'nov_libro1',
    type: 'novela',
    name: 'Libro I: La Grieta del Frío',
    aliases: ['libro 1', 'libro i', 'la grieta del frio', 'primera novela'],
    category: 'Trilogía Novelesca',
    roleHint: 'Manuscrito Volumen 1',
    detail: 'Presentación del arca, la vida íntima de Pwaoo y Kiwori en la 233, el romance prohibido de Dreda y Komokaru, y la primera sospecha de HAVA.',
    atlasTab: 'novela',
    color: 'text-sky-300',
    badgeBg: 'bg-sky-950/60',
    borderColor: 'border-sky-500/40'
  },
  {
    id: 'nov_libro2',
    type: 'novela',
    name: 'Libro II: El Pulso Gremial',
    aliases: ['libro 2', 'libro ii', 'el pulso gremial', 'segunda novela'],
    category: 'Trilogía Novelesca',
    roleHint: 'Manuscrito Volumen 2',
    detail: 'El levantamiento de los talleres de la Zona Media, la huelga del oxígeno y la alianza con los Involutivos del Infierno.',
    atlasTab: 'novela',
    color: 'text-amber-300',
    badgeBg: 'bg-amber-950/60',
    borderColor: 'border-amber-500/40'
  },
  {
    id: 'nov_libro3',
    type: 'novela',
    name: 'Libro III: El Émulo Roto',
    aliases: ['libro 3', 'libro iii', 'el emulo roto', 'tercera novela'],
    category: 'Trilogía Novelesca',
    roleHint: 'Manuscrito Volumen 3',
    detail: 'Frenado violento en Phaetim, colapso de la cúpula holográfica y la caída del Gran Padre Vireus.',
    atlasTab: 'novela',
    color: 'text-rose-300',
    badgeBg: 'bg-rose-950/60',
    borderColor: 'border-rose-500/40'
  }
];

// Map rápido por ID
export const LORE_ENTITIES_MAP = new Map<string, LoreEntityDefinition>(
  LORE_ENTITIES_CATALOG.map(item => [item.id, item])
);

// Roles posibles para clasificar una relación
export const RELATIONSHIP_ROLES = [
  'Protagonista Clave',
  'Antagonista / Conflicto',
  'Escenario Principal',
  'Causa Directa',
  'Consecuencia / Efecto',
  'Regla Canónica',
  'Doctrina Subyacente',
  'Mención Breve',
  'Hipótesis / Duda',
  'Inspiración'
];

/**
 * Escáner inteligente: Detecta menciones del lore en un texto
 */
export function detectLoreEntitiesInText(text: string, existingLinkIds: string[] = []): LoreEntityDefinition[] {
  if (!text || text.trim().length === 0) return [];
  const lower = text.toLowerCase();
  const detected: LoreEntityDefinition[] = [];

  for (const entity of LORE_ENTITIES_CATALOG) {
    if (existingLinkIds.includes(entity.id)) continue;

    // Buscar por nombre exacto o aliases
    const matched = entity.aliases.some(alias => {
      if (alias.length < 3) return false;
      const regex = new RegExp(`\\b${escapeRegExp(alias)}\\b`, 'i');
      return regex.test(lower);
    });

    if (matched) {
      detected.push(entity);
    }
  }

  return detected;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sugerencia inteligente de temática basada en el contenido y la sección
 */
export function suggestThematicFromContent(text: string, sectionId: string): string {
  const lower = (text || '').toLowerCase();

  if (lower.includes('hexpace') || lower.includes('bioina') || lower.includes('quimio') || lower.includes('droga') || lower.includes('sobredosis') || lower.includes('sustancia')) {
    return 'Farmacología & Quimio';
  }
  if (lower.includes('dun\'vai\'rhy') || lower.includes('alévoro') || lower.includes('casta') || lower.includes('esterilidad') || lower.includes('vasija')) {
    return 'Castas & Alévoros';
  }
  if (lower.includes('hava') || lower.includes('purga') || lower.includes('secreto') || lower.includes('bassa') || lower.includes('conspiracion') || lower.includes('obsidiana')) {
    return 'Dossier HAVA & Secreto';
  }
  if (lower.includes('frio') || lower.includes('infierno') || lower.includes('mamparo') || lower.includes('cubierta') || lower.includes('c320') || lower.includes('vacio')) {
    return 'Topología & Cubiertas';
  }
  if (lower.includes('tala') || lower.includes('nema') || lower.includes('kroma') || lower.includes('vira') || lower.includes('cronosistema') || lower.includes('horocrono')) {
    return 'Tiempo & Cronosistema';
  }
  if (lower.includes('vortice') || lower.includes('thalvus') || lower.includes('ner\'val') || lower.includes('filosofia') || lower.includes('amtti')) {
    return 'Filosofía & Ontología';
  }
  if (lower.includes('capitulo') || lower.includes('novela') || lower.includes('trama') || lower.includes('escena') || lower.includes('libro')) {
    return 'Trama & Estructura';
  }

  // Fallback por sección
  switch (sectionId) {
    case 'sociedad': return 'Castas & Alévoros';
    case 'cronosistema': return 'Tiempo & Cronosistema';
    case 'cubiertas': return 'Topología & Cubiertas';
    case 'personajes': return 'Personajes & Vínculos';
    case 'thalvus':
    case 'vortices': return 'Filosofía & Ontología';
    case 'hava': return 'Dossier HAVA & Secreto';
    case 'novela': return 'Trama & Estructura';
    default: return 'Canon & Verdad';
  }
}
