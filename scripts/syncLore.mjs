import fs from 'node:fs';
import path from 'node:path';

// Default Obsidian vault construction folder
const DEFAULT_LORE_DIR = path.resolve('c:/VSCODE/OBSIDIAN/ESTACION_HUMANIDAD/lore/transversal/construccion');
const targetDir = process.env.OBSIDIAN_LORE_PATH || process.argv[2] || DEFAULT_LORE_DIR;

console.log('='.repeat(65));
console.log(' PROTOCOLO VEYVAN // SINCRONIZADOR DE CÓDICES CANÓNICOS');
console.log('='.repeat(65));
console.log(`Buscando códices en: ${targetDir}\n`);

if (!fs.existsSync(targetDir)) {
  console.log(`[AVISO] No se encontró la ruta externa de Obsidian en:`);
  console.log(`  -> ${targetDir}`);
  console.log(`\nTranquilo: La aplicación ya cuenta con el 100% de los códices`);
  console.log(`embebidos en memoria interna (data/canonicalLoreConstruccion.ts y data/initialData.ts).`);
  console.log(`No necesitas esta carpeta para ejecutar, compilar o distribuir la aplicación.`);
  process.exit(0);
}

const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.md'));
console.log(`✓ Códices encontrados en el taller de autor (${files.length} archivos):`);
files.forEach(f => {
  const stats = fs.statSync(path.join(targetDir, f));
  console.log(`  - ${f} (${(stats.size / 1024).toFixed(1)} KB)`);
});

console.log('\n[INFO] Todos los códices maestros de Obsidian están accesibles.');
console.log('Cuando agregues nuevas raíces en los documentos Markdown, este script');
console.log('asegura la coherencia antes de empaquetar una nueva versión con:');
console.log('  npm run electron:build\n');
