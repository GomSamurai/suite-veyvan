/**
 * COMPENDIO TOTAL DE LORE: ESTACIÓN HUMANIDAD // PROTOCOLO THALIOS SOLARIS
 * Base de datos inmutable, fidedigna y exhaustiva extraída de la Biblia Narrativa y los Códices de Obsidian.
 */

export interface StationGlobalMetrics {
  yearCurrent: number; // 2952
  departureYear: number; // 2672
  travelYears: number; // 344
  launchSite: string; // "Base de Manicore, Gran Desierto del Amazonas, Brasil"
  totalDecks: number; // 320
  activeDecks: number; // 132
  heightMeters: number; // 20000 (20 km)
  widthMeters: number; // 2000 (2 km)
  lengthMeters: number; // 800 (0.8 km)
  habitableVolumeKm3: number; // 17.3 km³
  maxDesignCapacity: number; // 15,000,000
  departurePopulation: number; // 12,300,000
  currentPopulation: number; // 1,200,000
  reactorStatus: string; // "Mutilado al 40-50% tras El Gran Apagón (Año 72.4 / 2720 d.C.)"
  currentLocation: string; // "Aproximación gravitacional a la gigante azul Phaetim"
  nextMilestone: string; // "Orbogán (2956 d.C.)"
  promisedLand: string; // "Planeta Protozeus (Año estimado de arribo: 3023 d.C.)"
  remainingTravelYears: number; // 71 años restantes
}

export const STATION_GLOBAL_METRICS: StationGlobalMetrics = {
  yearCurrent: 2952,
  departureYear: 2672,
  travelYears: 344,
  launchSite: "Base de Manicore, Gran Desierto del Amazonas, Tierra (La Cuna)",
  totalDecks: 320,
  activeDecks: 132,
  heightMeters: 20000,
  widthMeters: 2000,
  lengthMeters: 800,
  habitableVolumeKm3: 17.3,
  maxDesignCapacity: 15000000,
  departurePopulation: 12300000,
  currentPopulation: 1200000,
  reactorStatus: "Mutilado al 42% de capacidad tras El Gran Apagón del año 72.4 (2720 d.C.)",
  currentLocation: "Sistema de Phaetim (Gigante Azul), Sector de Desaceleración",
  nextMilestone: "Empuje de Asistencia Gravitacional en Orbogán (2956 d.C.)",
  promisedLand: "Planeta Protozeus (Llegada estimada: 3023 d.C. // 351 años totales)",
  remainingTravelYears: 71
};

export interface HistoricalEra {
  id: string;
  stage: string;
  years: string;
  leader: string;
  title: string;
  summary: string;
  keyEvents: string[];
  ideology: string;
  status: 'completada' | 'presente' | 'futura';
}

export const HISTORICAL_TIMELINE: HistoricalEra[] = [
  {
    id: 'era-1',
    stage: 'Sol ➔ Alpha Centauri A',
    years: '2672 - 2686 d.C.',
    leader: 'Vorlëmm Hatz',
    title: 'La Gran Madre Primordial',
    summary: 'Partida heroica de la Tierra desde el Gran Desierto del Amazonas con 12.3 millones de almas en el arca. Mandato de armonía colectiva, nacimiento de la filosofía de la Evolución Consciente y las primeras cartas estelares.',
    keyEvents: [
      '2672: Despegue vertical orbital masivo desde Manicore (Brasil).',
      'Primeros asentamientos armónicos comunitarios en las 320 cubiertas.',
      '2679: Asistencia gravitacional de Alpha Centauri A (4.4 años luz de la Tierra).',
      '2686: Fallecimiento de Vorlëmm Hatz a los 89 años; asume Divya Magna.'
    ],
    ideology: 'Comunitarismo libre y florecimiento de la consciencia colectiva en el vacío.',
    status: 'completada'
  },
  {
    id: 'era-2',
    stage: 'Alpha Centauri A ➔ Khizel',
    years: '2686 - 2732 d.C.',
    leader: 'Divya Magna',
    title: 'La Madre de la Fractura',
    summary: 'La era que definió el destino cruel de la nave. En el año 72.4 de colonización (2720 d.C.), el Reactor Principal colapsa. Divya Magna toma la decisión de sellar la cúpula central (Émulo) y aislar a la élite, sacrificando la periferia.',
    keyEvents: [
      '2720 d.C. (Año 72.4): El Gran Apagón. Nueve meses de oscuridad total y anarquía.',
      'Surgimiento del Émulo como ciudadela holográfica blindada exclusiva de la élite.',
      'Mutilación permanente del reactor al 40-50% de su rendimiento nominal.',
      '2732: Muerte de Divya Magna a los 92 años tras formalizar la segregación.'
    ],
    ideology: 'Preservación de los mejores a costa del sacrificio silencioso de la masa.',
    status: 'completada'
  },
  {
    id: 'era-3',
    stage: 'Khizel ➔ Iota Centauri',
    years: '2732 - 2784 d.C.',
    leader: 'Gierigh Perlman',
    title: 'El Primer Gran Padre',
    summary: 'Inicio del control absoluto del Consejo Administrativo. Refuerzo de los Protectores, ley marcial estricta, cuotas forzadas de control natal y prohibición de nuevos asentamientos.',
    keyEvents: [
      '2766: Empuje gravitacional en Khizel (13.2 años luz de la Cuna).',
      'Institucionalización de la escasez energética como arma de sumisión política.',
      'Reclusión paranoica de Gierigh; sospechas históricas de envenenamiento en el Consejo.'
    ],
    ideology: 'Autoritarismo tecnocrático y represión preventiva de la disidencia.',
    status: 'completada'
  },
  {
    id: 'era-4',
    stage: 'Iota Centauri ➔ Demeri',
    years: '2784 - 2831 d.C.',
    leader: 'Galyasta Daar',
    title: 'La Paz Ilusoria',
    summary: 'El mandato más longevo en la historia de la Estación (47 años). Suavizó superficialmente el trato a la periferia y legalizó colonias de descompresión para aliviar el hacinamiento sin ceder un solo vatio de energía del Émulo.',
    keyEvents: [
      'Reformas estéticas y creación de válvulas de escape cultural (Feria de los Oficios).',
      'Consolidación del monopolio energético del Émulo bajo un velo paternalista.',
      'Fallecimiento pacífico a los 96 años.'
    ],
    ideology: 'Reformismo superficial para garantizar la sumisión sin alterar la estructura de castas.',
    status: 'completada'
  },
  {
    id: 'era-5',
    stage: 'Demeri ➔ Hecalix',
    years: '2831 - 2867 d.C.',
    leader: 'Kallic IODes',
    title: 'El Tirano de Obsidiana',
    summary: 'Retorno brutal del viejo orden aristocrático. Creación de los primeros "Campos de Reeducación" en cubiertas exteriores y uso masivo de la policía secreta. Sobrevivió a un atentado antes de delegar el poder en su hija Talia.',
    keyEvents: [
      'Creación de prisiones de frío y deportaciones sistemáticas a las Cubiertas Polares.',
      'Primeros actos coordinados de sabotaje de la resistencia en ductos de ventilación.',
      'Atentado con bomba de plasma en el Atrio del Émulo.'
    ],
    ideology: 'Pureza genética aristocrática y castigo punitivo sin piedad.',
    status: 'completada'
  },
  {
    id: 'era-6',
    stage: 'Hecalix ➔ Phaetim',
    years: '2867 - 2952 d.C.',
    leader: 'Klauss Karapetian & Numm Daar',
    title: 'El Ocaso de los Grandes Padres',
    summary: 'Austeridad implacable. Numm Daar gobierna con nostalgia y achaques durante 48 años hasta quedar postrado en un exoesqueleto. En las sombras emerge la figura ascética y fría de Vireus, quien asume el mando de facto en 2952.',
    keyEvents: [
      'Numm Daar intenta restaurar la memoria moral de Vorlëmm Hatz sin éxito.',
      'Descubrimiento y reactivación del Protocolo HAVA por parte de Vireus.',
      '2952 (Presente): Transición formal hacia Vireus y aproximación al sistema Phaetim.'
    ],
    ideology: 'Nostalgia impotente de la vieja guardia desplazada por el darwinismo de Vireus.',
    status: 'presente'
  },
  {
    id: 'era-7',
    stage: 'Phaetim ➔ Orbogán ➔ Protozeus',
    years: '2952 - 3023 d.C.',
    leader: 'Vireus (o la Nueva Consciencia)',
    title: 'El Despertar de la Verdad / Llegada a Protozeus',
    summary: 'La gran colisión. El frenado en Phaetim desata la conspiración HAVA, el éxodo masivo desde el Infierno liderado por Pwaoo, Kiwori, Komokaru y Mephesgeister, y la caída del cielo de cristal del Émulo.',
    keyEvents: [
      '2952: Maniobra de frenado orbital en Phaetim y ejecución frustrada de HAVA.',
      'Colapso físico de la Cúpula Hológrafa del Émulo ante la invasión de la periferia.',
      '2956: Empuje final en Orbogán rumbo al planeta prometido.',
      '3023: Arribo programado a Protozeus tras 351 años de exilio cósmico.'
    ],
    ideology: 'La reconstrucción de una humanidad sin mentiras funcionales sobre suelo firme.',
    status: 'futura'
  }
];

export interface DeckSector {
  id: string;
  name: string;
  deckRange: string;
  deckCount: number;
  energyPct: string;
  tempRange: string;
  havaImpact: boolean;
  status: 'critico' | 'peligro' | 'precario' | 'funcional' | 'privilegiado' | 'muerto';
  description: string;
  socialLife: string;
  notableLocations: string[];
}

