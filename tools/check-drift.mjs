#!/usr/bin/env node
/**
 * check-drift.mjs — detecta divergência entre os arquivos-fonte e os bundles servidos.
 *
 * Contexto: o projeto não tem passo de build. O `index.html` carrega `css/bundle.css`
 * e `js/animations.bundle.js`; as subpáginas carregam os parciais de `css/` direto.
 * Editar um lado e esquecer o outro é silencioso e já aconteceu.
 *
 * Uso:  node tools/check-drift.mjs
 * Sai com código 1 se houver divergência (serve em pre-commit / CI).
 */
import { readFileSync, existsSync } from 'fs';

const CSS_PARCIAIS = [
  'css/reset.css', 'css/variables.css', 'css/typography.css', 'css/layout.css',
  'css/animations.css', 'css/components/navbar.css', 'css/components/hero.css', 'css/components/diferenciais.css',
  'css/components/sobre.css', 'css/components/produtos.css', 'css/components/social-proof.css',
  'css/components/depoimentos.css', 'css/components/subpages.css',
  'css/components/financiamento.css', 'css/components/localizacao.css',
  'css/components/footer.css', 'css/components/cta-interstitial.css', 'css/mobile.css',
];

const ler = (f) => (existsSync(f) ? readFileSync(f, 'utf8') : '');
const seletores = (s) =>
  new Set([...s.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([.#][A-Za-z][\w-]*)\s*[,{]/g)].map((m) => m[1]));

let falhou = false;

// ── CSS ──
const concat = CSS_PARCIAIS.map(ler).join('\n');
const bundle = ler('css/bundle.css');
const sb = seletores(bundle);
const sc = seletores(concat);
const soBundle = [...sb].filter((x) => !sc.has(x));
const soParcial = [...sc].filter((x) => !sb.has(x));

console.log('── CSS ──');
console.log(`  bundle.css: ${Math.round(bundle.length / 1024)} KB | parciais: ${Math.round(concat.length / 1024)} KB`);
if (soBundle.length) {
  falhou = true;
  console.log(`  ⚠ ${soBundle.length} seletor(es) SÓ no bundle (faltam nos parciais):`);
  console.log('    ' + soBundle.join(' '));
}
if (soParcial.length) {
  falhou = true;
  console.log(`  ⚠ ${soParcial.length} seletor(es) SÓ nos parciais (faltam no bundle):`);
  console.log('    ' + soParcial.join(' '));
}
if (!soBundle.length && !soParcial.length) console.log('  ✓ sem divergência de seletores');

// ── JS ──
const jsBundle = ler('js/animations.bundle.js');
const exportados = (s) => new Set([...s.matchAll(/export function (\w+)/g)].map((m) => m[1]));
const eb = exportados(jsBundle);
const modulos = [...jsBundle.matchAll(/\/\/ — animations\/([\w-]+\.js) —/g)].map((m) => 'js/animations/' + m[1]);

console.log('\n── JS ──');
const faltando = [];
for (const f of modulos) {
  if (!existsSync(f)) { faltando.push(`${f} (no bundle, ausente em disco)`); continue; }
  const fonte = ler(f);
  for (const fn of exportados(fonte)) if (!eb.has(fn)) faltando.push(`${fn}() em ${f} não está no bundle`);
  // heurística: corpo bem diferente indica edição em só um lado
  const norm = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*/g, '').replace(/\s+/g, '');
  const corpo = norm(fonte);
  const trecho = corpo.slice(40, 240);
  if (trecho && !norm(jsBundle).includes(trecho)) faltando.push(`${f} divergiu do bundle`);
}
if (faltando.length) { falhou = true; faltando.forEach((x) => console.log('  ⚠ ' + x)); }
else console.log(`  ✓ ${modulos.length} módulo(s) conferem com o bundle`);

console.log(falhou ? '\n✗ DIVERGÊNCIA — reconcilie antes de publicar.' : '\n✓ fonte e bundles em sincronia.');
process.exit(falhou ? 1 : 0);
