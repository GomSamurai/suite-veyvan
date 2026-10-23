import React from 'react';
import { BookOpen, Binary, Compass, Moon, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

export const ChronoCodex: React.FC = () => {
  const binaryTable = [
    { name: 'Vira', sym: 'Vi', pow: '2⁰', comp: 'Unidad Base', earth: '~0.659 seg', use: 'Micro-medición, sincronización de computación cuántica y tiempo de reacción.' },
    { name: 'Fula', sym: 'Fu', pow: '2⁶ (64 Vi)', comp: '64 Viras', earth: '~42.19 seg', use: 'Intervalos breves, el "minuto" coloquial de cubierta, pausas breves de filtrado.' },
    { name: 'Kroma', sym: 'Kr', pow: '2¹¹ (2,048 Vi)', comp: '32 Fulas', earth: '~22.50 min', use: 'Unidad estándar de actividad breve, duración de una comida rápida o reunión técnica.' },
    { name: 'Sema', sym: 'Se', pow: '2¹⁵ (32,768 Vi)', comp: '16 Kromas', earth: '~6.00 horas', use: 'Cuarto de día. Base estricta para turnos laborales y fases de iluminación.' },
    { name: 'Tala', sym: 'Ta', pow: '2¹⁸ (262,144 Vi)', comp: '8 Semas', earth: '~48.00 horas (2 días)', use: 'El "Doble Día". Ciclo biológico y operativo estándar de la Estación.' },
    { name: 'Nema', sym: 'Ne', pow: '2²² (4,194,304 Vi)', comp: '16 Talas', earth: '~32.00 días', use: 'El "Mes" de la estación. Unidad de censo, pago de raciones y cómputo de edad.' },
    { name: 'Kora', sym: 'Ko', pow: '2²⁷ (134,217,728 Vi)', comp: '32 Nemas', earth: '~2.80 años (1,024 d)', use: 'Ciclo de vida intermedio. Planificación de reservas agrícolas e hidropónicas.' },
    { name: 'Era', sym: 'E', pow: '2³³ (8,589,934,592 Vi)', comp: '64 Koras', earth: '~179.4 años (65,536 d)', use: 'Medición histórica y generacional. Épocas de liderazgo de la nave.' }
  ];

  return (
    <div className="space-y-6">
      {/* Intro Hero */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/20 box-glow-cyan relative overflow-hidden">
        <div className="hud-corner absolute inset-0 pointer-events-none" />

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-neutral-100 tracking-wide uppercase">
              Códice del Cronosistema
            </h2>
            <p className="text-xs sm:text-sm font-mono text-cyan-400/90">
              Tiempo, Mecánica y Existencia en Estación Humanidad · NTU-01
            </p>
          </div>
        </div>

        <p className="text-neutral-300 text-sm leading-relaxed max-w-4xl">
          El <strong>Cronosistema</strong> es el sistema unificado de sincronización temporal concebido durante la Travesía Interestelar. Tras el abandono de la Tierra y la pérdida de la rotación planetaria y los ciclos solares, la Estación Humanidad adoptó una <strong>base matemática binaria (potencias de 2)</strong> para su gestión técnica y computacional, conviviendo con una <strong>base duodecimal (base 12)</strong> para la interpretación espiritual y cultural en dialecto Transversal.
        </p>
      </div>

      {/* Binary Hierarchy Table */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Binary className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-mono font-bold text-neutral-200 uppercase tracking-wider">
              I. Estructura Técnica Canónica (Base Binaria)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">
            Precisión Vira: 0.6591796875 segundos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-neutral-900/80 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-3 px-3">Unidad</th>
                <th className="py-3 px-2 text-center">Símbolo</th>
                <th className="py-3 px-3">Potencia 2</th>
                <th className="py-3 px-3">Composición</th>
                <th className="py-3 px-3">Equivalencia Terrestre</th>
                <th className="py-3 px-3">Uso Principal en Cubierta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {binaryTable.map((row) => (
                <tr key={row.name} className="hover:bg-neutral-900/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-cyan-300">
                    {row.name}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <code className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-200 border border-neutral-800 font-bold">
                      {row.sym}
                    </code>
                  </td>
                  <td className="py-3 px-3 text-amber-400/90 font-medium">
                    {row.pow}
                  </td>
                  <td className="py-3 px-3 text-neutral-300">
                    {row.comp}
                  </td>
                  <td className="py-3 px-3 text-emerald-400">
                    {row.earth}
                  </td>
                  <td className="py-3 px-3 text-neutral-400 text-[11px] leading-relaxed">
                    {row.use}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cultural Duality: Binary vs Dozenal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* The Binary Machine */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <h3 className="font-semibold text-base text-neutral-100">
                1. El Tiempo Binario (La Estructura)
              </h3>
            </div>
            <p className="text-xs font-mono text-cyan-400/90 mb-3">
              El tiempo del "¿Cómo?" · Rige la supervivencia física
            </p>
            <p className="text-xs text-neutral-300 leading-relaxed space-y-2">
              Es el tiempo que respiran los reactores de fusión, las compuertas neumáticas, los horarios de producción en las cubiertas medias y los protocolos de los Protectores. Es rígido, implacable, binario y matemáticamente perfecto.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs font-mono text-neutral-400">
              <span className="text-neutral-200 font-bold">Ejemplo cotidiano:</span> "El turno de guardia termina en 2 Kromas. Verifiquen las válvulas de plasma antes del Sema 6."
            </div>
          </div>
        </div>

        {/* The Dozenal Spirit */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold text-base text-neutral-100">
                2. El Tiempo Dozenal (El Significado)
              </h3>
            </div>
            <p className="text-xs font-mono text-amber-400/90 mb-3">
              El tiempo del "¿Por qué?" · Rige la conciencia espiritual
            </p>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Heredado de la geometría sagrada y la filosofía de la <strong>Evolución Consciente</strong> de Amtti. Utilizado en los poemas, caligramas Tael'im y ciclos de maduración personal.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                <strong className="text-amber-400">U</strong>: Unidad e Inicio
              </div>
              <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                <strong className="text-amber-400">Da</strong>: Dualidad y Tensión
              </div>
              <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                <strong className="text-amber-400">Tri</strong>: Equilibrio y Armonía
              </div>
              <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                <strong className="text-amber-400">Zou</strong>: Ciclo Completo (12)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Mystery of Kroma 8 and The Tala Adaptation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kroma 8 Lore */}
        <div className="glass-panel p-6 rounded-2xl border border-red-500/20 box-glow-kroma8">
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h3 className="font-semibold text-base text-red-200">
              El Fantasma de "Kroma 8" (Sema 6)
            </h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed mb-3">
            Justo en el meridiano del Sema 6, en <strong>Kroma 8 (T-33:00)</strong>, los sistemas de soporte vital detienen las turbinas de ventilación durante exactamente <strong>1 Fula (42.2 segundos)</strong> para recalibrar los filtros atmosféricos de cubierta.
          </p>
          <p className="text-xs text-neutral-400 leading-relaxed">
            En ese instante de silencio absoluto, los habitantes dicen que es el único momento en que se escuchan los crujidos del casco exterior enfrentándose al vacío estelar. Es una hora envuelta en supersticiones, delitos encubiertos y plegarias silenciosas.
          </p>
        </div>

        {/* Why 48 Hours */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h3 className="font-semibold text-base text-neutral-100">
              ¿Por qué un Ciclo Tala de 48 Horas?
            </h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed mb-3">
            Tras el fallo del reactor en el <strong>Año 72.4</strong>, las reservas térmicas y de energía quedaron drásticamente mermadas. Reducir los encendidos y apagados térmicos a ciclos de 48 horas en lugar de 24 horas ahorraba un 38% del consumo de los núcleos.
          </p>
          <p className="text-xs text-neutral-400 leading-relaxed">
            La biología humana fue forzada a adaptarse mediante estimulantes (<em>Sint</em> y <em>Vigil</em>) y selección generacional: 30 a 32 horas de vigilia activa seguidas de 14 a 16 horas de letargo profundo.
          </p>
        </div>
      </div>
    </div>
  );
};