export const DECK_ZONING: DeckSector[] = [
  {
    id: 'sec-polares',
    name: 'Zona Polar // El Infierno',
    deckRange: 'C302 - C320',
    deckCount: 19,
    energyPct: '1% - 3% (Robada)',
    tempRange: '-40°C a -80°C',
    havaImpact: true,
    status: 'critico',
    description: 'El estrato más inhóspito de la nave. Hogar de los Involutivos, exiliados políticos y marginados que sobreviven parasitando nodos de energía residual. El frío extremo congela las mamparas y el aire sabe a metal quemado.',
    socialLife: 'Sociedad tribal autogestionada bajo la doctrina Amtti ("Superación por Sacrificio") fundada por Mephesgeister. Hogueras clandestinas de grasa sintética, cultivo de levadura fermentada y solidaridad férrea ante la muerte térmica.',
    notableLocations: [
      'Cubierta 312: Campamento central de Mephesgeister',
      'Nodos Colectores de Radiación Polar',
      'El Foso del Elevador Industrial',
      'Búnkeres de Hielo y Resina'
    ]
  },
  {
    id: 'sec-abandonada',
    name: 'Zona Abandonada // El Vacío Muerto',
    deckRange: 'C259 - C301',
    deckCount: 43,
    energyPct: '0% - 3%',
    tempRange: '-20°C a -50°C',
    havaImpact: true,
    status: 'peligro',
    description: 'Bloque de 43 niveles inhabitables con secciones en despresurización parcial, cables congelados y bolsas de Neevar (niebla condensada altamente tóxica). Ruinas de la primera época del Apagón.',
    socialLife: 'Sin población legal. Bandas de chatarreros armados y carroñeros que custodian los boquetes de paso. Quien se aventura sin máscara de filtro muere de edema pulmonar en 2 Talas.',
    notableLocations: [
      'Cubierta 270: El Boquete de la Garra',
      'Corredor del Neevar Tóxico',
      'Almacenes Fantasma de Colonización 2672'
    ]
  },
  {
    id: 'sec-alejada',
    name: 'Zona Alejada // Periferia Profunda',
    deckRange: 'C238 - C258',
    deckCount: 21,
    energyPct: '5% - 10%',
    tempRange: '2°C a 8°C',
    havaImpact: true,
    status: 'precario',
    description: 'La energía desciende gradualmente hacia el norte. Población humilde dedicada a la fundición menor, reciclaje de plásticos y empaquetado de pasta proteica.',
    socialLife: 'Vida austera pero comunitaria. Familias extensas hacinadas en módulos de chapa. Trueque constante de filtros usados y baterías hackeadas.',
    notableLocations: [
      'Cubierta 245: Mercadillo de Circuitos Quemados',
      'Ductos de Conexión C238'
    ]
  },
  {
    id: 'sec-exterior',
    name: 'Zona Exterior // Periferia Activa',
    deckRange: 'C217 - C237',
    deckCount: 21,
    energyPct: '15% - 18%',
    tempRange: '10°C a 16°C',
    havaImpact: true,
    status: 'precario',
    description: 'Frontera de la civilización funcional. Aquí reside la Cubierta 233, cuna de Los Jardineros. Los techos son bajos, las vigas vibran al ritmo del reactor y el suministro lumínico parpadea con cortes programados.',
    socialLife: 'Cultura de resistencia y fraternidad obrera. Se cultivan musgos resistentes en invernaderos hidropónicos para abastecer de gel proteico al bloque. Consumo recreativo de té de hierba seca y drogas artesanales como Xin y Hoja Gris.',
    notableLocations: [
      'Cubierta 233: Invernadero 0508 de Pwaoo y Kiwori',
      'El Tragaluz: Refugio íntimo en lo alto de los tubos',
      'Apartamento-Laboratorio del Dr. Philippius Mayern',
      'Terminal de Comunicaciones Olvidada de la C231'
    ]
  },
  {
    id: 'sec-media',
    name: 'Zona Media // El Pulso Gremial',
    deckRange: 'C196 - C216',
    deckCount: 21,
    energyPct: '30% - 50%',
    tempRange: '18°C a 21°C',
    havaImpact: false,
    status: 'funcional',
    description: 'El núcleo de la clase trabajadora y técnica de la estación. Suministro eléctrico estable, comercios de trueque regulados, escuelas técnicas y talleres mecánicos de precisión.',
    socialLife: 'Gremios organizados (Mecánicos, Saneamiento, Hidropónicos). Celebración de la Feria de los Oficios y la Noche de Filtros Nuevos. Los Protectores patrullan con armadura ligera.',
    notableLocations: [
      'Cubierta 205: Gran Taller de Autómatas',
      'Mercado de los Cuatro Engranajes',
      'Comisaría de Enlace de Protectores'
    ]
  },
  {
    id: 'sec-central',
    name: 'Zona Central // Cuadros Técnicos',
    deckRange: 'C176 - C195',
    deckCount: 20,
    energyPct: '50% - 70%',
    tempRange: '20°C a 23°C',
    havaImpact: false,
    status: 'funcional',
    description: 'Niveles habitados por la burocracia intermedia, ingenieros de reactor, médicos especialistas y científicos de alto rango. Apartamentos espaciosos, comida texturizada de calidad y acceso a redes de datos ampliadas.',
    socialLife: 'Sociedad formal y competitiva. Visten túnicas con ribetes de casta. Sus hijos son evaluados en el Día de la Asignación para acceder al servicio del Consejo.',
    notableLocations: [
      'Cubierta 180: Academia de Ciencias de Navegación',
      'Hospital Central de Bioingeniería',
      'El Vestíbulo: Aduana de control hacia el Émulo'
    ]
  },
  {
    id: 'sec-nuclear',
    name: 'Zona Nuclear & El Émulo',
    deckRange: 'C146 - C175',
    deckCount: 30,
    energyPct: 'Directa (100%)',
    tempRange: '22°C constante (Primavera artificial)',
    havaImpact: false,
    status: 'privilegiado',
    description: 'El corazón sagrado y opulento de Estación Humanidad. Alberga el Reactor Principal y la Cúpula Hológrafa geodésica instalada entre C160 y C161. Un paraíso artificial con césped natural, árboles clonados de la Tierra, cielo celeste simulado y ríos de agua desmineralizada.',
    socialLife: 'Hogar del Consejo Administrativo, las Familias Fundadoras y la corte de los Alévoros. Banquetes de carne celular y frutas frescas, moda de polímeros bioluminiscentes y ceremonias del Día del Émulo. Desconexión absoluta con el sufrimiento de las cubiertas bajas.',
    notableLocations: [
      'Cúpula Hológrafa de los Jardines del Émulo',
      'Torre del Consejo Administrativo',
      'Claustro de los Alévoros y Templo Algante',
      'Sala de Audiencias de Numm Daar y Vireus',
      'Armería del Comandante Komokaru'
    ]
  },
  {
    id: 'sec-produccion',
    name: 'Producción & Factorías Pesadas',
    deckRange: 'C105 - C145',
    deckCount: 41,
    energyPct: '50% - 70%',
    tempRange: '24°C a 30°C',
    havaImpact: false,
    status: 'funcional',
    description: 'Los talleres mayores de la nave: siderurgia de mamparos, ensamblaje de módulos para la futura colonia de Protozeus, reactores químicos de combustible ionizado y purificadores atmosféricos planetarios.',
    socialLife: 'Operarios especializados en turnos de 3 Semas. Ruido atronador de prensas hidráulicas y olor penetrante a ozono y lubricante.',
    notableLocations: [
      'Fundición de Resilium y Aleaciones Pesadas',
      'Hangar de Almacenamiento de Módulos de Colonización',
      'Túnel de Enfriamiento Principal del Motor'
    ]
  },
  {
    id: 'sec-sellada',
    name: 'Zona Sellada // El Sur Muerto',
    deckRange: 'C001 - C104',
    deckCount: 104,
    energyPct: '3% (Emergencia de blindaje)',
    tempRange: '-10°C a 45°C (Fuga térmica del motor)',
    havaImpact: true,
    status: 'muerto',
    description: 'El tercio sur de la nave, sellado herméticamente desde el Gran Apagón para actuar como sarcófago de contención radiológica de las toberas de propulsión de materia oscura.',
    socialLife: 'Totalmente deshabitado y patrullado solo por drones oruga blindados. La leyenda habla de ermitaños que escaparon al sellado hace 80 años.',
    notableLocations: [
      'Compuerta Obsidiana C104',
      'Toberas del Motor de Fusión Principal',
      'Sarcófago Radiológico Austral'
    ]
  }
];

export interface CharacterDossier {
  id: string;
  name: string;
  alias: string;
  ageNemas: number;
  ageYears: number;
  deckOrigin: string;
  role: string;
  faction: string;
  quote: string;
  physicalDesc: string;
  psychology: string;
  moralDilemma: string;
  weaponOrTool: string;
  allies: string[];
  rivals: string[];
  arcSummary: string;
}

export const CHARACTERS_DATABASE: CharacterDossier[] = [
  {
    id: 'pwaoo',
    name: 'Pwaoo Puari',
    alias: 'El Jardinero de Acero',
    ageNemas: 319,
    ageYears: 28,
    deckOrigin: 'Cubierta 233 (Zona Exterior)',
    role: 'Genetista Vegetal // Líder de Los Jardineros',
    faction: 'Los Jardineros de la 233 / Resistencia',
    quote: '«No permitiré que midan la vida de mi gente en kilovatios sobrantes. Si el Émulo necesita que muramos para conservar su cielo pintado, entonces romperemos su cielo.»',
    physicalDesc: '1.75 m, complexión atlética y delgada forjada en el trabajo de invernadero. Piel pálida de mamparo, cabello negro azabache recogido en una trenza con una esfera metálica artesanal. Mirada marrón profunda que irradia fuego interior.',
    psychology: 'Carismático, empático y con un optimismo visceral irreductible. Padre adoptivo del niño Chappa. Practica artes marciales y meditación en los ductos para dominar la impulsividad.',
    moralDilemma: 'Comienza queriendo salvar las plantas de su cubierta de los recortes de luz; concluye obligado a transformarse en el líder espiritual y militar de una revolución de miles de olvidados.',
    weaponOrTool: 'Cuchillo de poda botánica de resilium y llave multitarea de nodos energéticos.',
    allies: ['kiwori', 'mayern', 'chappa', 'komokaru', 'mephesgeister'],
    rivals: ['vireus', 'bassa'],
    arcSummary: 'De horticultor rebelde a catalizador de la nueva conciencia que destruye la mentira funcional.'
  },
  {
    id: 'kiwori',
    name: 'Kiwori Dahn',
    alias: 'La Alquimista del Resilium',
    ageNemas: 307,
    ageYears: 27,
    deckOrigin: 'Cubierta 233 (Zona Exterior)',
    role: 'Bioingeniera de Guerrilla // Científica de Los Jardineros',
    faction: 'Los Jardineros / Comunidad C233',
    quote: '«He calculado las probabilidades hasta el cuarto decimal. La única variable que mi ecuación rechaza categóricamente es aquella donde Pwaoo muere solo en el frío.»',
    physicalDesc: '1.68 m, ágil y delgada. Cabello rubio claro cortado a navaja con un flequillo asimétrico que cae sobre penetrantes ojos azules analíticos. Manos marcadas por reactivos químicos y callos de manipulación de injertos.',
    psychology: 'Cerebral, meticulosa y protectora férrea de los suyos. Reparte nutrientes a ancianos en la 233. Su frialdad aparente es un escudo para no desmoronarse ante la miseria cotidiana.',
    moralDilemma: 'Creadora del Resilium (bambú modificado tan duro como el titanio). Debe elegir entre la ciencia pura o la fabricación de armamento de guerrilla para forzar las compuertas.',
    weaponOrTool: 'Tableta cuántica hackeada de análisis espectral y jeringas de coagulante bio-sintético.',
    allies: ['pwaoo', 'mayern', 'owa', 'izzet'],
    rivals: ['bassa', 'vireus'],
    arcSummary: 'La mente analítica indispensable que encuentra las brechas técnicas en la arquitectura del Consejo.'
  },
  {
    id: 'komokaru',
    name: "Komokaru 'Taul",
    alias: 'El Guerrero Filósofo',
    ageNemas: 433,
    ageYears: 38,
    deckOrigin: 'Zona Nuclear (El Émulo)',
    role: 'Comandante en Jefe de la Guardia del Émulo',
    faction: 'Protectores del Consejo (desertor) / Alianza Polar',
    quote: '«Juré proteger el orden porque creía que el orden protegía a las personas. Cuando descubrí que el orden era solo la maquinaria de su crematorio, mi juramento murió.»',
    physicalDesc: '1.90 m, 95 kg de pura potencia marcial. Dos trenzas oscuras que honran las tradiciones de casta militar. Cicatriz en la ceja izquierda. Viste armadura de placas ligeras de obsidiana mate.',
    psychology: 'Hombre de honor absoluto, austero, reflexivo y de pocas palabras. Lector voraz de textos clásicos en su celda de entrenamiento.',
    moralDilemma: 'Ama en secreto a Dreda Aran (amor castigado con ejecución). Al descubrir el plan de exterminio HAVA, deserta usando el transporte de deportación La Garra para unirse a los desterrados del Infierno.',
    weaponOrTool: 'Kajai (Katana ceremonial de impulsos electromagnéticos de alta frecuencia).',
    allies: ['dreda', 'pwaoo', 'tario', 'mephesgeister'],
    rivals: ['bassa', 'vireus'],
    arcSummary: 'El guardián supremo que traiciona a sus amos para convertirse en el martillo del pueblo desterrado.'
  },
  {
    id: 'dreda',
    name: 'Dreda Aran',
    alias: 'La Máscara de Porcelana',
    ageNemas: 330,
    ageYears: 29,
    deckOrigin: 'Casta Alévora // El Émulo',
    role: 'Alévora Primera de Vireus // Espía Clandestina',
    faction: 'Los Alévoros / Aliada de la Resistencia',
    quote: '«Bajo la seda blanca nos enseñan que somos un espejo vacío. Pero yo guardo en mis cajitas de madera tallada los nombres de cada hombre que el Consejo ha decidido borrar.»',
    physicalDesc: '1.68 m, gracia aristocrática etérea. Cabello castaño oscuro recogido en tocados Algante ceremoniales, ojos color miel cargados de melancolía y sospecha. Túnicas níveas asimétricas con ribetes de oro litúrgico.',
    psychology: 'Sensible, profundamente culta y valiente hasta el sacrificio. Sometida al voto Dun\'Val\'Thy (renuncia a la propiedad, a la maternidad y al amor privado). Disimula su disidencia tallando cajitas de madera.',
    moralDilemma: 'Su romance prohibido con Komokaru y el descubrimiento de los archivos de HAVA en los aposentos de Vireus la colocan en la mira del sádico consejero Bassa.',
    weaponOrTool: 'Estiletes de caligrafía Algante y micro-grabadores criptográficos disimulados en sus joyas.',
    allies: ['komokaru', 'pwaoo'],
    rivals: ['bassa', 'vireus'],
    arcSummary: 'La infiltrada que arriesga su alma y su vida para transmitir las pruebas del genocidio programado.'
  },
  {
    id: 'vireus',
    name: 'Vireus',
    alias: 'La Inevitabilidad // La Gran Madre Necesaria',
    ageNemas: 558,
    ageYears: 49,
    deckOrigin: 'Alta Consejería del Émulo',
    role: 'Consejera Suprema // Regente de Facto',
    faction: 'El Consejo Administrativo / Vor-Veheli',
    quote: '«La nave es un organismo vivo. Si una extremidad se pudre y amenaza el corazón, se amputa sin derramar lágrimas. HAVA no es odio ni venganza; es pura termodinámica.»',
    physicalDesc: '1.80 m, figura estilizada e imponente. Cabeza completamente rapada coronada con un Daaki ceremonial de metal líquido. Ojos verdes de mirada quirúrgica e inexpresiva. Túnicas austeras de paño negro y plata.',
    psychology: 'Fanática del darwinismo estructural. Vive en un ascetismo espartano; no busca riqueza ni vanidad, sino garantizar que la especie alcance Protozeus a cualquier costo humano.',
    moralDilemma: 'Cree con convicción inquebrantable que el exterminio del 73% de la periferia en Phaetim es la única ecuación matemática que evitará la muerte térmica de toda la especie.',
    weaponOrTool: 'El sello biométrico de mando absoluto de los reactores de la nave.',
    allies: ['bassa'],
    rivals: ['numm-daar', 'komokaru', 'pwaoo', 'mephesgeister'],
    arcSummary: 'La antagonista perfecta: una líder incorruptible en su crueldad que cree estar salvando el futuro.'
  },
  {
    id: 'mayern',
    name: 'Dr. Philippius Mayern',
    alias: 'El Archivero del Apocalipsis',
    ageNemas: 1060,
    ageYears: 93,
    deckOrigin: 'Exiliado de la Zona Central a C233',
    role: 'Físico Cuántico y Astrofísico // Mentor',
    faction: 'Científicos Disidentes / Los Jardineros',
    quote: '«La ciencia que no sirve a la compasión y a la consciencia es solo contabilidad de matadero con fórmulas elegantes.»',
    physicalDesc: 'Delgado, encorvado por el tiempo y el frío. Ojos celestes vivos como chispas eléctricas entre una red de arrugas centenarias. Viste túnicas raídas de lana sintética y lleva siempre un reloj cuántico analógico.',
    psychology: 'Sabio, generoso y mordaz. Despojado de honores pero no de dignidad. Mentor intelectual de Pwaoo y Kiwori, a quienes educa en los vórtices filosóficos de Joren Thalvus.',
    moralDilemma: 'Guarda mapas de las rutas de ascenso secretas, pero sabe que el camino hacia las polares es una trampa mortal para jóvenes inexpertos.',
    weaponOrTool: 'Astrolabio cuántico portátil y códices manuscritos de la Fundación.',
    allies: ['pwaoo', 'kiwori', 'mephesgeister'],
    rivals: ['bassa', 'vireus'],
    arcSummary: 'El puente vivo entre los ideales de la Tierra y la insurrección de las nuevas generaciones.'
  },
  {
    id: 'mephesgeister',
    name: 'Mephesgeister Isos',
    alias: 'El Profeta del Hielo',
    ageNemas: 752,
    ageYears: 66,
    deckOrigin: 'Exiliado a C312 (Zona Polar)',
    role: 'Patriarca de los Involutivos // Fundador de Amtti',
    faction: 'Comunidad del Infierno / Involutivos',
    quote: '«En el frío absoluto no hay máscaras. El dolor es el único cincel que templa el espíritu para no quebrarse ante las estrellas.»',
    physicalDesc: 'Estatura colosal, barba blanca espesa y piel cuarteada por quemaduras de escarcha. Su torso está cubierto de tatuajes tribales que narran las eras de los olvidados.',
    psychology: 'Líder estoico, severo pero infinitamente compasivo con los desamparados. Antiguo auditor del Consejo que fue condenado por denunciar el tráfico de sueros de longevidad de los aristócratas.',
    moralDilemma: 'Debe superar su doctrina de sufrimiento pasivo y resignación mística para liderar a miles de tullidos y enfermos en el Gran Éxodo hacia abajo.',
    weaponOrTool: 'Báculo de titanio helado y masa madre de levadura sacramental.',
    allies: ['tario', 'komokaru', 'pwaoo'],
    rivals: ['vireus'],
    arcSummary: 'De profeta del sufrimiento a general del éxodo más multitudinario de la historia de la nave.'
  },
  {
    id: 'numm-daar',
    name: 'Numm Daar',
    alias: 'El Gran Padre que Espera',
    ageNemas: 946,
    ageYears: 83,
    deckOrigin: 'Familia Fundadora Daar // El Émulo',
    role: 'Gran Padre de la Estación (Saliente)',
    faction: 'Familia Daar / Tradicionalistas',
    quote: '«Heredé una corona de plumas y acero. Pensé que gobernaba hombres, pero solo administraba el inventario de una jaula que viaja por la noche infinita.»',
    physicalDesc: 'Anciano frágil postrado en un trono con soporte de exoesqueleto neumático. Rostro surcado por la amargura de la impotencia política.',
    psychology: 'Nostálgico, temeroso y melancólico. Gobernó durante 52 años creyendo que la moderación evitaría la guerra civil, solo para ver cómo Vireus le arrebataba el control bajo sus narices.',
    moralDilemma: 'Sabe del horror de HAVA pero carece de la fuerza militar para desafiar al Consejo.',
    weaponOrTool: 'El bastón de mando ceremonial del Gran Padre.',
    allies: ['dreda'],
    rivals: ['vireus', 'bassa'],
    arcSummary: 'La tragedia del gobernante bondadoso que por cobardía permitió la gestación del monstruo.'
  },
  {
    id: 'bassa',
    name: 'Bassa Orb',
    alias: 'El Susurrador del Consejo',
    ageNemas: 610,
    ageYears: 54,
    deckOrigin: 'Seguridad Interior del Émulo',
    role: 'Consejero de Inteligencia y Policía Secreta',
    faction: 'El Consejo / Protectores',
    quote: '«No busco culpables; busco desvíos en la conducta prevista. Todo secreto en esta estación deja una firma térmica en mis sensores.»',
    physicalDesc: 'Enjuto, tez cenicienta y sonrisa felina congelada. Camina apoyado en un bastón de obsidiana con escáner biométrico y agujas neurales.',
    psychology: 'Sádico refinado, paranoico y maestro del interrogatorio psicológico. Sospecha desde el primer momento de Dreda y Komokaru.',
    moralDilemma: 'Ninguno. El orden total y la erradicación del pensamiento libre son su única liturgia.',
    weaponOrTool: 'Bastón de escaneo biométrico y dardos de parálisis sináptica.',
    allies: ['vireus'],
    rivals: ['dreda', 'komokaru', 'pwaoo'],
    arcSummary: 'El ejecutor siniestro en las sombras que persigue implacablemente a los amantes clandestinos.'
  }
];

export interface PhilosophicalVortex {
  number: number;
  id: string;
  name: string;
  transversalName: string;
  translation: string;
  corePrinciple: string;
  factionAssociation: string;
  quote: string;
  description: string;
  symbolMeaning: string;
}

export const PHILOSOPHICAL_VORTICES: PhilosophicalVortex[] = [
  {
    number: 1,
    id: 'vor-veheli',
    name: 'Evolución Consciente',
    transversalName: 'Vor-Veheli',
    translation: 'Ver y Trascender',
    corePrinciple: 'La vida en el vacío interestelar no es un accidente que deba tolerarse, sino un crisol donde la mente humana debe mutar deliberadamente.',
    factionAssociation: 'El Consejo Administrativo / Élite del Émulo (deformado)',
    quote: '«No hemos abandonado la Tierra para seguir siendo barro; somos la semilla que aprende a respirar luz.»',
    description: 'La doctrina fundacional redactada por Vorlëmm Hatz. Postula que el viaje de 350 años es una oportunidad cósmica para erradicar las mezquindades terrestres. Desgraciadamente, el régimen de Vireus la distorsionó en un darwinismo social para justificar la purga de los "involutivos".',
    symbolMeaning: 'Espiral ascendente que rompe la circunferencia del mamparo.'
  },
  {
    number: 2,
    id: 'shefir-aen',
    name: 'Tejedores de Sueños',
    transversalName: 'Shefir-aen',
    translation: 'Urdimbre del Vacío',
    corePrinciple: 'La belleza, la poesía y el arte geométrico Tael\'im son las únicas defensas del alma contra la locura de los mamparos ciegos.',
    factionAssociation: 'Artesanos Algante, Calígrafos y Casta Alévora',
    quote: '«El mamparo que no tiene grabada una línea de belleza es solo una tumba que aún no se ha cerrado.»',
    description: 'Promueve la sublimación estética: el dibujo de sigilos, el tallado de madera y el bordado de biopolímeros. Muy extendida entre los Alévoros como forma silenciosa de resistencia mental.',
    symbolMeaning: 'Lazo continuo que entrelaza dos planos paralelos.'
  },
  {
    number: 3,
    id: 'nilem-ti',
    name: 'Escucha Profunda',
    transversalName: 'Nilem-ti',
    translation: 'Oído en el Silencio',
    corePrinciple: 'El cosmos habla a través de los armónicos del metal. Aquel que sabe escuchar la frecuencia del reactor comprende la salud del alma colectiva.',
    factionAssociation: 'Físicos teóricos, Místicos Veyvān y Acústicos de Reactor',
    quote: '«Calla tu lengua durante un Kroma y escucharás el aliento de los que murieron hace tres eras en esta misma plancha.»',
    description: 'Práctica meditativa basada en el silencio absoluto y la escucha de las vibraciones armónicas del casco. Creen que el dialecto Transversal es la traducción fonética de la respiración de la nave.',
    symbolMeaning: 'Círculo concéntrico con punto nodal resonante.'
  },
  {
    number: 4,
    id: 'domeris',
    name: 'Comunidad Unida',
    transversalName: 'Domeris',
    translation: 'Un Solo Hogar',
    corePrinciple: 'La supervivencia del individuo es una quimera burguesa; solo la red solidaria de las cubiertas garantiza el mañana.',
    factionAssociation: 'Zona Media, Gremios Obreros y Los Jardineros de la 233',
    quote: '«Si tu vecino pasa frío en la noche de la Tala, tu propia cobija terminará helándose.»',
    description: 'El pilar ético de las cubiertas populares. Fomenta el reparto equitativo de raciones, la crianza comunitaria de huérfanos (como Chappa con Pwaoo) y el socorro mutuo en averías.',
    symbolMeaning: 'Tres manos entrelazadas formando un triángulo invertido.'
  },
  {
    number: 5,
    id: 'amtti',
    name: 'Superación por Sacrificio',
    transversalName: 'Amtti',
    translation: 'Fricción y Fuego Interior',
    corePrinciple: 'El dolor, el frío y la carencia no son castigos, sino la piedra de afilar donde el espíritu humano se despoja de la ilusión de la carne.',
    factionAssociation: 'Comunidad del Infierno (Cubiertas Polares C302-C320) / Mephesgeister',
    quote: '«Agradece a la escarcha su mordisco, pues te recuerda que aún no te has disuelto en la nada.»',
    description: 'La doctrina mística nacida en las cubiertas polares. Permite a los miles de olvidados mantener la cordura y el orgullo en condiciones de temperatura bajo cero, transformando la miseria en templanza sagrada.',
    symbolMeaning: 'Delta afilado con un punto de fuego blanco en el vértice.'
  },
  {
    number: 6,
    id: 'nih-sol',
    name: 'La Cuna Perdida',
    transversalName: 'Nih\'Sol',
    translation: 'Duelo por la Tierra',
    corePrinciple: 'La humanidad cometió un pecado imperdonable al huir de la Tierra. El viaje es un purgatorio que exige expiación constante.',
    factionAssociation: 'Ancianos Terranáuticos, Cultos Nostálgicos de la Cuna',
    quote: '«Allí el agua caía del cielo sin bombas ni tuberías. Decidme si eso no era el verdadero paraíso que perdimos.»',
    description: 'Movimiento melancólico que conserva fotos en papel antiguo de bosques y océanos terrestres. Castigado por el Consejo, pues fomenta la desesperanza y la desobediencia.',
    symbolMeaning: 'Esfera azul partida por una línea quebrada.'
  },
  {
    number: 7,
    id: 'nai-tessa',
    name: 'El Triunfo del Fuerte',
    transversalName: 'Nai-Tessa',
    translation: 'Voluntad que Quiebra',
    corePrinciple: 'Los recursos son finitos. Quien duda o siente piedad frena el avance del Arca. Solo los aptos tienen derecho a pisar Protozeus.',
    factionAssociation: 'La Policía Secreta, Bassa Orb y Cuadros del Consejo',
    quote: '«La compasión en una nave con fuga de oxígeno es un crimen contra la especie.»',
    description: 'La filosofía de la clase dominante que justifica las ejecuciones sumarias, las cuotas de inanición en la periferia y los planes eugénicos.',
    symbolMeaning: 'Cuchilla vertical que corta una viga horizontal.'
  },
  {
    number: 8,
    id: 'nu-mitta',
    name: 'Negación y Olvido',
    transversalName: 'Nu-Mitta',
    translation: 'El Velo Suave',
    corePrinciple: 'El dolor de existir en una lata de sardinas interestelar solo se soporta borrando la memoria y entregándose al trance químico.',
    factionAssociation: 'Submundos de Hexpace, Opo-K y Xin en la periferia',
    quote: '«Si inhalas suficiente niebla gris, el techo de acero se vuelve tan suave como una nube de la que nadie recuerda la forma.»',
    description: 'Corriente nihilista de escape psicológico que alimenta el tráfico de drogas artesanales y la prostitución en las cubiertas deprimidas.',
    symbolMeaning: 'Espiral difusa que se desvanece en gris ceniza.'
  },
  {
    number: 9,
    id: 'kreeke-thrao',
    name: 'Ciclo de Destrucción',
    transversalName: 'Kreeke\'Thrao',
    translation: 'El Gran Quiebre',
    corePrinciple: 'El viaje está condenado. La nave no llegará a Protozeus. Es preferible forzar el colapso que prolongar la agonía de generaciones.',
    factionAssociation: 'Grupos radicales de sabotaje y terrorismo nihilista',
    quote: '«Que los reactores ardan de una vez y devuelvan nuestros átomos al vacío en una llamarada digna.»',
    description: 'Fanáticos que intentan provocar detonaciones en los circuitos de refrigeración del motor para terminar con el sufrimiento de la nave.',
    symbolMeaning: 'Ojo ciego tachado por dos barras en aspa.'
  }
];

export interface ChronosystemMetric {
  unit: string;
  symbol: string;
  multiplier: string;
  earthEquivalent: string;
  description: string;
  contextUsage: string;
}

export const CHRONOSYSTEM_TABLE: ChronosystemMetric[] = [
  {
    unit: 'Vira',
    symbol: 'Vi',
    multiplier: '1 (Base)',
    earthEquivalent: '~0.659 segundos',
    description: 'Pulsación técnica base derivada del ritmo cardíaco humano en microgravedad.',
    contextUsage: 'Sincronización de sistemas informáticos, ciclos de CPU y tiempo de reacción balística.'
  },
  {
    unit: 'Fula',
    symbol: 'Fu',
    multiplier: '64 Viras',
    earthEquivalent: '~42.2 segundos',
    description: 'El "minuto rápido" de la estación.',
    contextUsage: 'Pausas breves entre tareas operativas, tiempos de descompresión de esclusas.'
  },
  {
    unit: 'Kroma',
    symbol: 'Kr',
    multiplier: '32 Fulas (2,048 Vi)',
    earthEquivalent: '~22.5 minutos',
    description: 'Unidad estándar de actividad breve.',
    contextUsage: 'Duración de una comida, relevo de guardia o sesión de meditación fónica.'
  },
  {
    unit: 'Sema',
    symbol: 'Se',
    multiplier: '16 Kromas (32,768 Vi)',
    earthEquivalent: '~6 horas',
    description: 'Cuarto de día. El turno laboral canónico de las cubiertas de producción.',
    contextUsage: 'Los operarios trabajan turnos de 2 a 3 Semas seguidos de 1 Sema de descanso.'
  },
  {
    unit: 'Tala',
    symbol: 'Ta',
    multiplier: '8 Semas (262,144 Vi)',
    earthEquivalent: '~48 horas (2 días)',
    description: 'El "Día Operativo Estándar" de la Estación Humanidad.',
    contextUsage: 'Ciclo circadiano biológico adaptado: ~32 horas de vigilia activa seguidas de 16 horas de reposo.'
  },
  {
    unit: 'Nema',
    symbol: 'Ne',
    multiplier: '16 Talas (4,194,304 Vi)',
    earthEquivalent: '~32 días terrestres',
    description: 'El "Mes" administrativo y biológico de la nave.',
    contextUsage: 'Medición oficial de la edad humana (Pwaoo: 319 nemas), cobro de asignaciones y rotación de filtros.'
  },
  {
    unit: 'Kora',
    symbol: 'Ko',
    multiplier: '32 Nemas (134,217,728 Vi)',
    earthEquivalent: '~2.8 años terrestres (1,024 días)',
    description: 'Ciclo de vida institucional y revisión general del casco.',
    contextUsage: 'Auditorías del Consejo, promociones de casta y recambio de filtros masivos.'
  },
  {
    unit: 'Era',
    symbol: 'E',
    multiplier: '64 Koras',
    earthEquivalent: '~179.6 años terrestres',
    description: 'Unidad histórica generacional.',
    contextUsage: 'La historia de la estación se divide en Era 1 (Fundación y Apagón) y Era 2 (La Regencia).'
  }
];

export interface SubstanceEntry {
  id: string;
  name: string;
  category: string;
  legalStatus: 'legal' | 'restringida' | 'prohibida' | 'clandestina';
  origin: string;
  physicalForm: string;
  effects: string;
  withdrawal: string;
  loreContext: string;
}

export const SUBSTANCES_COMPENDIUM: SubstanceEntry[] = [
  {
    id: 'hexpace',
    name: 'Hexpace',
    category: 'Estimulante Neuro-Sintético',
    legalStatus: 'prohibida',
    origin: 'Refinerías clandestinas de C231 a partir de refrigerante reciclado.',
    physicalForm: 'Polvo cristalino azulado o vapor inhalable mediante pipas de cobre.',
    effects: 'Agudiza la percepción sensorial, acelera los reflejos en un 300% y permite procesar código y esquemas a velocidades sobrehumanas. Owa es adicto terminal a esta sustancia.',
    withdrawal: 'Temblor incontrolable, paranoia sónica, fallo cardíaco y alucinaciones de asfixia en el vacío.',
    loreContext: 'Utilizado por hackers de la periferia para violar terminales del Consejo. Quien cae en el Hexpace rara vez supera los 300 nemas de vida.'
  },
  {
    id: 'bioina',
    name: 'Bioina',
    category: 'Regenerador Celular Militar',
    legalStatus: 'restringida',
    origin: 'Laboratorios del Émulo (Zona Nuclear).',
    physicalForm: 'Gel verdoso bioluminiscente administrado mediante inyector neumático subcutáneo.',
    effects: 'Coagulación casi instantánea de hemorragias, sellado de desgarros musculares y alivio del dolor por trauma severo.',
    withdrawal: 'Dependencia física moderada, atrofia del sistema inmune autónomo si se abusa.',
    loreContext: 'Exclusivo de los Protectores y de la Guardia Personal de Komokaru. Cotizadísimo en el mercado negro de las cubiertas bajas.'
  },
  {
    id: 'h3',
    name: 'H-3 (Gas del Letargo)',
    category: 'Sedante de Control de Masas',
    legalStatus: 'restringida',
    origin: 'Depósitos de Seguridad del Consejo Administrativo.',
    physicalForm: 'Aerosol incoloro e inodoro inyectable a través de los conductos de ventilación.',
    effects: 'Sopor inmediato, relajación muscular total, parálisis de la voluntad y pérdida de la memoria a corto plazo.',
    withdrawal: 'Cefalea intensa y apatía motora durante 3 Talas.',
    loreContext: 'El arma favorita de Bassa Orb para sofocar conatos de motín en los talleres de producción sin disparar un solo proyectil.'
  },
  {
    id: 'hoja-gris',
    name: 'Hoja Gris',
    category: 'Narcótico Herbal Periférico',
    legalStatus: 'clandestina',
    origin: 'Mutaciones fúngicas en las raíces de los bio-tanques de C233 y C238.',
    physicalForm: 'Hojas secas pulverizadas que se queman lentamente o se mastican como pasta.',
    effects: 'Sensación de calidez corporal profunda (muy codiciada en el frío de la periferia), analgesia leve y ensoñación despierta.',
    withdrawal: 'Escalofríos violentos e insomnio pertinaz.',
    loreContext: 'El consuelo de los ancianos en las Vigilias del Frío. Se fuma en pipa clandestina con filtros de tela para evitar alarmas de humo.'
  },
  {
    id: 'lagrima-agua',
    name: 'Lágrima de Agua',
    category: 'Bebida Alcohólica de Élite',
    legalStatus: 'legal',
    origin: 'Destilerías de los Jardines de Exhibición del Émulo.',
    physicalForm: 'Licor transparente cristalino servido en copas de cuarzo tallado.',
    effects: 'Euforia lúcida y desinhibición sin pérdida del control motor ni resaca posterior.',
    withdrawal: 'Ninguna conocida.',
    loreContext: 'Símbolo del derroche aristocrático. Una sola botella equivale al agua potable racionada de una familia de C233 durante 12 Nemas.'
  },
  {
    id: 'xin',
    name: 'Xin (Polvo de Resina)',
    category: 'Euforizante Callejero',
    legalStatus: 'prohibida',
    origin: 'Raspado de resinas aislantes de cables de alta tensión recalentados.',
    physicalForm: 'Polvillo anaranjado que se frota en las encías.',
    effects: 'Ráfaga de euforia breve (15 minutos) que atenúa el hambre y produce risa histérica.',
    withdrawal: 'Caída de piezas dentales, úlceras bucales y depresión profunda.',
    loreContext: 'La droga de los desposeídos en la Zona Alejada; barata, destructiva y endémica entre los recolectores de chatarra.'
  }
];

export interface NovelBookBreakdown {
  bookNumber: number;
  title: string;
  subtitle: string;
  timelineLabel: string;
  theme: string;
  summary: string;
  lossTheme: string;
  keyChapters: {
    number: number;
    title: string;
    synopsis: string;
    loss: string;
  }[];
}

export const NOVEL_TRILOGY_BREAKDOWN: NovelBookBreakdown[] = [
  {
    bookNumber: 1,
    title: 'La Estación del Silencio',
    subtitle: 'La Ignorancia Organizada',
    timelineLabel: 'Días -50 a -20 previos al cruce de Phaetim',
    theme: 'La Mentira Funcional: el sistema parece incuestionable, pero el zumbido de la decadencia ya no se puede acallar.',
    summary: 'En la Cubierta 233, Los Jardineros luchan por el musgo de su invernadero mientras en el Émulo se prepara la coronación de Vireus. Un robo de energía en una terminal de la C231 desvela archivos encriptados del proyecto HAVA. El grupo decide emprender el ascenso hacia los polos ignorando que se adentran en la boca del lobo.',
    lossTheme: 'Pérdida de la inocencia, de la seguridad y de la unidad del grupo.',
    keyChapters: [
      {
        number: 1,
        title: 'El Gran Padre que Espera',
        synopsis: 'Numm Daar, paralizado y nostálgico, contempla el traspaso de poderes a Vireus mientras la nave enfila hacia Phaetim.',
        loss: 'La autoridad moral de la vieja guardia es aplastada por el pragmatismo.'
      },
      {
        number: 2,
        title: 'Cada Destino Tiene una Cubierta (C233)',
        synopsis: 'La dura vida cotidiana en el Invernadero 0508. La decisión de Los Jardineros de desviar energía de un nodo oculto.',
        loss: 'Resignación pacífica ante la escasez.'
      },
      {
        number: 3,
        title: 'La Alévora Primera',
        synopsis: 'Dreda Aran en los jardines del Émulo; encuentro furtivo con Komokaru y la mirada inquisidora del consejero Bassa.',
        loss: 'Inocencia de casta y seguridad emocional.'
      },
      {
        number: 4,
        title: 'La Terminal de la 231',
        synopsis: 'Incursión de Owa, Pwaoo y Kiwori en la terminal industrial. Descubrimiento de fragmentos del plan de reestructuración HAVA.',
        loss: 'El anonimato: el Consejo sabe que alguien ha tocado el archivo prohibido.'
      },
      {
        number: 10,
        title: 'La Separación (Clímax Libro I)',
        synopsis: 'En una cubierta helada y rota, Owa colapsa por abstinencia de Hexpace. Izzet decide descender con él mientras Pwaoo y Kiwori siguen hacia las polares.',
        loss: 'La unidad de Los Jardineros queda quebrada para siempre.'
      }
    ]
  },
  {
    bookNumber: 2,
    title: 'El Infierno de los Justos',
    subtitle: 'La Verdad que no se Puede Desver',
    timelineLabel: 'Días -20 a -3 previos a Phaetim',
    theme: 'El Núcleo Moral al Desnudo: confirmación del exterminio eugénico programado por la élite.',
    summary: 'Pwaoo y Kiwori alcanzan la Cubierta 312 y son acogidos por la comunidad del Infierno de Mephesgeister. Descubren que los marginados han creado un orden ético superior al del Émulo. Paralelamente, Komokaru deserta en La Garra tras confirmarse el plan de radiación Gamma. Cuando el transporte no regresa a recogerlos, comprenden que todos han sido sentenciados a muerte.',
    lossTheme: 'Pérdida de la fe en la institución y colapso de las certezas.',
    keyChapters: [
      {
        number: 1,
        title: 'El Encuentro en el Vacío',
        synopsis: 'Pwaoo y Kiwori descubren que el Infierno no es un caos de bestias salvajes, sino una comunidad de supervivencia guiada por la filosofía Amtti.',
        loss: 'El prejuicio civilizatorio inculcado por la propaganda del Consejo.'
      },
      {
        number: 2,
        title: 'Komokaru Cruza la Línea',
        synopsis: 'El comandante viaja con los reubicados en La Garra y es testigo del abandono sistemático en la C312. Decide no regresar jamás.',
        loss: 'La lealtad militar institucional de toda una vida.'
      },
      {
        number: 5,
        title: 'La Verdad Desnuda de HAVA',
        synopsis: 'Mephesgeister une los datos robados por los chicos con sus propios registros de hace 40 años: el objetivo es purgar al 73% de la periferia.',
        loss: 'La esperanza de que el plan fuera solo una mala interpretación técnica.'
      },
      {
        number: 7,
        title: 'El Abandono y la Convocatoria del Éxodo',
        synopsis: 'La Garra jamás regresa. Komokaru y Mephesgeister convocan el Éxodo masivo: miles de desterrados deben bajar a pie antes del inicio del frenado.',
        loss: 'La sumisión pasiva al destino: nace la insurrección.'
      }
    ]
  },
  {
    bookNumber: 3,
    title: 'El Día del Émulo',
    subtitle: 'Cuando el Secreto Cae',
    timelineLabel: 'Día 0 (Phaetim) y desenlace',
    theme: 'La Colisión de Mundos: el derrumbe de la cúpula y el fin de la mentira funcional.',
    summary: 'Mientras la élite baila en los jardines paradisíacos ajena al horror, el frenado orbital en Phaetim desata la lluvia de radiación en las cubiertas altas. La marea humana del Éxodo polar desciende por los túneles y se infiltra a través de los conductos de ventilación en el Émulo. Una explosión de cristal sobre la cúpula rompe el cielo falso y enfrenta a Vireus con la realidad que pretendió podar.',
    lossTheme: 'Pérdida del mundo perfecto artificial; nacimiento de una humanidad rota pero verdadera.',
    keyChapters: [
      {
        number: 1,
        title: 'El Descenso Agónico',
        synopsis: 'Carrera desesperada contra el cronómetro mientras el cielo exterior se ilumina con la furia azul de Phaetim y la radiación azota los mamparos altos.',
        loss: 'Centenares de vidas sacrificadas en las escaleras congeladas.'
      },
      {
        number: 2,
        title: 'El Sellado y la Traición de Bassa',
        synopsis: 'El Consejo ordena atrancar las puertas blindadas de la Zona Media. Dreda es interceptada por Bassa pero logra eyectar el paquete de datos.',
        loss: 'La red secreta de espías del palacio es desarticulada en sangre.'
      },
      {
        number: 4,
        title: 'El Derrumbe de la Cúpula',
        synopsis: 'La rebelión irrumpe en la fiesta. Sabotaje de los anclajes geodésicos: el "cielo" de cristal cae en pedazos sobre los jardines del Émulo.',
        loss: 'La mentira del paraíso artificial es aniquilada ante los ojos de la élite.'
      },
      {
        number: 5,
        title: 'La Tierra Rota (Epílogo)',
        synopsis: 'Vireus es derrocada por la inutilidad de su cálculo. Los sobrevivientes sellan la brecha y estabilizan el reactor. La nave sigue hacia Protozeus, pero el viaje ahora es humano.',
        loss: 'La inocencia utópica: la nueva civilización nacerá con cicatrices indelebles.'
      }
    ]
  }
];

export interface OracleAnswer {
  keywords: string[];
  title: string;
  response: string;
  sourceDoc: string;
}

export const ORACLE_LORE_ANSWERS: OracleAnswer[] = [
  {
    keywords: ['hava', 'radiacion', 'phaetim', 'plan', 'exterminio', 'consejo'],
    title: 'Protocolo de Deriva Exotérmica 49-B (Proyecto HAVA)',
    response: 'El Proyecto HAVA (Heurística de Ajuste Vital Asistido) es la conspiración central de la Alta Consejería liderada por Vireus. Disfrazado como una necesidad técnica de disipación térmica ante la radiación de la gigante azul Phaetim, el protocolo desvía intencionalmente el flujo de refrigerante de las cubiertas superiores (C217 a C320) y abre los corredores magnéticos hacia los polos. El objetivo real es la eugenesia estructural: exterminar al 73% de la población de la periferia (~12.000 a 15.000 almas) para reducir el consumo metabólico antes de encarar el tramo final hacia Protozeus.',
    sourceDoc: '/lore/ref/HAVA.md'
  },
  {
    keywords: ['apagon', 'reactor', '72.4', '2720', 'divya', 'falla', 'rotura'],
    title: 'El Gran Apagón del Año 72.4 (2720 d.C.)',
    response: 'A los 72.4 años de viaje (2720 d.C.), el Reactor Principal sufrió una desestabilización catastrófica de materia oscura que detuvo los sistemas por 9 meses. Ante el riesgo de extinción total, la líder Divya Magna tomó la decisión que fracturó para siempre a la sociedad: selló la cúpula central (Émulo) y desvió la escasa energía restante exclusivamente para salvar a los científicos, técnicos y aristócratas, dejando a la periferia en la penumbra, el frío y la enfermedad. Desde entonces, el reactor opera al 40-50% de potencia y la escasez fue institucionalizada como método de dominación.',
    sourceDoc: '/lore/historia/El_Gran_Apagon.md'
  },
  {
    keywords: ['emulo', 'cupula', 'jardines', 'arboles', 'cielo', 'elite'],
    title: 'El Émulo // La Cúpula Geodésica (C146 - C175)',
    response: 'El Émulo es una cúpula geodésica hológrafa de 2 km de diámetro construida entre las cubiertas C160 y C161. Mientras el resto de la nave vive bajo techos de acero oxidado a oscuras, el Émulo reproduce una primavera terrestre permanente a 22°C con césped real, arboledas clonadas, aves cautivas y proyecciones de cielos azules y atardeceres. Es la sede del Consejo Administrativo y el símbolo de la desconexión total entre los privilegios de los amos y el sufrimiento de los siervos.',
    sourceDoc: '/novela/enciclopedia/Infraestructura_Cupula_Holografa_y_Jardines.md'
  },
  {
    keywords: ['alevoros', 'dun', 'val', 'thy', 'dreda', 'mascara', 'juramento'],
    title: 'La Casta de los Alévoros y el Juramento Dun\'Val\'Thy',
    response: 'Los Alévoros son la casta servicial y religiosa de alta jerarquía estética del Émulo. Su existencia se rige por el juramento sagrado Dun\'Val\'Thy ("El Silencio del Yo"), que impone tres renuncias capitales: renuncia a la propiedad privada, renuncia a la descendencia (esterilidad química) y renuncia absoluta al amor romántico o preferencia personal (considerado traición ontológica). Visten túnicas pálidas asimétricas y máscaras ceremoniales pulidas como espejos.',
    sourceDoc: '/lore/ref/Alevoros.md'
  },
  {
    keywords: ['cronosistema', 'tiempo', 'vira', 'tala', 'nema', 'sema', 'reloj'],
    title: 'El Cronosistema de Estación Humanidad',
    response: 'En el vacío interestelar no existen días solares. El tiempo oficial se estructura en base binaria (potencias de 2): la Vira (~0.659 seg) es el latido base; 64 Viras forman una Fula (~42 seg); 32 Fulas forman un Kroma (~22.5 min); 16 Kromas forman un Sema (6 horas, turno de trabajo); 8 Semas forman una Tala (48 horas terrestres, ciclo biológico circadiano); y 16 Talas forman un Nema (32 días, mes estándar en el que se cuenta la edad). En paralelo, la cultura Veyvān mantiene el tiempo dozenal sagrado (ciclos Zou de base 12).',
    sourceDoc: '/lore/cronosistema/Cronosistema.md'
  },
  {
    keywords: ['pwaoo', 'kiwori', 'jardineros', '233', 'invernadero', 'resilium'],
    title: 'Los Jardineros de la Cubierta 233',
    response: 'Banda comunitaria que opera en el Invernadero 0508 de la C233. Liderados por Pwaoo Puari (genetista vegetal y padre adoptivo de Chappa) y Kiwori Dahn (bioingeniera creadora del Resilium). Junto con Owa (hacker drogadicto) e Izzet (estibadora hercúlea), protegen los cultivos de musgo enriquecido y las plantas adaptadas que alimentan a los huérfanos de su cubierta. Su incursión en una terminal de la C231 desata la cadena de revelaciones que conducirá a la insurrección polar.',
    sourceDoc: '/novela/protagonistas/Personajes_Principales.md'
  },
  {
    keywords: ['infierno', 'polares', 'mephesgeister', '312', 'tario', 'frio'],
    title: 'El Infierno y la Comunidad Polar de Mephesgeister',
    response: 'Las Cubiertas Polares (C302 a C320) reciben solo entre el 1% y el 3% de la energía residual de la nave, con temperaturas que caen hasta los -80°C. Conocidas despectivamente por el Consejo como "El Infierno", están pobladas por miles de "Involutivos" y disidentes desterrados. Lejos de ser un muladar caótico, Mephesgeister Isos y el militar castigado Tario Malantis han forjado una sociedad fraterna basada en el Vórtice Amtti ("Superación por Sacrificio") y el consumo sacramental de levadura madre fermentada.',
    sourceDoc: '/novela/enciclopedia/La_Comunidad_del_Infierno.md'
  },
  {
    keywords: ['protozeus', 'destino', 'planeta', 'llegada', 'distancia', 'viaje'],
    title: 'El Destino Prometido: Planeta Protozeus',
    response: 'Protozeus es el exoplaneta de destino seleccionado en 2672 antes de la partida desde Brasil. Se encuentra a 351 años de viaje interestelar continuo. Es un mundo virgen con atmósfera respirable y océanos primitivos. El año programado de arribo es el 3023 d.C. (restando 71 años desde el presente 2952). Toda la maquinaria de crueldad de Vireus y el Consejo se justifica bajo el argumento de que ningún recurso debe desperdiciarse si se quiere garantizar que la nave alcance la órbita de Protozeus con su biosfera intacta.',
    sourceDoc: '/lore/datos/Registro_Tecnico_Global.md'
  }
];

// ============================================================================
// EXPANSIONES MAYORES DE LORE: GRANDES LÍDERES, THALVUS, EVOLUCIÓN Y APAGÓN
// ============================================================================

export interface LeaderProfile {
  id: string;
  name: string;
  epithet: string;
  period: string;
  mandateYears: number;
  birthYear: number;
  deathYear: number | string;
  origin: string;
  philosophy: string;
  title: string;
  summary: string;
  biography: string;
  crisisAndAscent: string;
  keyMilestones: string[];
  downfallAndLegacy: string;
  historicalVerdict: string;
  iconQuote: string;
  colorScheme: {
    accent: string;
    border: string;
    bg: string;
    badge: string;
  };
}

export const LEADERS_GALLERY: LeaderProfile[] = [
  {
    id: 'vorlemm-hatz',
    name: 'Vorlëmm Hatz',
    epithet: 'La Primera Gran Madre',
    period: '2672 - 2686 d.C.',
    mandateYears: 14,
    birthYear: 2626,
    deathYear: 2686,
    origin: 'Países Bajos, Tierra (La Cuna)',
    philosophy: 'Vor-Veheli (Evolución Consciente Primordial)',
    title: 'Guía Fundacional de la Travesía',
    summary: 'Física teórica y mística holística que unificó a doce millones de almas en el Gran Éxodo. Abolió el dinero, instauró los Créditos Comunitarios y enseñó que el viaje no era un exilio, sino el parto cósmico de una humanidad más compasiva.',
    biography: 'Nacida en los Países Bajos el 11 de enero de 2626 en medio del colapso ecológico terrestre. Formada en física de altas energías y ciencias de la consciencia, comprendió que el metal de la nave jamás sostendría a la civilización si los corazones se desmoronaban en el vacío. Elegida por aclamación universal como líder de la Estación en 2672, nunca miró atrás cuando la base de Manicore en el desierto amazónico quedó envuelta en polvo.',
    crisisAndAscent: 'Asumió el mando en el instante más traumático de la especie: la partida definitiva de la Tierra. Supo transformar el luto planetario en un compromiso sagrado con el porvenir.',
    keyMilestones: [
      '2672: Despegue orbital y coordinación de 12.300.000 colonos en 320 cubiertas homogéneas sin castas.',
      'Abolición de la moneda fiduciaria e implantación del Sistema de Créditos Comunitarios.',
      '2679: Asistencia gravitacional histórica en Alpha Centauri A, llevando a la especie más lejos de lo jamás soñado.',
      'Redacción fundacional de las bases teóricas de la Evolución Consciente (Vórtice Vor-Veheli).'
    ],
    downfallAndLegacy: 'Falleció plácidamente de vejez a los 89 años en 2686. Su cuerpo fue devuelto al ciclo vital en el primer jardín hidropónico ceremonial. Hoy es adorada con veneración mesiánica; su estatua de bronce en el Émulo contempla a la de Divya en eterno diálogo mudo.',
    historicalVerdict: 'El cénit ético e incorruptible de la Estación. La Madre que demostró que el ser humano puede ser noble incluso al borde del abismo.',
    iconQuote: '“No viajamos para escapar de la muerte de un mundo, sino para estar despiertos cuando nazca el siguiente.”',
    colorScheme: {
      accent: 'text-amber-400',
      border: 'border-amber-500/40',
      bg: 'bg-amber-950/20',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
    }
  },
  {
    id: 'divya-magna',
    name: 'Divya Magna',
    epithet: 'La Protectora del Émulo // La Madre de la Fractura',
    period: '2686 - 2732 d.C.',
    mandateYears: 46,
    birthYear: 2640,
    deathYear: 2732,
    origin: 'Bangalore, India (Tierra)',
    philosophy: 'Vor-Veheli pragmático transicionado a Nai-Tessa',
    title: 'Arquitecta del Arca Interna y de la Segregación',
    summary: 'Sucesora designada por Vorlëmm. Durante su mandato floreció la cultura dorada hasta que en 2720 colapsó el Reactor Principal. Para salvar la misión, tomó la trágica decisión de sellar el Émulo y sacrificar a la periferia.',
    biography: 'Astrofísica y especialista en psicología de masas nacida en Bangalore en 2640. Se unió a la misión con 32 años como directora de bienestar psicosocial. Al fallecer Vorlëmm, condujo 34 años de prosperidad insólita hasta que la implacable física cósmica desgarró el reactor principal en el año 72.4 de vuelo.',
    crisisAndAscent: 'Enfrentada a la extinción inminente por el fallo del reactor y la pérdida del 60% del suministro vital, rechazó la muerte igualitaria de todos y eligió la supervivencia garantizada de la semilla esencial humana.',
    keyMilestones: [
      '2686-2720: Conducción de la Época Dorada, mecenazgo de tratados filosóficos y florecimiento del idioma Transversal.',
      '2720 d.C.: El Gran Apagón de 9 meses. Aislamiento y sellado hermético de la cúpula central (Émulo).',
      'Operación Arca Interna: Selección de 150.000 ingenieros, biólogos y eruditos para ser protegidos bajo el domo artificial.',
      'Estabilización parcial del Reactor al 42% y consagración de la jerarquía de castas como doctrina de supervivencia.'
    ],
    downfallAndLegacy: 'Falleció en 2732 a los 92 años, lúcida y consciente del odio visceral que su nombre despertaba en las cubiertas heladas. Es la figura más polarizada de la historia: santa protectora para el Consejo, verdugo y traidora para la periferia.',
    historicalVerdict: 'Salvó la misión física al precio irremediable de destruir su alma unificada. Sentó el precedente de sacrificar a la mayoría.',
    iconQuote: '“Si todos morimos en nombre de la equidad, nadie recordará que alguna vez fuimos humanos. El Émulo debe vivir aunque el casco se congele.”',
    colorScheme: {
      accent: 'text-cyan-400',
      border: 'border-cyan-500/40',
      bg: 'bg-cyan-950/20',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
    }
  },
  {
    id: 'gierigh-perlman',
    name: 'Gierigh Perlman',
    epithet: 'El Primer Gran Padre',
    period: '2732 - 2784 d.C.',
    mandateYears: 52,
    birthYear: 2710,
    deathYear: 2784,
    origin: 'Émulo, Estación Humanidad',
    philosophy: 'Nai-Tessa temprano // Totalitarismo Preventivo',
    title: 'Fundador del Estado Policial y los Protectores',
    summary: 'Hijo de las dinastías fundadoras del Émulo. Su gobierno de más de medio siglo transformó la Estación en un cuartel blindado. Creó la fuerza paramilitar de los Protectores e instauró el control de natalidad con pena de expulsión.',
    biography: 'Nacido ya dentro de los privilegios del Émulo e influenciado por su madre Eva Schmidt-Perlman. Creció bajo el pavor histérico a una rebelión sangrienta de los supervivientes congelados del Gran Apagón. Asumió el liderazgo supremo mediante un plebiscito amañado exclusivo de la élite.',
    crisisAndAscent: 'Utilizó el miedo a un segundo apagón y los rumores de sabotajes de la periferia para abolir las libertades civiles restantes y concentrar el mando en el Consejo Administrativo.',
    keyMilestones: [
      'Creación del cuerpo armado de Los Protectores, con jurisdicción absoluta para ejecutar opositores.',
      'Leyes de Control Natal Draconiano: nacimientos no autorizados castigados con destierro a sectores sin presurización.',
      '2766: Empuje gravitacional en Khizel (13.2 años luz de la Tierra).',
      'Desmantelamiento total de las asambleas obreras y censura sobre los tratados originales de Vorlëmm.'
    ],
    downfallAndLegacy: 'Gobernó 52 años consumido por una paranoia patológica que lo llevó a recluirse en búnkeres interiores. Murió repentinamente en 2784 a los 74 años; la historiografía clandestina documenta que fue envenenado con neurotoxina en su copa por sus propios oficiales.',
    historicalVerdict: 'El arquitecto de la bota opresora. Convirtió la escasez energética en el arma predilecta para subyugar a los obreros de la periferia.',
    iconQuote: '“El orden no es negociable en el vacío; un disidente que derrocha aire es un ladrón de la vida de todos.”',
    colorScheme: {
      accent: 'text-red-400',
      border: 'border-red-500/40',
      bg: 'bg-red-950/20',
      badge: 'bg-red-500/20 text-red-300 border-red-500/40'
    }
  },
  {
    id: 'galyasta-daar',
    name: 'Galyasta Daar',
    epithet: 'La Reformista // La Paz Ilusoria',
    period: '2784 - 2831 d.C.',
    mandateYears: 47,
    birthYear: 2750,
    deathYear: 2831,
    origin: 'Émulo, Dinastía Daar',
    philosophy: 'Retorno nostálgico a Vor-Veheli y Domeris',
    title: 'El Espejismo de la Reconciliación',
    summary: 'Líder moderada y compasiva que buscó sanar medio siglo de terror policial. Permitió la colonización de zonas de almacén abandonadas y mitigó el control natal, pero descubrió la impotencia moral frente al Muro de Cristal del Consejo.',
    biography: 'Criada en el seno de la influyente pero refinada casa Daar, estudió los textos prohibidos de Vorlëmm y Joren Thalvus. Tras la muerte de Perlman, el Consejo la encumbró para frenar una insurrección obrera que amenazaba con reventar las compuertas de la Zona Central.',
    crisisAndAscent: 'Supo canalizar el descontento popular con medidas de apertura, fiestas populares y la creación de la Feria de los Oficios, devolviendo un hálito de esperanza a las cubiertas intermedias.',
    keyMilestones: [
      'Legalización de asentamientos residenciales en almacenes descompresionados para aliviar el hacinamiento.',
      'Sustitución de las ejecuciones por nacimientos ilegales por multas en cuotas de raciones calóricas.',
      'Fomento de las artes y reapertura parcial de bibliotecas de la Vieja Tierra en la Zona Central.',
      'Mandato más prolongado y pacífico de la historia de la Estación (47 años ininterrumpidos).'
    ],
    downfallAndLegacy: 'Murió anciana y deprimida en 2831 a los 81 años. Aunque amada por el pueblo, su mandato demostró que las reformas tibias no pueden derribar un sistema fundado en privilegios materiales. A su muerte, los halcones del Consejo retomaron el látigo de inmediato.',
    historicalVerdict: 'Un corazón noble en un trono manchado. Su fracaso demostró que el Consejo no cede el poder sin derramamiento de sangre.',
    iconQuote: '“Gobernar mediante el castigo es confesar que hemos olvidado cómo convencer con el alma.”',
    colorScheme: {
      accent: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-950/20',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
    }
  },
  {
    id: 'kallic-iodes',
    name: 'Kallic IODes',
    epithet: 'El Tirano de Obsidiana',
    period: '2831 - 2867 d.C.',
    mandateYears: 36,
    birthYear: 2795,
    deathYear: 2867,
    origin: 'Émulo, Casta Aristocrática IODes',
    philosophy: 'Nai-Tessa extremo // Eugenesia Social Radical',
    title: 'El Verdugo de las Cubiertas Polares',
    summary: 'Aprovechó fluctuaciones energéticas para militarizar la nave bajo el lema "Eficiencia Absoluta". Creó los Campos de Reeducación en cámaras radiactivas y utilizó el hambre como herramienta política hasta sobrevivir a un atentado que lo desfiguró.',
    biography: 'Heredero de las familias fundadoras más rancias y reaccionarias. Despreciaba la tolerancia de Galyasta Daar como debilidad suicida. Militar de academia, ascendió sembrando el pánico sobre un hipotético fallo terminal del reactor.',
    crisisAndAscent: 'Desvió el 85% de la energía térmica restante hacia la Cúpula Central y los barrios nobles, congelando a propósito sectores enteros de la periferia para forzar la sumisión por hipotermia masiva.',
    keyMilestones: [
      'Construcción de los Campos de Reeducación en las cubiertas industriales con trabajos forzados en el blindaje del reactor.',
      'Hambrunas selectivas: corte deliberado de pasta sintética a sectores obreros huelguistas.',
      '2850: Atentado con bomba de plasma por parte de la resistencia; sobrevivió horriblemente desfigurado y con respirador hermético.',
      'Gobernó los últimos 17 años en absoluto aislamiento a través de su implacable hija Talia IODes.'
    ],
    downfallAndLegacy: 'Murió en 2867 entre delirios de persecución en sus aposentos blindados. Dejó una sociedad rota, con odios intercastas irreversibles y la leyenda negra del "Monstruo de Titanio" grabada a fuego en la memoria de las cubiertas bajas.',
    historicalVerdict: 'La encarnación del fascismo interestelar puro. Redujo a los humanos exteriores a cifras desechables en hojas de balance térmico.',
    iconQuote: '“La masa es carbón; el Émulo es el diamante. Es ley natural que el carbón se consuma para que el diamante brille.”',
    colorScheme: {
      accent: 'text-violet-400',
      border: 'border-violet-500/40',
      bg: 'bg-violet-950/20',
      badge: 'bg-violet-500/20 text-violet-300 border-violet-500/40'
    }
  },
  {
    id: 'klauss-karapetian',
    name: 'Klauss Karapetian',
    epithet: 'El Breve // El Vacilante',
    period: '2867 - 2904 d.C.',
    mandateYears: 37,
    birthYear: 2825,
    deathYear: 2904,
    origin: 'Zona Central, Familia Técnica',
    philosophy: 'Pragmatismo Tecnocrático Ineficaz',
    title: 'El Mandato de las Revueltas del Agua',
    summary: 'Ingeniero social nombrado por compromiso para calmar el polvorín dejado por IODes. Su gobierno colapsó ante una mutación bacteriana en las redes de agua reciclada y su parálisis entre negociar o reprimir con plomo.',
    biography: 'Técnico apacible y estudioso de infraestructuras sin ambición de tiranía. Fue puesto a dedo por el Consejo porque nadie más quería asumir el riesgo de ser linchado tras los crímenes de IODes. Creyó erróneamente que la gestión matemática resolvería tensiones políticas de clase.',
    crisisAndAscent: 'Al poco tiempo de asumir, la red de agua hidroreciclada colapsó por saturación de filtros bacterianos en las cubiertas 200 a 300, desatando una epidemia de disentería fulminante.',
    keyMilestones: [
      'Intento fallido de confiscar sueros médicos de los almacenes del Émulo (los Protectores desobedecieron sus órdenes).',
      'Las Revueltas del Agua de 2874: asaltos armados a depósitos de agua pura en la Zona Central.',
      'Parálisis ejecutiva: su indecisión causó miles de muertos tanto por enfermedad como por estampidas.',
      'Pérdida paulatina de toda autoridad legal en favor de las facciones duras del Consejo.'
    ],
    downfallAndLegacy: 'Terminó sus últimos quince años como un líder títere confinado en su despacho mientras el Consejo gobernaba por decretos secretos. Dimitió de facto y murió ignorado en 2904.',
    historicalVerdict: 'La prueba viviente de que la bondad sin determinación en un sistema viciado produce catástrofes tan graves como la tiranía.',
    iconQuote: '“Prometí que el agua fluiría para todos, pero las tuberías de esta nave obedecen a los amos del interruptor, no a mis palabras.”',
    colorScheme: {
      accent: 'text-blue-400',
      border: 'border-blue-500/40',
      bg: 'bg-blue-950/20',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
    }
  },
  {
    id: 'numm-daar',
    name: 'Numm Daar',
    epithet: 'El Último Humanista',
    period: '2904 - 2952 d.C.',
    mandateYears: 48,
    birthYear: 2860,
    deathYear: 2952,
    origin: 'Émulo, Dinastía Daar',
    philosophy: 'Vor-Veheli reformista con inclinación a Domeris',
    title: 'El Crepúsculo de la Esperanza Clásica',
    summary: 'Descendiente de Galyasta Daar, cargó con la culpa del linaje. Reconstruyó la Zona Central como espacio de paz y cultura, pero fue engañado por el Consejo, que vació la energía de las cubiertas polares a sus espaldas.',
    biography: 'Pensador lúcido, diplomático refinado y amante del Transversal arcaico. Gobernó con porte señorial y una profunda melancolía por los ideales traicionados de Vorlëmm. Creyó sinceramente que la dignidad humana aún podía restaurarse antes de alcanzar Protozeus.',
    crisisAndAscent: 'Reactivó la Zona Central (C130 - C160) convirtiéndola en un núcleo vibrante de comercio intercastas, escuelas públicas y teatros, logrando tres décadas de paz social inédita.',
    keyMilestones: [
      'Reconstrucción urbana de la Zona Central y reconciliación comercial con gremios obreros de cubiertas medias.',
      'Redacción de edictos de protección para los ancianos e inválidos de la periferia.',
      'Engaño del Consejo: mientras Numm creía que la paz avanzaba, el Consejo sellaba guetos exteriores donde sobrevivían marginados como Dreda.',
      'Ascenso de su protegido Vireus: Numm confió en su frialdad matemática sin adivinar la conspiración que urdía.'
    ],
    downfallAndLegacy: 'Envejeció postrado en un exoesqueleto médico en los Aposentos Daar del Émulo. En sus últimos meses descubrió indicios del Proyecto HAVA, pero su cuerpo y su voz ya no tenían fuerza para detenerlo. Murió en 2952.',
    historicalVerdict: 'Un mártir de su propia ingenuidad. Demostró que la nostalgia no basta para frenar a los heraldos de la extinción calculada.',
    iconQuote: '“Miramos a las estrellas con ojos cansados, rogando que el suelo de Protozeus perdone lo que permitimos que este barco hiciera en el camino.”',
    colorScheme: {
      accent: 'text-indigo-400',
      border: 'border-indigo-500/40',
      bg: 'bg-indigo-950/20',
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
    }
  },
  {
    id: 'vireus-consejeria',
    name: 'Vireus',
    epithet: 'La Heredera del Sacrificio // El Ojo Glacial',
    period: '2952 - Presente',
    mandateYears: 1,
    birthYear: 2908,
    deathYear: 'Activo (Líder Supremo de Facto)',
    origin: 'Círculo Interior del Consejo del Émulo',
    philosophy: 'Nai-Tessa absolutista // Eugenesia Termodinámica',
    title: 'El Vértice de la Gran Colisión en Phaetim',
    summary: 'Líder supremo actual. Asceta, gélido y carente de vanidad. Cree que el único deber supremo es llegar a Protozeus con el material genético de élite intacto, impulsando en secreto el Protocolo genocida HAVA durante la frenada en Phaetim.',
    biography: 'Nacido en 2908, instruido en matemáticas de vuelo, astrodinámica y bioseguridad. No bebe alcohol, no posee amantes y duerme apenas cuatro viras por ciclo en una celda espartana. Ve a la moralidad como un lujo que la termodinámica del reactor no puede permitirse.',
    crisisAndAscent: 'Aprovechó el declive senil de Numm Daar para concentrar los códigos de mando del reactor, los Protectores y las defensas de la Cúpula Central.',
    keyMilestones: [
      'Reactivación encubierta del Protocolo HAVA (Heurística de Ajuste Vital Asistido) para exterminar al 73% de la periferia.',
      'Coordinación de la peligrosa maniobra de deceleración orbital frente a la gigante azul Phaetim.',
      'Cierre absoluto de accesos entre la Zona Central y el Émulo ante la sospecha de células insurgentes.',
      'Enfrentamiento inminente contra la alianza de Pwaoo, Kiwori, Komokaru, Dreda y Mephesgeister.'
    ],
    downfallAndLegacy: 'Actualmente en el poder. Su legado dependerá del resultado de la insurrección en las cubiertas polares y de si el domo holográfico del Émulo resiste el colapso final de la verdad.',
    historicalVerdict: 'La culminación monstruosa del cálculo de Divya Magna: un intelecto colosal que renunció a la condición humana para cumplir un objetivo técnico.',
    iconQuote: '“No odio a los que van a morir en los anillos exteriores. Simplemente no hay suficiente calor en este reactor para alimentar su compasión y mi destino.”',
    colorScheme: {
      accent: 'text-rose-400',
      border: 'border-rose-500/40',
      bg: 'bg-rose-950/20',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
    }
  }
];

// ============================================================================
// ESPECIAL: JOREN THALVUS Y SUS CINCO GRANDES OBRAS
// ============================================================================

export interface ThalvusWork {
  id: string;
  title: string;
  year: string;
  status: 'completa' | 'inacabada';
  genre: string;
  summary: string;
  keyConcepts: { name: string; description: string }[];
  impact: string;
  quote: string;
}

export interface JorenThalvusSpecial {
  fullName: string;
  birthYear: number;
  deathYear: number;
  origin: string;
  astrogenitaGeneration: string;
  coreDoctrine: string;
  nerValConcept: {
    name: string;
    definition: string;
    synthesis: string;
    transversalTerm: string;
  };
  dialecticDichotomy: {
    terranauticos: {
      origin: string;
      mindset: string;
      memoryView: string;
      risks: string;
      transversalRoot: string;
    };
    astrogenitas: {
      origin: string;
      mindset: string;
      memoryView: string;
      risks: string;
      transversalRoot: string;
    };
  };
  biography: string;
  roleInBlackout: string;
  finalRestingPlace: string;
  works: ThalvusWork[];
}

export const JOREN_THALVUS_DATA: JorenThalvusSpecial = {
  fullName: 'Joren Thalvus',
  birthYear: 2690,
  deathYear: 2755,
  origin: 'Estación Humanidad (Sector Central)',
  astrogenitaGeneration: 'Primera Generación de Astrogénitas (Nacido en el Vacío)',
  coreDoctrine: 'Evolución Consciente y la Tejeduría del Campo Cuántico del Alma',
  nerValConcept: {
    name: 'Ner\'Val',
    definition: 'La apreciación de lo que fue, que nutre activamente lo que será.',
    synthesis: 'Superación de la fractura psicológica entre la nostalgia inmovilizante de los terranáuticos y el utilitarismo desalmado de los astrogénitas. La memoria de la Tierra no debe ser una tumba ni un mito, sino el abono fértil del nuevo ser cósmico.',
    transversalTerm: 'Ner\'Val (Simbiosis armónica entre raíz y fruto futuro)'
  },
  dialecticDichotomy: {
    terranauticos: {
      origin: 'Los 12.3 millones de almas nacidas en la Tierra (o sus herederos del culto a la memoria).',
      mindset: 'Portadores del duelo y de la herida del paraíso perdido; miran siempre hacia atrás buscando la Cuna.',
      memoryView: 'La Tierra como Edén inalcanzable que juzga con desdén la precariedad de la Estación.',
      risks: 'Parálisis existencial, amargura incurable, incapacidad de adaptarse a la dura física del viaje.',
      transversalRoot: 'Rha (La Raíz Sagrada, el Origen Inquebrantable)'
    },
    astrogenitas: {
      origin: 'Los primeros humanos nacidos íntegramente en los corredores artificiales de la Estación.',
      mindset: 'Nacieron en el vacío; la nave es su único universo concebible; Protozeus es un relato abstracto.',
      memoryView: 'Pragmatismo despiadado; ningún respeto por árboles o mares que nunca conocieron.',
      risks: 'Pérdida de la empatía humana básica, justificación de genocidios térmicos como el Plan HAVA.',
      transversalRoot: 'Zyra\'Shor-un (El Casco de Acero como Hogar Absoluto)'
    }
  },
  biography: 'Nacido en 2690 bajo los últimos destellos de la utopía de Vorlëmm. Fascinado desde niño por los escritos de la Primera Gran Madre, dedicó sus 65 años a codificar la filosofía del propósito, uniendo física cuántica de partículas y mística existencial. Fue el primer gran intelectual nacido sin conocer el peso del cielo natural.',
  roleInBlackout: 'A los 30 años, durante El Gran Apagón de 2720, ejerció como asesor de Divya Magna. Apoyó con dolor el sellado del Émulo para preservar los registros de la civilización, pero esa decisión le causó una angustia moral que desgarró cada página de sus obras posteriores.',
  finalRestingPlace: 'Falleció pacíficamente en 2755 mientras meditaba bajo el dosel de un falso roble en los Jardines del Émulo, rodeado por las hojas sueltas de su obra magna inacabada. Su estatua de bronce contempla fijamente a la de Divya en el extremo opuesto del jardín.',
  works: [
    {
      id: 'tejido-cosmos',
      title: 'El Tejido del Cosmos',
      year: 'Hasta 2755 d.C.',
      status: 'inacabada',
      genre: 'Física Cuántica, Filosofía Existencial y Teoría del Alma',
      summary: 'Su obra cumbre y testamentaria. Postula que el alma humana no es un subproducto biológico, sino una fluctuación de un "campo cuántico del alma" universal que entrelaza la consciencia con el cosmos a través de la Fluidez y el Elemnis.',
      keyConcepts: [
        { name: 'La Fluidez', description: 'La lucidez dinámica donde cada pensamiento colapsa una realidad ética de posibilidades cuánticas.' },
        { name: 'Lucidez Térmica', description: 'Expansión de la mente en el frío y el silencio absoluto para suprimir el ruido biológico.' },
        { name: 'El Elemnis', description: 'Fusión en tres fases: Nilem\'Virea (suspensión del juicio), Kosmir\'Lira (entrelazamiento empático universal) y Kreeke\'Vorwa (simultaneidad temporal).' }
      ],
      impact: 'Tratado de culto para los exégetas del Émulo y los filósofos del casco exterior.',
      quote: '“El observador no solo mide la partícula: el alma libre colapsa el destino de la especie en cada latido.”'
    },
    {
      id: 'astrogenitas-terranauticos',
      title: 'Sobre Astrogénitas y Terranáuticos',
      year: '2740 d.C.',
      status: 'completa',
      genre: 'Sociología Cósmica y Metafísica de la Identidad',
      summary: 'Tratado sociológico que analizó la ruptura entre los que recuerdan la Tierra y los que nacieron en el metal. Estableció por vez primera el concepto salvador de Ner\'Val.',
      keyConcepts: [
        { name: 'El Peso del Vacío', description: 'La angustia congénita del ser nacido sin horizonte curvo ni gravedad planetaria.' },
        { name: 'El Mito de la Cuna', description: 'Cómo la memoria terrestre se distorsiona hasta convertirse en religión intolerante.' },
        { name: 'Ner\'Val', description: 'La síntesis vital: honrar el pasado sin permitir que nos devore.' }
      ],
      impact: 'Texto de lectura obligatoria en la Academia del Consejo y en las asambleas secretas de la periferia.',
      quote: '“La estrella que nos llama ya no es la misma que guió a nuestros padres, pero sigue siendo nuestro faro.”'
    },
    {
      id: 'ciclo-armonia',
      title: 'Ciclo de Armonía',
      year: '2712 d.C.',
      status: 'completa',
      genre: 'Ética Comunitaria y Teoría de Sistemas Cerrados',
      summary: 'Escrito en los últimos años de la Época Dorada. Explora cómo una comunidad cerrada de millones de almas puede evitar la entropía moral y el colapso violento mediante la reciprocidad de recursos.',
      keyConcepts: [
        { name: 'Resonancia Colectiva', description: 'La salud psicológica de un individuo repercute instantáneamente en la estabilidad de la cubeta vital circundante.' },
        { name: 'Ecosistema de Propósito', description: 'El trabajo no remunerado con dinero, sino con la conciencia de sostener el arca común.' }
      ],
      impact: 'Fue el manual de cabecera de la líder reformista Galyasta Daar durante sus intentos de pacificación.',
      quote: '“En una nave de metal no hay extraños: el aire que exhalas entrará en el pecho de tu enemigo antes del mediodía.”'
    },
    {
      id: 'dialogos-estrellas',
      title: 'Diálogos con las Estrellas',
      year: '2725 d.C.',
      status: 'completa',
      genre: 'Meditación Poética y Teología Secular',
      summary: 'Escrito justo tras los nueve meses de agonía del Gran Apagón. Una sobrecogedora reflexión sobre el silencio implacable del cosmos ante los gritos de los niños que morían de frío en las cubiertas exteriores.',
      keyConcepts: [
        { name: 'El Silencio Hermético', description: 'El cosmos no tiene odio ni compasión; nos refleja exactamente lo que somos capaces de hacer entre nosotros.' },
        { name: 'La Chispa de Titanio', description: 'La fe no procede del cielo, sino de la obstinación biológica por encender otra vela en la noche infinita.' }
      ],
      impact: 'Se convirtió en el consuelo íntimo de miles de familias de la periferia durante los inviernos de racionamiento.',
      quote: '“Cuando el reactor calló, escuchamos por vez primera el verdadero silencio del espacio; y en él, el crujido de nuestra propia fractura.”'
    },
    {
      id: 'reflexiones-vorlemm',
      title: 'Reflexiones sobre la Luz de Vorlëmm',
      year: '2702 d.C.',
      status: 'completa',
      genre: 'Exégesis Histórica y Doctrinal',
      summary: 'El análisis más profundo y respetado sobre el pensamiento de la Primera Gran Madre. Rescata sus cartas privadas y sus primeros apuntes sobre el Vórtice Vor-Veheli.',
      keyConcepts: [
        { name: 'La Madre de la Semilla', description: 'Vorlëmm como la encarnación viva del deber ético desinteresado.' },
        { name: 'El Hexagrama Sagrado', description: 'La unión indisociable entre el progreso tecnológico y la purificación del ego.' }
      ],
      impact: 'El texto más citado por los letrados del Códice Transversal y los eruditos de la Academia.',
      quote: '“Ella no nos dio un mapa para llegar a las estrellas; nos enseñó a no avergonzar a las estrellas cuando llegáramos.”'
    }
  ]
};

// ============================================================================
// ESPECIAL: EVOLUCIÓN CONSCIENTE (VOR-VEHELI) VS LA CORRUPCIÓN DEL ÉMULO
// ============================================================================

export interface ConsciousEvolutionSpecial {
  title: string;
  vortexSign: string;
  founderVision: {
    author: string;
    pillars: string[];
    description: string;
    quantumParallels: string;
  };
  emuloCorruption: {
    perversionTitle: string;
    description: string;
    deviations: string[];
    justificationOfHava: string;
  };
  ethicalResistance: string;
}

export const EVOLUCION_CONSCIENTE_DATA: ConsciousEvolutionSpecial = {
  title: 'Evolución Consciente // Vor-Veheli: La Doctrina Primordial',
  vortexSign: 'El Hexagrama Sagrado (Intersección de los planos material y espiritual)',
  founderVision: {
    author: 'Vorlëmm Hatz (2626 - 2686 d.C.)',
    pillars: [
      'Indisociabilidad entre el rigor técnico y la compasión ética.',
      'Superación voluntaria de los impulsos depredadores que aniquilaron la Tierra.',
      'El viaje interestelar como crisol espiritual, no simple supervivencia de carne.',
      'La comunidad como un solo organismo consciente en el vacío estéril.'
    ],
    description: 'La Evolución Consciente planteó que el ser humano tiene el deber de modelar activamente su psicología y sus relaciones para trascender el egoísmo destructivo. Vorlëmm enseñaba que colonizar Protozeus con las viejas costumbres de codicia y supremacía de la Tierra equivaldría a expandir un cáncer cósmico. Solo elevando la consciencia al nivel del poder tecnológico seríamos dignos de pisar otro suelo.',
    quantumParallels: 'En los tratados de Thalvus, Vor-Veheli se traduce en la "Fluidez Consciente": cada elección ética que tomamos colapsa un vector probabilístico del cosmos hacia la armonía o hacia la ruina.'
  },
  emuloCorruption: {
    perversionTitle: 'La Degradación Eugenesista de la Casta del Consejo',
    description: 'Tras el Gran Apagón de 2720, el Consejo Administrativo secuestró el término "Evolución Consciente" y lo vació por completo de su contenido espiritual y empático, transformándolo en un darwinismo social brutal.',
    deviations: [
      'Eugenesia Rígida: La evolución ya no es un florecimiento ético, sino un índice de compatibilidad genética selectiva.',
      'Creación de la Casta de "Involutivos": Aquellos colonos sometidos a radiación o frío en la periferia son etiquetados como genéticamente degenerados.',
      'Monopolio de la Perfección: Solo la élite del Émulo se arroga el derecho a representar a la especie en Protozeus.',
      'Reducción de la Vida a Kilovatios: Todo individuo que no rinda una plusvalía termodinámica es considerado un estorbo biológico.'
    ],
    justificationOfHava: 'Bajo esta lectura corrupta de Vor-Veheli, el plan HAVA de exterminio masivo en la periferia es cínicamente presentado por Vireus como "el mayor acto de evolución consciente": podar las ramas secas para que la flor de la élite alcance el nuevo sol.'
  },
  ethicalResistance: 'A pesar del monopolio ideológico del Émulo, la verdadera llama de Vor-Veheli sobrevive en las profundidades: los Jardineros de Pwaoo y Kiwori en la C233 la practican cuidando a los huérfanos sin pedir nada a cambio, y la fraternidad de Mephesgeister en los hielos polares demuestra que el amor al prójimo es el único blindaje indestructible.'
};

// ============================================================================
// ESPECIAL: LAS DOS MADRES (VORLËMM HATZ VS DIVYA MAGNA)
// ============================================================================

export interface TwoMothersSpecial {
  title: string;
  subtitle: string;
  vorlemm: {
    name: string;
    archetype: string;
    period: string;
    motto: string;
    principles: string[];
    socialModel: string;
    physicalDeath: string;
    spiritualLegacy: string;
  };
  divya: {
    name: string;
    archetype: string;
    period: string;
    motto: string;
    principles: string[];
    socialModel: string;
    blackoutDecision: string;
    spiritualLegacy: string;
  };
  theBronzeStatuesContrast: string;
}

export const DOS_MADRES_DATA: TwoMothersSpecial = {
  title: 'Las Dos Madres de la Travesía',
  subtitle: 'Vorlëmm Hatz (La Luz de la Utopía) frente a Divya Magna (La Espada de la Fractura)',
  vorlemm: {
    name: 'Vorlëmm Hatz',
    archetype: 'La Madre de la Esperanza Universal',
    period: '2672 - 2686 d.C.',
    motto: '“Todos cruzamos el umbral o nadie lo cruzará.”',
    principles: [
      'Solidaridad irrestricta entre todas las 320 cubiertas.',
      'Eliminación de castas, linajes y privilegios monetarios.',
      'El viaje como elevación espiritual y comunal.',
      'Confianza absoluta en la nobleza intrínseca humana.'
    ],
    socialModel: 'Comunitarismo igualitario con créditos basados en la aportación real al bienestar del prójimo.',
    physicalDeath: 'Murió rodeada del cariño unánime de los doce millones de viajeros; su cuerpo regresó a la tierra hidropónica.',
    spiritualLegacy: 'Reverenciada como una santa laica; su recuerdo es el espejo acusador donde se mira la vergüenza del Consejo.'
  },
  divya: {
    name: 'Divya Magna',
    archetype: 'La Madre del Sacrificio Selectivo',
    period: '2686 - 2732 d.C.',
    motto: '“Para que la antorcha no muera, hay que dejar que la noche devore a los débiles.”',
    principles: [
      'Prioridad implacable a la preservación del conocimiento y los líderes técnicos.',
      'Aceptación del dolor y la desigualdad como leyes de supervivencia física.',
      'Creación del santuario blindado del Émulo.',
      'Pragmatismo científico despojado de consideraciones sentimentales.'
    ],
    socialModel: 'Estratificación vertical estricta: un centro protegido y opulento sostenido por el sacrificio de la periferia.',
    blackoutDecision: 'Ante el fallo del reactor en 2720, ordenó cerrar las compuertas de la cúpula, condenando a millones al frío para salvar a 150.000.',
    spiritualLegacy: 'Salvadora matemática para la oligarquía del Consejo; traidora maldita y madre del desamparo para el 90% de la población.'
  },
  theBronzeStatuesContrast: 'En los Jardines del Émulo, las dos estatuas colosales de bronce se miran a 500 metros de distancia: Vorlëmm tiene las manos abiertas en gesto de acogida infinita; Divya tiene las manos entrelazadas sobre su pecho sosteniendo las llaves del domo hermético. Representan las dos almas irresolubles de la Estación Humanidad.'
};

// ============================================================================
// ESPECIAL: LA ÉPOCA DORADA (2672 - 2720 D.C.)
// ============================================================================

export interface GoldenEraSpecial {
  title: string;
  period: string;
  durationYears: number;
  description: string;
  energyStatus: string;
  socialHarmony: string;
  culturalSpring: string;
  milestones: string[];
  tragicIrony: string;
}

export const EPOCA_DORADA_DATA: GoldenEraSpecial = {
  title: 'La Época Dorada // Los Cuarenta y Ocho Años de Inocencia',
  period: '2672 - 2720 d.C.',
  durationYears: 48,
  description: 'Los primeros 48 años de la expedición constituyeron la mayor proeza civilizatoria en la historia humana: una sociedad sin dinero, sin guerras de clases y con un reactor de fusión que entregaba el 100% de su rendimiento nominal, iluminando cálidamente las 320 cubiertas de la Estación.',
  energyStatus: 'Potencia Plena (100% nominal / 2.4 gigavatios continuos por sector). Climatización constante a 21°C en toda la estructura.',
  socialHarmony: 'Sin mamparos blindados ni guetos. Los ascensores de los cuatro cuadrantes operaban sin restricciones; científicos, obreros y artistas compartían comedores comunales y cubiertas de recreo.',
  culturalSpring: 'Florecimiento del idioma Transversal como dialecto formal de la ciencia y el arte; creación de los murales botánicos del Parque Central y erradicación total de enfermedades terrestres gracias a vacunas universales.',
  milestones: [
    '2672: Despegue triunfal desde Manicore y ajuste perfecto de la órbita de eyección solar.',
    '2679: Asistencia gravitacional de Alpha Centauri A sin una sola pérdida humana.',
    '2690: Nacimiento de Joren Thalvus, el primer gran filósofo nacido en el espacio.',
    '2705: Celebración del Festival de la Luz Estelar conmemorando el primer tercio del viaje.',
    '2712: Publicación del "Ciclo de Armonía", cúspide de la teoría sociológica comunitaria.'
  ],
  tragicIrony: 'Aquellos que nacieron durante la Época Dorada creyeron que el paraíso era eterno. Cuando el reactor colapsó en 2720, el abismo entre la gloria vivida y la miseria posterior enloqueció a toda una generación.'
};

// ============================================================================
// ESPECIAL: EL GRAN APAGÓN DEL AÑO 72.4 (2720 D.C.)
// ============================================================================

export interface BlackoutSpecial {
  title: string;
  year: string;
  durationMonths: number;
  triggerEvent: string;
  monthlyChronicle: {
    monthRange: string;
    phaseTitle: string;
    temperature: string;
    events: string[];
    humanImpact: string;
  }[];
  aftermathAndConsequences: string[];
}

export const GRAN_APAGON_DATA: BlackoutSpecial = {
  title: 'El Gran Apagón del Año 72.4 // Nueve Meses de Agonía y Fractura',
  year: '2720 d.C. (Año 72.4 de la Colonización)',
  durationMonths: 9,
  triggerEvent: 'Microfractura por fatiga de materiales en el blindaje magnético del Reactor Primario de Fusión, desatando una reacción exotérmica en cascada que forzó el apagado automático de emergencia.',
  monthlyChronicle: [
    {
      monthRange: 'Mes 1',
      phaseTitle: 'El Silencio Inmediato y la Oscuridad Total',
      temperature: 'De 21°C a 12°C en 48 horas',
      events: [
        'Caída instantánea de la red eléctrica primaria en las 320 cubiertas.',
        'Detención de los motores de propulsión inercial.',
        'La nave entra en silencio absoluto por primera vez en 48 años.'
      ],
      humanImpact: 'Pánico ciego. Multitudes desorientadas intentando acceder a los generadores auxiliares en medio de la negrura absoluta.'
    },
    {
      monthRange: 'Mes 2',
      phaseTitle: 'La Intrusión del Frío Cósmico',
      temperature: 'De 12°C a -18°C en cubiertas exteriores',
      events: [
        'Agotamiento de la inercia térmica de los cascos de titanio.',
        'Congelación súbita de las tuberías de fluidos secundarios en las cubiertas 200 a 320.',
        'Fallo de los sistemas de aire forzado: acumulación letal de dióxido de carbono en corredores cerrados.'
      ],
      humanImpact: 'Los habitantes queman muebles y ropas para calentar a sus hijos; primeras muertes masivas por asfixia e hipotermia.'
    },
    {
      monthRange: 'Mes 3',
      phaseTitle: 'El Colapso Hidropónico y la Hambruna',
      temperature: '-25°C en periferia / 8°C en núcleos centrales',
      events: [
        'Pudrición masiva de los cultivos hidropónicos automatizados por falta de bombas y luz fotosintética.',
        'Muerte de las colonias de insectos polinizadores y peces en los tanques biológicos.',
        'Saqueos violentos a los depósitos de reserva de pasta calórica concentrada.'
      ],
      humanImpact: 'Racionamiento forzado a menos de 700 calorías diarias; canibalismo aislado en los sectores más descolgados.'
    },
    {
      monthRange: 'Mes 4',
      phaseTitle: 'La Peste Blanca Neumónica',
      temperature: '-30°C en periferia',
      events: [
        'Al cesar el filtrado ultravioleta de la atmósfera interna, mutan colonias bacterianas anaerobias.',
        'Brote epidémico de neumonía hemorrágica en las cubiertas medias e inferiores.',
        'Saturación y abandono de los puestos médicos por falta de energía para esterilizadores.'
      ],
      humanImpact: 'Decenas de miles de colonos mueren asfixiados en sus camastros congelados sin posibilidad de auxilio médico.'
    },
    {
      monthRange: 'Mes 5',
      phaseTitle: 'El Edicto del Arca Interna',
      temperature: '18°C en el Émulo / -35°C en periferia',
      events: [
        'Divya Magna declara que la nave entera no puede salvarse con los generadores auxiliares.',
        'Aprobación secreta del Decreto de Supervivencia Esencial.',
        'Traslado militar de 150.000 técnicos, científicos, biólogos y altos funcionarios hacia el domo del Parque Central.'
      ],
      humanImpact: 'Separación forzosa de familias en los accesos de la C160; los guardias disparan contra las masas desesperadas.'
    },
    {
      monthRange: 'Mes 6',
      phaseTitle: 'El Sellado de Titanio del Émulo',
      temperature: '21°C artificial en el Domo / -40°C en el exterior',
      events: [
        'Cierre hermético de las 14 compuertas de blindaje hiperdenso que comunican el Émulo con el resto de la nave.',
        'Desvío de todo el combustible de reserva exclusivamente para mantener la biosfera holográfica del domo.',
        'Desconexión total de las líneas eléctricas que alimentaban las cubiertas 80 a 320.'
      ],
      humanImpact: 'Nace la Periferia como una masa desahuciada. La desolación y el sentimiento de traición cósmica se graban para siempre.'
    },
    {
      monthRange: 'Mes 7',
      phaseTitle: 'La Selva de Acero y Clanes de Fuego',
      temperature: '-45°C en cubiertas polares',
      events: [
        'Los sectores exteriores se fragmentan en clanes territoriales y bandas armadas con herramientas.',
        'Surgimiento del mercado negro de calor, robo de cables conductores y canje de sangre por aire filtrado.',
        'Aparición de las primeras liturgias del Vórtice Amtti (resistencia en el sufrimiento extremo).'
      ],
      humanImpact: 'La civilización humana en la periferia se despoja de toda cortesía y retrocede a una lucha tribal elemental.'
    },
    {
      monthRange: 'Mes 8',
      phaseTitle: 'La Incursión al Núcleo Radiactivo',
      temperature: 'Zona del Reactor: +85°C con radiación letal',
      events: [
        'Brigadas de voluntarios forzados de las cubiertas medias se introducen en las cámaras de refrigeración destrozadas.',
        'Sustitución manual del blindaje magnético quemado en turnos suicidas de 10 minutos.',
        'Cientos de obreros absorben dosis mortales de neutrones para reconectar los bucles de materia oscura.'
      ],
      humanImpact: 'Sacrificio supremo de los obreros que salvaron físicamente a la nave sin recibir jamás honores ni acceso al Émulo.'
    },
    {
      monthRange: 'Mes 9',
      phaseTitle: 'El Renacer Mutilado y el Nuevo Orden',
      temperature: 'Estabilización precaria: 20°C en Émulo / 5°C a -20°C en periferia',
      events: [
        'El Reactor vuelve a latir, pero su núcleo está irremediablemente fundido: solo genera el 42% de su capacidad original.',
        'Divya Magna declara el fin de la emergencia, pero decreta el Racionamiento Permanente.',
        'Las compuertas del Émulo jamás vuelven a abrirse de par en par.'
      ],
      humanImpact: 'La humanidad sobrevive, pero el pacto fraternal ha muerto. Se formaliza el sistema de castas que dominará los siglos venideros.'
    }
  ],
  aftermathAndConsequences: [
    'Pérdida de más de 380.000 vidas durante los 9 meses de colapso.',
    'Mutilación permanente del reactor al 42% de su potencia nominal de diseño.',
    'Consagración de la división física entre la élite del Émulo y los condenados de la periferia.',
    'Nacimiento de la justificación ideológica de que "algunos deben sacrificarse para que la misión triunfe", raíz directa del plan HAVA.'
  ]
};

