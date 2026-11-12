# CHANGELOG — Machado Plataformas

> Registro obrigatório de todas as alterações do projeto.
> Formato: `[AAAA-MM-DD] Tipo — Descrição breve` seguido de detalhes.
> Tipos: `FEAT` (novo recurso), `FIX` (correção), `STYLE` (visual/CSS), `REFACTOR`, `CHORE` (estrutura/config), `CONTENT` (textos/imagens).

## [2026-11-11] CHORE — bundle.css e parciais reconciliados

**Agente:** Claude Code

Comparação regra a regra (`@media` + seletor + declarações) mostrava 19 regras só no bundle, 17 só nos parciais e 57 com valores diferentes. Hoje `check-drift` passa e a comparação semântica dá zero.

### Sem efeito visual (estilos computados idênticos nas 5 páginas, 1440 e 390)
- `hero.css`, `diferenciais.css`, `produtos.css`, `animations.css` (cursor) — só a home usa: parcial ← bundle. `diferenciais.css` estava com regras de `@media` "achatadas" para fora das queries.
- `mobile.css` — bloco "HERO MOBILE" do fim do bundle copiado para o fim do parcial; removida regra de `.hero-subtitle` que só existia no parcial.
- `financiamento.css` — só credito.html usa: bundle ← parcial (sai a cópia parcial do fim do bundle e o `.financiamento-panel`, que nenhuma página usa).
- `localizacao.css` (popup do mapa, só sobre.html): bundle ← parcial.

### Com efeito visual nas subpáginas (aprovado: versão da home vale nas 5)
- `footer.css` ← footer da home (sobre, produtos, clientes, credito).
- `mobile.css` — cards do menu passam a sumir abaixo de 480px, como na home.
- `layout.css` — `.btn--split--sm` 0.68rem → 0.72rem (produtos.html).
- `mobile.css` + bundle — removidas as regras de footer em `@media (max-width: 767px)` que `footer.css` redefine: no bundle elas já perdiam (footer.css vem depois), nas subpáginas venciam e o footer mobile ficava diferente. Home inalterada.

---

## [2026-11-11] FIX — Seção "Feito aqui." quebrada com prefers-reduced-motion

**Agente:** Claude Code

### Alterado
- `css/components/sobre.css` + `css/bundle.css` — bloco `@media (prefers-reduced-motion: reduce)` aplicava `width/height: 14px` e `opacity: 0.4` (regra pensada para os cantinhos decorativos) também no card `.sobre-kpi--hero`, que encolhia para 48×48 e o "22+" vazava sobre o parágrafo. Agora o alvo é o `::before` (faixa pulsante), e só a animação é desligada.
- Mesmo bloco: `.sobre-kicker__rule` ficava invisível (`scaleX(0)` sem animação) → `transform: none`; anel do play `.sobre-yt__play::after` encolhia de 96px para 14px → mantém tamanho base, opacidade de repouso 0.5.
- Visual com movimento normal inalterado.

---

## [2026-05-25] CHORE — Conversão de imagens para WebP + resize

**Agente:** Claude Code
**Sessão:** Otimização de imagens para entrega do site

### Criado
- `convert-images.js` — script Node.js/sharp que converte e redimensiona 19 imagens para WebP
- `assets/images/hero/plataforma-hero.webp` — 900×1200, lossless (1418KB → 779KB, −45%)
- `assets/images/produtos/LEVE.webp` — 900×1350, lossless (1666KB → 282KB, −83%)
- `assets/images/produtos/MEDIA.webp` — 900×1350, lossless (770KB → 388KB, −50%)
- `assets/images/produtos/pesada.webp` — 900×1350, lossless (1680KB → 282KB, −83%)
- `assets/images/galeria/foto-01.webp` a `foto-10.webp` — 800×1067 / 800×800, q82
- `assets/images/galeria/foto-03-nav.webp` — 400×533, versão reduzida para navbar card
- `assets/images/sobre/fabrica-01.webp` a `fabrica-04.webp` — 800–1200px, q85

### Alterado
- `index.html` — todos os `src` de imagem atualizados para apontar aos novos `.webp` e `width`/`height` corrigidos

---

## [2026-05-25] STYLE — Loading screen redesenhada — clean reveal + curtain exit

**Agente:** Claude Code
**Sessão:** Critique pós-análise — melhorias de UX

### Alterado
- `index.html` — loader simplificado: 4 quadrados + label "Loading" substituídos por logo.svg centralizada
- `css/animations.css` — loader redesenhado: fundo #0F1823 (navy escuro), `.loader__logo` com estado inicial hidden; removidas classes `.loader__inner`, `.loader__squares`, `.loader__square`, `.loader__label`
- `js/loader.js` — animação reescrita: logo sobe suavemente (0.55s), segura (0.65s) e a tela sobe como cortina (0.65s); `resolve()` dispara no início da saída para o hero começar a aparecer sob a cortina; total ~1.85s (era ~2.65s)

---

## [2026-05-25] FIX — Correções de UX/design pós-critique (tipografia, links, acessibilidade)

**Agente:** Claude Code
**Sessão:** Critique pós-análise — aplicação de melhorias aprovadas

### Alterado
- `produtos.html` — typo "MEDIA" → "MÉDIA" na seção Arsenal Linha Média (h2.arsenal__name)
- `produtos.html` — navbar CTA: substituído `<span>+</span>` pelo SVG de WhatsApp idêntico ao index.html
- `produtos.html` — contraste `.arsenal__tagline`: `rgba(255,255,255,0.38)` → `rgba(255,255,255,0.60)` (pass WCAG AA 4.5:1)
- `produtos.html` — contraste `.arsenal__spec__label`: `rgba(255,255,255,0.28)` → `rgba(255,255,255,0.50)`
- `index.html` — todos os `href="#"` nos botões "Ver linha completa" → `./produtos.html` (4 botões: produtos-line-cta, produto-leve, produto-media, produto-pesada)
- `index.html` — footer tagline genérica substituída por copy com voz de marca
- `produtos.html` — footer tagline genérica substituída por copy com voz de marca
- `credito.html` — footer tagline genérica substituída por copy com voz de marca
- `sobre.html` — footer tagline genérica substituída por copy com voz de marca
- `clientes.html` — footer tagline genérica substituída por copy com voz de marca
- `css/components/sobre.css` — contraste `.sobre-kpi__unit`: `rgba(255,255,255,0.35)` → `rgba(255,255,255,0.55)`

### Criado
- `credito.html` — adicionado `og:image` meta tag (ausente)
- `sobre.html` — adicionado `og:image` meta tag (ausente)
- `clientes.html` — adicionado `og:image` meta tag (ausente)

---

## [2026-05-24] FIX — Auditoria de responsividade e espaçamento — site inteiro

**Agente:** Claude Code
**Sessão:** `/impeccable audit` + `/impeccable layout site inteiro` — correções P1/P2/P3

### Alterado
- `css/components/subpages.css`
  - `.page-hero__title-line`: `overflow: hidden` → `overflow: clip` com `padding-bottom: 0.1em` e `margin-bottom: -0.1em` — previne clipping da animação de rise com `line-height: 0.9` (afeta clientes.html, sobre.html)
  - Adicionado `@media (max-width: 480px) { .page-cta__title }` com `font-size: clamp(1.75rem, 8vw, 2.25rem)` e `letter-spacing: 0.02em` — título de CTA não extravasa em 360–430px (afeta todas as subpages)
- `css/components/produtos.css`
  - `.produtos-left` (desktop `min-width: 1024px`): `padding-left: 160px` → `clamp(var(--space-10), 12vw, 160px)` — padding responsivo; em 1024px libera ~37px de espaço; ≥1366px preserva 160px original
- `css/components/financiamento.css`
  - `.financiamento-layout` (768px): `minmax(320px, 0.72fr)` → `minmax(280px, 0.72fr)` — painel de imagem não excede a coluna de conteúdo em tablets estreitos
- `sobre.html`
  - `#sobre-map`: removido `style="width:100%;height:360px;"` inline — o CSS scoped `height: clamp(280px, 40vw, 440px)` já existe e é responsivo; o inline sobrescrevia o clamp
- `produtos.html` (bloco `<style>` inline)
  - `.arsenal--pesada { margin-top: 20px }` → `margin-top: var(--space-5)` — token padronizado
  - `.arsenal__spec__val`: adicionado `white-space: nowrap; overflow: hidden; text-overflow: ellipsis` — valores de spec não quebram linha em 360px
  - `.opc-card__body { padding: 2.5rem }` → `clamp(1.25rem, 4vw, 2.5rem)` — padding responsivo dos cards de opcionais
  - Adicionado `@media (max-width: 1024px)` revertendo alinhamento direito do `.arsenal--alt` (Linha Média) para `flex-start` no mobile/tablet
  - `.arsenal--alt { padding-block: var(--space-8) }` no mesmo breakpoint — espaçamento vertical suavizado na transição
- `clientes.html` (bloco `<style>` inline)
  - `.em-acao-swiper-wrap` e `.entregas-gallery-wrap`: `margin-inline: calc(-1 * var(--space-6))` → `calc(-1 * var(--container-padding))` — elimina overflow horizontal de 4px em 360–430px (onde `--container-padding` < `--space-6`)
  - Adicionados dois blocos `@media (max-height: 600px) and (orientation: landscape)` com `height: 280px` para slides dos swipers Em Ação e Entregas — evita slides demasiado altos em landscape mobile
  - `.entregas__subtitle`: adicionado `@media (max-width: 767px) { text-align: left; max-width: none }` — subtítulo alinhado à esquerda em mobile, consistente com demais seções
  - `.entregas-kpi__val`: `font-size: clamp(2.5rem, 5vw, 4rem)` → `clamp(2rem, 5vw, 4rem)` — valores KPI não transbordam no grid 2 colunas em 360px

### Breakpoints validados
360px, 390px, 430px, 480px, 768px, 1024px, 1366px, 1440px

---

## [2026-05-24] STYLE — credito.html — variante light industrial (polimento visual)

**Agente:** Claude Code
**Sessão:** Polimento visual — paleta light para Linha de Crédito

### Alterado
- `credito.html` — adicionado bloco `<style>` inline (scoped à página) com light industrial theme: fundo off-white `#F7F8FA`, seção/CTA em cinza claro `#ECEEF2`, cards em branco `#FFFFFF` com bordas sutis, textos em grafite `#1A1F2A` e cinza médio `#596475`, azul `#1B4D84` preservado apenas como acento (ícones, tags, CTAs, bordas de hover). Grid texture removida do `.financiamento::before`. Painel de foto mantido escuro como âncora de contraste intencional.

---

## [2026-05-24] FEAT — Redesign credito.html — hierarquia de peso nas opções de pagamento

**Agente:** Claude Code
**Sessão:** Redesign Linha de Crédito — hierarquia featured/standard

### Alterado
- `credito.html` — substituído `financiamento-grid` de 6 cards iguais por estrutura em dois tiers: featured (BNDES + Financiamento com cards editoriais grandes, ícone de instituição, copy segura) e standard (Entrada/Parcelamento/PIX/Cartão compactos em linha)
- `css/components/financiamento.css` — `.financiamento-grid` convertido de CSS grid para flex column; removidas regras de grid nas MQs; adicionadas classes `.financiamento-featured`, `.financiamento-card` (e variantes), `.financiamento-tier-sep`, `.financiamento-standard` com breakpoints 768px e 1024px; responsividade corrigida para desktop (4 cols standard), tablet (2+2), mobile (1 col)

---

## [2026-05-24] FIX — 3 problemas mobile identificados em screenshots (390×844)

**Agente:** Claude Code
**Sessão:** Mobile layout fixes — hero, produtos, depoimentos

### Alterado
- `css/mobile.css`
  - **Hero**: adicionado `.hero-content { align-content: start; align-self: start }` — elimina o vazio acima do kicker causado por `align-content: center` num contêiner full-height
  - **Section-title**: adicionado `font-size: clamp(1.65rem, 6.5vw, 2.35rem); overflow: visible` — corrige corte de letras (Horizon Bold 3rem + `overflow: hidden` do pai)
  - **Produtos**: adicionado `align-content: start` ao `.produtos-copy` — evita que `align-content: end` crie espaço acima do título de linha
- `js/animations/produtos-tabs.js`
  - ScrollTrigger mobile alterado de `start: 'top 78%'` → `start: 'top bottom'` — painéis 2 e 3 agora animam ao entrar no viewport (não mais visíveis como blocos pretos vazios antes do scroll)
  - `y: 24` → `y: 16` no estado inicial do `fromTo`

---

## [2026-05-24] FIX — Vídeo preview autoplay na seção Sobre (home)

**Agente:** Claude Code
**Sessão:** Auditoria Playwright + fix vídeo 404

### Criado
- `assets/videos/preview-institucional.mp4` — vídeo de preview para autoplay no botão YouTube da seção Sobre (copiado de `assets/images/galeria/WhatsApp Video 2026-05-05 at 12.13.30.mp4`)

### Motivo
`<video autoplay muted loop playsinline>` na home apontava para arquivo inexistente → 404 → vídeo não tocava. Arquivo adicionado na pasta correta, atributos já estavam corretos.

---

## [2026-05-23] FEAT — Responsividade mobile completa para todo o site

**Agente:** Claude Code
**Sessão:** Mobile responsiveness — refatoração completa xs/sm/md

### Criado
- `css/mobile.css` — arquivo dedicado de responsividade, ~780 linhas. Cobre todos os breakpoints:
  - `xs ≤ 479px` — iPhones pequenos, Android compactos
  - `sm ≤ 767px` — phones em geral
  - `md ≤ 1023px` — tablets e landscape phones
  - Componentes cobertos: global overflow, navbar, hero, sobre spec (home), social-proof, diferenciais, produtos, cta-mid, financiamento, depoimentos, section-headers, footer, subpages, localizacao, clientes (em-acao/entregas), sobre-unified (sobre.html), WhatsApp float, touch targets

### Alterado
- `index.html` — `<link rel="stylesheet" href="./css/mobile.css">` adicionado como último link do `<head>` (após todos os componentes)
- `sobre.html` — `<link rel="stylesheet" href="./css/mobile.css">` adicionado **após o `</style>` inline** para garantir precedência na cascata
- `produtos.html` — `<link rel="stylesheet" href="./css/mobile.css">` adicionado após os dois `</style>` inline
- `clientes.html` — `<link rel="stylesheet" href="./css/mobile.css">` adicionado após o `</style>` inline
- `credito.html` — `<link rel="stylesheet" href="./css/mobile.css">` adicionado como último link do `<head>`

### Correções críticas incluídas no mobile.css
- **Hero**: `white-space: nowrap` causava overflow de título em 375px → font-size reduzido + overlay escuro para legibilidade do texto
- **Diferenciais**: `white-space: nowrap` no título e `translateX(40px)` no step ativo causavam overflow horizontal → corrigidos
- **Produtos**: `aspect-ratio: 9/16` gerava 596px de altura em mobile → reduzido para 3:4 (sm) e 1:1 (xs)
- **Footer**: `min-height` removido em mobile para evitar espaço vazio excessivo
- **Subpages**: `padding-block: var(--section-md)` (mín. 80px) → `clamp(3.5rem, 8vw, 6rem)` em mobile
- **sobre.html**: conflito de nomes `.sobre-title` entre home (dark panel) e página sobre (branco) → regras da home restritas a `.sobre-spec .sobre-title`

---

## [2026-05-23] FIX — Mapa MapLibre removido da home + adicionado em sobre.html + estilo bright

**Agente:** Claude Code
**Sessão:** MapLibre — migração para sobre.html e correção de estilo

### Alterado
- `index.html` — seção `#localizacao` completamente removida (HTML, links CSS, CDN MapLibre + script init)
- `sobre.html` — Leaflet substituído por MapLibre GL JS (CDN, style `bright`, coords Palhoça SC)
- `sobre.html` — `<link>` maplibre-gl.css + localizacao.css adicionados; Leaflet CSS removido
- `sobre.html` — script init MapLibre: mapa com marcador custom (dot + pulse), popup com endereço e link para rota, `togglePopup` automático ao carregar
- `css/components/localizacao.css` — mantido como componente compartilhado

---

## [2026-05-23] FEAT — Seção Localização com MapLibre GL JS na landing page

**Agente:** Claude Code
**Sessão:** MapLibre GL JS — seção de localização premium

### Criado
- `css/components/localizacao.css` — estilos da seção: grid 2 colunas, eyebrow/title/text, address rows, marker com pulse, popup dark, controles MapLibre com tema escuro

### Alterado
- `index.html` — `<head>`: `localizacao.css` + `maplibre-gl.css` (CDN)
- `index.html` — nova section `#localizacao` inserida antes de `</main>`: layout 2 colunas, bloco de endereço/telefone, botões "Traçar rota" e "Falar pelo WhatsApp"
- `index.html` — `<body>` final: CDN `maplibre-gl.js` + script de init (mapa Positron, marcador custom, popup, `togglePopup` no load)

---

## [2026-05-23] CONTENT — Atualização completa de dados da empresa — Palhoça, SC

**Agente:** Claude Code
**Sessão:** Dados reais da empresa — endereço, telefone, coordenadas

### Alterado
- **Todos os HTMLs** — ticker: `MINAS GERAIS` → `PALHOÇA · SC`
- **Todos os HTMLs** — hero coords: `−19.9167° S · −43.9345° O / ALT 896M · MG · BR` → `−27.6453° S · −48.6701° O / ALT 5M · SC · BR`
- **Todos os HTMLs** — deco-label: `MG · BR` → `SC · BR`
- **Todos os HTMLs** — footer address: `Minas Gerais, Brasil` → `Palhoça, SC` + telefone `(48) 3348-9982` adicionado
- `sobre.html` — meta description, hero sub, eyebrow, sobre-coords: MG → SC
- `sobre.html` — badge: `MG` → `SC`, `Fabricado em Minas Gerais` → `Fabricado em Santa Catarina`
- `sobre.html` — loc endereço: `R. B, Qd. 01 Lt. 13 — Pacheco, Palhoça — SC, 88134-040`
- `sobre.html` — loc: item de Telefone adicionado com `(48) 3348-9982`
- `sobre.html` — Leaflet map center: `-19.9167, -43.9345` → `-27.6453, -48.6701`
- `sobre.html` — popup do mapa: `Minas Gerais · Brasil` → `Palhoça · SC · Brasil`

---

## [2026-05-23] STYLE — sobre.html: fundo da seção unificada convertido para branco

**Agente:** Claude Code
**Sessão:** White background — sobre-unified

### Alterado
- `sobre.html` — `.sobre-unified` e todos os sub-componentes convertidos de fundo escuro (`#090b0e`) para fundo branco (`#ffffff`):
  - `.sobre-stats` gap/border: rgba white → rgba dark
  - `.sobre-stat` background: `#090b0e` → `#f7f8fa`
  - `.sobre-stat__num`, `.sobre-stat__suffix`, `.sobre-stat__label`: cores white → dark
  - `.sobre-loc__title`, `.sobre-loc__item`, `.sobre-loc__label`, `.sobre-loc__value`, `.sobre-loc__value a`: cores white → dark
  - `.sobre-map-wrap` border: rgba white → rgba dark
  - `.leaflet-container` background: `#111316` → `#e8ecf0`
  - `.leaflet-control-attribution` invertido para fundo claro
  - Tiles Leaflet: `dark_all` → `light_all` (CartoDB)

---

## [2026-05-23] FEAT — sobre.html: refatoração completa — história, MVV, mapa interativo

**Agente:** Claude Code
**Sessão:** Refatoração sobre.html (frontend-design + copywriting)

### Alterado
- `sobre.html` — página refatorada com 3 novas seções:
  - **Nossa História**: nova copy com texto fornecido pelo cliente, stats com data-count, chips de infraestrutura (Corte a Laser, CNC, etc.), imagem com hover
  - **Missão, Visão & Valores**: seção com fundo claro, 3 cards com ícones SVG inline, animações stagger, hover com elevação
  - **Localização**: fundo escuro, informações de contato + mapa interativo Leaflet + tiles dark (CartoDB)
- `sobre.html` — hero: subtitle atualizada com foco nos diferenciais (3.000m², laser, CNC)
- `sobre.html` — CTA: botão atualizado com SVG WhatsApp + "Sem compromisso"
- `sobre.html` — Leaflet.js adicionado (CDN, sem API key)

---

## [2026-05-23] CONTENT — page-cta: adicionado texto "Sem compromisso" abaixo do botão

**Agente:** Claude Code
**Sessão:** Animação loader + padronização footer + page-cta

### Alterado
- `css/components/subpages.css` — adicionada classe `.page-cta__note` (mono, xs, uppercase, opacidade 0.3)
- `produtos.html` — `page-cta`: adicionado `<p class="page-cta__note">Sem compromisso</p>`
- `sobre.html` — `page-cta`: adicionado `<p class="page-cta__note">Sem compromisso</p>`
- `clientes.html` — `page-cta`: adicionado `<p class="page-cta__note">Sem compromisso</p>`
- `credito.html` — `page-cta`: adicionado `<p class="page-cta__note">Sem compromisso</p>`

---

## [2026-05-23] STYLE — Footer: headline padronizada para "Machado" em todas as páginas

**Agente:** Claude Code
**Sessão:** Animação loader + padronização footer

### Alterado
- `sobre.html` — `footer-headline`: "Machado Plataformas" → "Machado"
- `produtos.html` — `footer-headline`: "Machado Plataformas" → "Machado"
- `clientes.html` — `footer-headline`: "Machado Plataformas" → "Machado"
- `credito.html` — `footer-headline`: "Machado Plataformas" → "Machado"

---

## [2026-05-23] STYLE — Loader: saída trocada de wipe diagonal para scale + fade

**Agente:** Claude Code
**Sessão:** Animação de saída do loading screen

### Alterado
- `js/loader.js` — exit animation substituída: `clipPath` diagonal removido, substituído por `autoAlpha: 0` + `scale: 1.06` com ease `machado` (0.6s)
- `css/animations.css` — `#loader`: removidos `clip-path` e `will-change: clip-path`; adicionado `will-change: opacity, transform`

---

## [2026-05-22] FEAT — Clientes: galerias imersivas + seção Entregas Realizadas

**Agente:** Claude Code
**Sessão:** Refinamentos clientes.html — galerias, entregas, arsenal

### Alterado
- `clientes.html` — galeria "Clientes em Ação" convertida de grid masonry para carrossel Swiper imersivo: slides altos (`clamp(420px, 68vh, 720px)`), efeito spotlight (slide ativo scale 1 / opacity 1, laterais scale 0.93 / opacity 0.45), `centeredSlides`, `loop: true`, `initialSlide: 1`, numeração no canto de cada slide, setas prev/next + contador
- `clientes.html` — adicionado Swiper CSS/JS (`swiper@11`) via CDN
- `clientes.html` — seção `ENTREGAS REALIZADAS` criada: 4 KPIs (2.000+ plataformas, 22 anos, 27 UFs, 100% fabricação própria), galeria carrossel idêntica ao em-acao (fundo escuro, setas com tema escuro), ticker animado de estados atendidos com `// Cobertura nacional`
- `clientes.html` — galeria de entregas: mesmo Swiper imersivo com `loop: true`, `initialSlide: 1`, spotlight effect, contador e numeração por slide

### Alterado — Arsenal (produtos.html)
- `produtos.html` — `min-height` do `arsenal__inner` ajustado para `clamp(240px, 38svh, 420px)`; imagens com `transform: scale(0.85)`; linha vertical gradiente do `arsenal__content::before` removida; `max-width` do content aumentado `440px → 520px`; título `arsenal__name` aumentado para `clamp(3rem, 5.5vw, 5.75rem)`
- `produtos.html` — lista `.arsenal__features` redesenhada: separadores horizontais entre itens, fonte mono uppercase, marcador square azul 6×6px
- `produtos.html` — tagline curta adicionada abaixo do título em cada linha (Leve, Média, Pesada); label `// DIFERENCIAIS` adicionado acima da lista de features

---

## [2026-05-22] FIX — Arsenal: imagens maiores — swiper preenche altura total da coluna

**Agente:** Claude Code
**Sessão:** Refinamentos visuais — arsenal + opcionais + depoimentos + footer

### Alterado
- `produtos.html` — `.arsenal-swiper`: removido `aspect-ratio: 16/9` dos slides; swiper agora usa `height: 100%` + `flex: 1` preenchendo toda a altura da coluna de imagem; `.arsenal__img-side` ganhou `min-height` e `height: 100%` para propagar a altura corretamente; `.swiper-wrapper` e `.swiper-slide` configurados com `height: 100%`

---

## [2026-05-21] FEAT — Seção Opcionais: 6 cards de acessórios com placeholder blueprint

**Agente:** Claude Code
**Sessão:** Refinamentos visuais — arsenal + opcionais + depoimentos + footer

### Criado
- `produtos.html` — nova seção `.opcionais` com 6 cards (Alongamento de Chassis, Asa Delta, Rampas, Sapatas Hidráulicas, Remonte, Portas Laterais Removíveis); placeholder blueprint com gradiente CSS; background branco, padding 40px, sem labels de header

### Alterado
- `produtos.html` — `.page-hero` padding-bottom restaurado (removida override que zerava o espaço inferior); `.arsenal__inner min-height` aumentado para `clamp(400px, 68svh, 720px)`; `.arsenal__img-side align-self: stretch`
- `css/components/depoimentos.css` — refatorado para background branco; cores dos cards, textos e trust strip ajustadas para contexto claro
- `css/components/footer.css` — `.footer-headline` migrada para `var(--font-display)` (fonte Machado/METAG), texto reduzido para "Machado", centralizado, `font-size: clamp(4rem, 14vw, 18rem)`; `.footer-grid min-height` reduzido
- `css/typography.css` — `.text-stroke` corrigido: `color: #1B4D84` em vez de `transparent`
- `css/components/sobre.css` — título e subtítulo com tamanhos revistos; `.sobre-cta` com classe `btn--split--lg`
- `index.html` — `.depoimentos` sem classe `section--dark`; `.sobre-cta` com `btn--split--lg`

---

## [2026-05-21] STYLE — Tipografia: Orbitron Black definida como fonte definitiva dos títulos de seção

**Agente:** Claude Code
**Sessão:** Estudo tipográfico — decisão final

### Alterado
- `css/typography.css` — `@import` Orbitron Black 900 via Google Fonts (fonte definitiva de títulos)
- `css/variables.css` — `--font-titles` consolidada com Orbitron; removidos comentários de estudo e Eurostile Extended do stack
- `css/components/social-proof.css`, `produtos.css`, `footer.css`, `subpages.css` — `font-weight: 900` aplicado
- `produtos.html` — `.arsenal__name` usando `--font-titles` / Orbitron 900

---

## [2026-05-21] STYLE — Estudo tipográfico: Eurostile Extended nos títulos, Metal Gear preservado apenas no hero

**Agente:** Claude Code
**Sessão:** Estudo tipográfico — Eurostile Extended

### Alterado
- `css/variables.css` — adicionada variável `--font-titles` com stack Eurostile Extended + Rajdhani como fallback
- `css/typography.css` — adicionado `@import` Google Fonts para Rajdhani (fallback do estudo; remover em produção)
- `css/components/social-proof.css` — `.social-proof-stat__number` → `--font-titles`, weight 700
- `css/components/produtos.css` — `.produtos-line-name` e `.produtos-line-name__prefix` → `--font-titles`, uppercase, letter-spacing ajustado
- `css/components/depoimentos.css` — `.depoimento-card::after` (aspas decorativas) → `--font-titles`
- `css/components/footer.css` — `.footer-headline` → `--font-titles`, uppercase, weight 700
- `css/components/subpages.css` — `.page-hero__title`, `.page-hero__deco-num`, `.kpi-cell__val`, `.page-cta__title` → `--font-titles`, weight 700

---

## [2026-05-18] FIX — sobre.html: restauração do diferenciais, correção de font, limpeza de CSS morto

**Agente:** Claude Code
**Sessão:** Correção pós-refatoração sobre.html

### Alterado
- `sobre.html`:
  - Re-adicionado link para `diferenciais.css` (seção sticky-scroll restaurada)
  - `#diferenciais` (sticky-scroll original com 4 steps + 4 imagens) restaurado acima de `.sobre-empresa`
  - `.sobre-stat__num`: `font-family` trocado de `var(--font-display)` → `var(--font-heading)` para evitar caracteres ausentes na Machado TTF (`+`, `.`, vírgula)
  - Removido CSS morto das classes `.sobre-pilares`, `.pilares-header`, `.pilares-list`, `.pilar-row` (seção substituída pelo original)

---

## [2026-05-18] REFACTOR — sobre.html: reestruturação completa (white bg + padrão canônico)

**Agente:** Claude Code
**Sessão:** Refatoração sobre.html (/frontend-design /ui-ux-pro-max /copywriting)

### Alterado
- `sobre.html`:
  - Removido link `diferenciais.css` (seção substituída)
  - `<style>` completamente reescrito — estilos limpos, fundo branco, tokens AA ✓
  - **"Sobre a empresa"** (branco): header 2-col canônico (eyebrow + section-title) + strip de 4 stats (números grandes, fonte display, azul primário) + split texto/imagem (1:1 em 1024px)
  - **"Pilares da empresa"** (surface #F2F4F6): header 2-col canônico + lista editorial numerada (4 pilares como linhas de tabela — num col 3.5rem | corpo | tags)
  - Removidos: `page-content`, `page-content--alt`, `valores-grid`, `valor-item`, `diferenciais` (seção sticky-scroll)
  - Copy reescrito (copywriting skill): direto, industrial, sem buzzwords
  - "3 Linhas de produto" → "2.000+ Clientes ativos" (mais impactante)
  - Pilares consolidados: Aço / Fabricação / Garantia / Suporte (4 items, layout limpo)

---

## [2026-05-18] STYLE — clientes.html: padronização de cabeçalhos (eyebrow + section-title)

**Agente:** Claude Code
**Sessão:** Padronização de títulos

### Alterado
- `clientes.html`:
  - Galeria "Clientes em ação": substituído padrão `sec-kicker` + `sec-title` pelo padrão canônico `eyebrow` + `section-title` com wrapper `.em-acao-header` (grid 2 colunas em tablet+, igual ao `.depoimentos-header`)
  - Adicionado parágrafo de apoio `.em-acao-header__text` na galeria (mesmo papel do `.depoimentos-header__text`)
  - CSS atualizado: removidas regras `sec-kicker`/`sec-title`, adicionados overrides para `eyebrow` e `section-title` no contexto claro da galeria
  - Ambas as seções agora usam: wrapper grid > (eyebrow + section-title) + texto de apoio + data-animate="fade-up"

---

## [2026-05-18] FIX/FEAT — clientes.html: remoção de dead node + CTA duplo com WhatsApp

**Agente:** Claude Code
**Sessão:** Melhorias finais clientes.html

### Alterado
- `clientes.html`:
  - Removido `page-hero__sub` (texto hidden por CSS — dead node)
  - CTA final: adicionado `page-cta__actions` (flex wrap) com botão secundário `btn--ghost-white` "Falar no WhatsApp"
  - Adicionados estilos inline: `.page-cta__actions`, `.btn--ghost-white` (ghost outline para fundo escuro, com hover sutil)

---

## [2026-05-18] STYLE — clientes.html: tema claro (white background) para galeria e depoimentos

**Agente:** Claude Code
**Sessão:** Otimização galeria + tema light

### Alterado
- `clientes.html` — tema light via overrides inline scoped:
  - `.em-acao`: bg `#ffffff`, kicker e título adaptados para fundo claro (contraste AA ≥4.5:1)
  - `.depoimentos`: removida classe `section--dark`; adicionada `.depoimentos--light`
  - Cards em branco com `border: rgba(28,36,48,0.09)` e `box-shadow` minimal
  - `.depoimento-card--featured`: gradiente azul leve + borda `primary-light`
  - Avatar: `background: var(--color-primary)` com texto branco
  - Texto muted: substituído de `--color-text-muted` (#A7B0BA, contraste insuficiente) por `rgba(28,36,48,0.5/0.6)` (contraste AA ✓)
  - `.depoimentos--light` escoped para não afetar index.html

---

## [2026-05-18] STYLE — clientes.html: galeria compactada para 4 colunas

**Agente:** Claude Code
**Sessão:** Otimização galeria clientes

### Alterado
- `clientes.html` — `.em-acao-grid`:
  - Grid migrado de 3 para 4 colunas
  - Substituído `aspect-ratio: 4/3` por `grid-auto-rows: clamp(150px, 17vw, 210px)` (altura fixa fluida)
  - Layout rebalanceado para 3 linhas exatas: item1(span2)+item2+item3 / item4-7 / item8(span2)+item9+item10
  - Resultado: ~50% menos altura vertical (~630px vs ~1200px no desktop)
  - Responsivo: 2 colunas em 767px, 1 coluna em 480px

---

## [2026-05-18] STYLE — page-hero: separador linha + label (revert diagonal)

**Agente:** Claude Code
**Sessão:** Refinamento page-hero

### Alterado
- `css/components/subpages.css`:
  - `.page-hero`: removido `clip-path` (revert opção 3)
  - `.page-hero::after`: fade de base restaurado
  - Adicionados estilos `.page-divider` e `.page-divider__label` — linha fina com label mono centralizado
- `produtos.html` — divider com label "Produtos"
- `clientes.html` — divider com label "Clientes"
- `sobre.html` — divider com label "Sobre"
- `credito.html` — divider com label "Linha de Crédito"

---

## [2026-05-18] STYLE — page-hero: separador diagonal (clip-path)

**Agente:** Claude Code
**Sessão:** Refinamento page-hero

### Alterado
- `css/components/subpages.css`:
  - `.page-hero`: adicionado `clip-path: polygon(0 0, 100% 0, 100% calc(100% - 3.5rem), 0 100%)` — corte diagonal na borda inferior
  - `.page-hero::after`: desativado (`display: none`) — substituído pelo corte diagonal

---

## [2026-05-18] STYLE — page-hero: compacto — remove status/sub, título menor e espaçado

**Agente:** Claude Code
**Sessão:** Refinamento page-hero — simplificação e compactação

### Alterado
- `css/components/subpages.css`:
  - `.page-hero`: padding-top reduzido (`+ space-8`), padding-bottom (`space-10`), min-height `clamp(200px, 30svh, 340px)`
  - `.page-hero__title`: fonte reduzida para `clamp(2rem, 7vw, 5.25rem)` (metade anterior), letter-spacing `0.12em`, margin removida
  - `.page-hero__status`: `display: none`
  - `.page-hero__sub`: `display: none`

---

## [2026-05-18] STYLE — page-hero: refinamento visual completo (escala, atmosfera, animações, layout)

**Agente:** Claude Code
**Sessão:** Refinamento page-hero — todas as subpáginas

### Alterado
- `css/components/subpages.css` — Refatoração completa do bloco PAGE HERO:
  - `.page-hero`: adicionado `min-height: clamp(480px, 68svh, 760px)` para presença vertical maior
  - `.page-hero::before`: segundo glow (top-right sutil `rgba(91,155,213,0.07)`), glow principal mais forte (`0.18` vs `0.09`), fade-in animado (`page-hero-bg-in`)
  - `.page-hero::after`: fade de base aumentado de 5rem para 8rem
  - `.page-hero__title`: fonte maior `clamp(4rem, 14vw, 10.5rem)` (era `clamp(3rem, 10vw, 8rem)`), letter-spacing `-0.04em` (era `-0.03em`), line-height `0.84`
  - `.page-hero__title-inner`: animação `subpage-title-rise` agora inclui `filter: blur(8px) → blur(0)` para entrada cinematográfica
  - `.page-hero__sub`: borda esquerda migrou para `2px solid rgba(91,155,213,0.28)` (azul sutil vs branco neutro)
  - Novos keyframes: `page-hero-bg-in`, `page-hero-deco-in`
  - Novos estilos: `.page-hero__deco`, `.page-hero__deco-num`, `.page-hero__deco-label`
  - `@media (prefers-reduced-motion)`: atualizado para incluir novos elementos e `filter: none` no título
  - `@media (max-width: 767px)`: `.page-hero__deco { display: none }` para mobile

### Criado (estrutura HTML)
- `produtos.html` — elemento `<div class="page-hero__deco">` com número "01" e label "MG · BR"
- `clientes.html` — elemento `<div class="page-hero__deco">` com número "02"
- `sobre.html` — elemento `<div class="page-hero__deco">` com número "03"
- `credito.html` — elemento `<div class="page-hero__deco">` com número "04"

---

## [2026-05-16] STYLE — Produtos: Arsenal — refactor content (título azul, kicker limpo, animações)

**Agente:** Claude Code
**Sessão:** Refactor arsenal__content — ui-ux-pro-max

### Alterado
- `produtos.html` — melhorias no bloco `.arsenal__content`:
  - `.arsenal__name` cor alterada de `var(--color-text)` para `var(--color-primary-light)` (azul do site)
  - Kickers das 3 seções: removido prefixo "NN / 03 —" → apenas "Linha Leve", "Linha Média", "Linha Pesada"
  - CSS: stagger fade-up entrance animation (opacity + translateY, 42s ease-out) com delays 0/75/155/225/295ms para kicker, name, specs, features e btn
  - JS: IntersectionObserver (threshold 0.18) adiciona `.is-visible` ao `.arsenal__content` visível; fallback para browsers sem suporte
  - `@media (prefers-reduced-motion)`: animações desativadas

---

## [2026-05-15] FEAT — Produtos: Arsenal — carousel horizontal estilo Instagram

**Agente:** Claude Code
**Sessão:** Carousel horizontal com 3 slides visíveis por seção

### Alterado
- `produtos.html` — refatoração do img-side para carousel horizontal:
  - HTML: cada `arsenal__img-side` agora contém `.arsenal__carousel > .arsenal__carousel-track > .arsenal__slide` (3-5 slides por seção)
  - CSS: `.arsenal__carousel` com `overflow-x: scroll; scroll-snap-type: x mandatory`, track com `height: clamp(200px, 48svh, 490px)`, slides `flex: 0 0 calc((100% - 6px) / 3)` (3 visíveis desktop, 2 mobile)
  - CSS: `.arsenal__slide--hero` usa `object-fit: contain; mix-blend-mode: lighten` (PNG); `.arsenal__slide--photo` usa `object-fit: cover; mix-blend-mode: normal` (JPG)
  - JS: substituído src-swap por `carousel.scrollTo({ left: slide.offsetLeft })` com snap snapping por índice; counter e setas mantidos

---

## [2026-05-15] STYLE — Produtos: Arsenal — compactação vertical (ui-ux-pro-max)

**Agente:** Claude Code
**Sessão:** Compactação Arsenal — disposição de elementos e altura vertical

### Alterado
- `produtos.html` — redução cirúrgica de espaçamentos verticais para maior densidade sem distorcer imagens:
  - `arsenal__inner` min-height: `clamp(320px, 65svh, 620px)` → `clamp(280px, 54svh, 560px)`
  - `arsenal__inner` gap: `var(--space-12)` → `var(--space-8)` (3rem → 2rem entre colunas)
  - `arsenal__content` padding-block: `clamp(3rem, 6vh, 6rem)` → `clamp(1.75rem, 3.5vh, 4rem)`
  - `arsenal__kicker` margin-bottom: `var(--space-4)` → `var(--space-3)`
  - `arsenal__name` margin-bottom: `var(--space-5)` → `var(--space-4)`
  - `arsenal__specs` margin-bottom: `var(--space-5)` → `var(--space-4)`
  - `arsenal__spec` padding: `var(--space-3) var(--space-4)` → `var(--space-2) var(--space-3)`
  - `arsenal__features` margin-bottom: `var(--space-6)` → `var(--space-5)`; gap: `var(--space-3)` → `var(--space-2)`
  - `.arsenal + .arsenal` margin-top: `var(--space-16)` → `var(--space-10)`

---

## [2026-05-15] FEAT — Produtos: redesign completo — Grid de Cards

**Agente:** Claude Code
**Sessão:** Redesign página Produtos — Grid de Cards light

### Alterado
- `produtos.html` — Substituição total do layout Arsenal (cinematic scroll, dark) pelo novo layout Grid de Cards (fundo claro `--color-surface`, tipografia escura). 3 artigos `.pcard` com imagem, especificações técnicas e CTA. Remoção completa do HTML `.arsenal__*`, ticker e script inline de galeria.

---

## [2026-05-15] STYLE — Produtos: Arsenal — layout mais compacto

**Agente:** Claude Code
**Sessão:** Compactação proporcional das seções Arsenal

### Alterado
- `produtos.html` — reduções proporcionais em todas as dimensões verticais:
  - `arsenal__inner` min-height: `clamp(520px, 78svh, 800px)` → `clamp(380px, 56svh, 640px)`
  - `arsenal__content` padding-block: `clamp(3.5rem, 7vh, 6rem) …` → `clamp(2rem, 4vh, 4rem) clamp(1.5rem, 3vh, 3rem)`
  - `arsenal__kicker` margin-bottom: `var(--space-6)` → `var(--space-4)`
  - `arsenal__name` font-size: `clamp(5rem, 8vw, 8.5rem)` → `clamp(3.5rem, 5.5vw, 6rem)`; margin: `space-8` → `space-5`
  - `arsenal__specs` margin-bottom: `space-8` → `space-5`; `arsenal__spec` padding: `space-4 space-5` → `space-3 space-4`
  - `arsenal__desc` margin-bottom: `space-10` → `space-6`
  - Responsive ≤1024px: img-side height, content padding e name size reduzidos proporcionalmente
  - Responsive ≤600px: name size `clamp(3.5rem, 18vw, 5rem)` → `clamp(2.5rem, 14vw, 4rem)`

---

## [2026-05-15] FIX — Produtos: Arsenal — polimento UI/UX (acessibilidade, interação, tipografia)

**Agente:** Claude Code
**Sessão:** Auditoria ui-ux-pro-max — 7 correções

### Alterado
- `produtos.html`:
  - **Acessibilidade**: `.arsenal__spec__label` — `font-size: 9px` → `var(--text-xs)` (12px); `color: rgba(255,255,255,0.28)` → `rgba(255,255,255,0.5)` (contraste ~4.8:1 no charcoal, aprovado WCAG AA)
  - **Tokens**: `.arsenal__spec` border usa `var(--color-navbar-border-dark-strong)` em vez de valor raw
  - **Easing**: `.arsenal__img` transition usa `var(--ease-machado)` e `var(--ease-premium)` em vez de cubic-bezier inline
  - **Touch**: `.arsenal__arrow` recebe `touch-action: manipulation` (elimina 300ms delay) e `user-select: none`
  - **Estado ativo**: `.arsenal__arrow:active` com `transform: scale(0.92)` — feedback de pressão
  - **Transição da seta**: `transition` inclui `transform 0.12s ease` para restore suave do active
  - **Números**: `.arsenal__img-counter` recebe `font-variant-numeric: tabular-nums` — previne layout shift
  - **Focus ring**: `.arsenal:focus-visible` com outline azul sutil para navegação por teclado
  - **Reduced motion (JS)**: `setImage()` verifica `prefers-reduced-motion` — troca imagem instantaneamente se ativo
  - **Reduced motion (CSS)**: `.arsenal__img { transition: none }` em `prefers-reduced-motion`

---

## [2026-05-15] STYLE — Produtos: Arsenal — separador de linha e specs charcoal

**Agente:** Claude Code
**Sessão:** Contraste — linha separadora e cor #333333 nos specs

### Alterado
- `produtos.html`:
  - `.arsenal-stack`: `gap` removido → `0`; adicionado `.arsenal + .arsenal { border-top: 1px solid var(--color-navbar-border-dark-strong) }` — separador de linha fina entre seções
  - `.arsenal__specs`: `background: rgba(0,0,0,0.3)` → `var(--color-menu-bg)` (#333333) — painel de specs vira charcoal consistente com o navbar; `backdrop-filter` removido

---

## [2026-05-15] STYLE — Produtos: Arsenal — split panel claro/escuro

**Agente:** Claude Code
**Sessão:** Contraste — content side off-white, image side dark

### Alterado
- `produtos.html` — split panel implementado:
  - `.arsenal__content`: `background: #F5F4F0` + `padding-inline` interno
  - Cores adaptadas ao fundo claro: `.arsenal__name` → `var(--color-black)`, `.arsenal__desc` → `rgba(0,0,0,0.56)`, kicker/traço → `var(--color-primary)`
  - Specs panel: border/bg claro, sem `backdrop-filter`
  - `.arsenal__img-side::before`: left-edge blend removido → top-fade discreto (`to bottom`)
  - `.arsenal--alt` override atualizado com mesma lógica (sem left/right blend)

---

## [2026-05-15] STYLE — Produtos: Arsenal — escala, mirror e gap discreto

**Agente:** Claude Code
**Sessão:** Refinamento do Arsenal após implementação inicial

### Alterado
- `produtos.html` — 3 melhorias pós-implementação:
  - **Escala reduzida**: `min-height: 100svh` → `clamp(520px, 78svh, 800px)`; padding-block proporcional reduzido — seções menos altas, mais compactas
  - **Mirror da seção MÉDIA**: classe `arsenal--alt` adicionada na section MÉDIA — imagem à esquerda, conteúdo à direita com `align-items: flex-end` + `text-align: right`; kicker com `flex-direction: row-reverse`; gradiente lateral invertido (`to left`); setas reposicionadas para esquerda
  - **Gap discreto entre seções**: wrapper `<div class="arsenal-stack">` com `background: var(--color-black)` + `gap: var(--space-4)` — distância física entre seções sem contraste de cor (black-on-black); `border-bottom` removido do `.arsenal`

---

## [2026-05-15] FEAT — Produtos: implementação do layout Arsenal (cinematic scroll)

**Agente:** Claude Code
**Sessão:** Implementação Arsenal na página real após aprovação do Preview B

### Alterado
- `produtos.html` — substituição completa do layout catálogo pelo Arsenal:
  - `<style>` block reescrito: classes `.catalog-*` removidas, classes `.arsenal` implementadas
  - Layout: 3 seções `100svh` empilhadas (LEVE, MÉDIA, PESADA), grid 50/50 conteúdo/imagem
  - Margens bilaterais com `clamp(2.5rem, 7vw, 7rem)` — sem sangria de borda
  - Imagens movidas para subpastas (`/leve/`, `/media/`, `/pesada/`) com galeria de 4–5 fotos por linha
  - Navegação por setas prev/next com contador `01/05`; lógica PNG → `contain`, JPG → `cover`
  - Padrão tipográfico do hero replicado: `.arsenal__kicker` (traço azul + label mono), `.arsenal__name` (display font grande), `.arsenal__desc` (estilo `.hero-subtitle`)
  - Glass panel de specs, ticker animado por linha, filtros tonais por variante
  - `.page-hero { padding-bottom: 0 }` para transição fluida hero → primeira seção
  - Responsivo: mobile stack vertical, imagem acima, tablet 50vw altura mínima
  - JS inline de galeria antes dos módulos GSAP

---

## [2026-05-15] FEAT — Produtos: criação de 3 arquivos de preview para novos layouts

**Agente:** Claude Code
**Sessão:** Preview de modelos de layout para seleção pelo cliente

### Criado
- `produtos-modelo-1.html` — Preview Modelo 1: Vitrine Editorial — layout 40/60, produto único em destaque, ghost number, thumbnails, navegação por setas
- `produtos-modelo-2.html` — Preview Modelo 2: Comparativo Técnico Premium — grid 3 colunas, galeria por thumbnail, barras de capacidade, tabela de specs
- `produtos-modelo-3.html` — Preview Modelo 3: Experiência Imersiva — tabs LEVE/MEDIA/PESADA sticky, stage full-height, specs completos por produto, ghost number, tags

### Observação
Nenhum arquivo existente foi alterado. `produtos.html` permanece intacto. Aguardar aprovação do cliente antes de implementar.

---

## [2026-05-14] FIX — Produtos: refactor layout proporção, altura e responsividade

**Agente:** Claude Code
**Sessão:** UI/UX Pro Max + Frontend CSS Refactor — seção catalog

### Alterado
- `produtos.html` — `<style>` block completamente refatorado:
  - `.catalog-img-frame`: `aspect-ratio: 4/5` → `height: clamp(220px, 36vh, 340px)` — elimina overflow de viewport em notebooks (1366×768)
  - `.catalog-img`: `object-fit: cover` → `object-fit: contain` + `object-position: center center` — mostra plataforma completa sem corte
  - `.catalog-name`: `clamp(3.5rem, 5vw, 5.5rem)` → `clamp(2.25rem, 3.2vw, 4rem)` — título mais proporcional
  - `.catalog-desc`: `line-height: 1.8` → `1.65`, adicionado `max-width: 28ch`
  - `.catalog-body`: padding reduzido de `space-8/6/10` para `space-5/5/8`, gap de `space-4` para `space-3`
  - `.catalog-body .btn`: margin-top de `space-6` → `space-4`
  - `.catalog-idx`: padding reduzido de `space-5/6/4` para `space-4/5/3`
  - `.catalog-measures`: `padding-top: space-6` → `space-4`
  - `.catalog-bottom-strip`: `padding-block: space-8` → `space-5`
  - `.catalog-bottom-strip__inner`: adicionado `padding-inline: space-4`
  - `.catalog-section`: adicionado `padding-top: space-8`, `padding-bottom` de `section-md` → `section-sm`
  - `.catalog-section .container--wide`: `margin-top: space-10` → `space-6`, `padding-inline` sobrescrito com `clamp(space-3, 2vw, space-6)`
  - `.page-hero`: `padding-bottom: space-12` → `space-8`
  - Breakpoints responsivos atualizados com novos valores de imagem e título

### Resultado
- Card total estimado em 1366×768: ~627px (era ~918px, redução de 32%)
- Plataformas exibidas sem corte com `object-fit: contain`
- Seção ocupa ~80% do viewport em notebook vs ~120% anterior

---

## [2026-05-14] STYLE — Produtos: auditoria design-system — tokens finais

**Agente:** Claude Code
**Sessão:** Design-system layout audit completo

### Alterado
- `produtos.html` — token residual `#FFFFFF` → `var(--color-white)`, `50px` → `var(--space-12)`, `0.6s` → `var(--dur-slow)` no `.catalog-img` transition

---

## [2026-05-14] FIX — Produtos: remove laranja, corrige tokens e botões

**Agente:** Claude Code
**Sessão:** Alinhamento ao sistema de design do projeto

### Alterado
- `produtos.html` — `<style>` block reescrito sem variáveis custom (`--copper`, `--catalog-bg`, etc.):
  - Todas as cores migradas para tokens do projeto: `--color-primary-light`, `--color-border`, `--color-border-light`, `--color-text-muted`, `--color-bg`, `--color-footer-bg`, `--color-primary-glow`
  - Todos os espaçamentos corrigidos para tokens válidos: `var(--space-7)` → `var(--space-8)`, `var(--space-9)` → `var(--space-10)`
  - `--ease-machado` e `--dur-normal/slow` usados em vez de valores literais
  - Gradiente do frame usa `var(--color-bg)` diretamente em vez de hex hardcoded
  - Hover glow usa `var(--color-primary-glow)` (azul) em vez de cobre
  - `.catalog-body .btn { align-self: flex-start; margin-top: var(--space-6); }` adicionado
  - 3 links `class="catalog-cta"` substituídos por `class="btn btn--split btn--split-primary"` com `data-magnetic`

---

## [2026-05-14] STYLE — Refino completo do layout Catálogo em produtos.html

**Agente:** Claude Code
**Sessão:** Refinamento visual — hover, tipografia, imagens, hero, cores

### Alterado
- `produtos.html` — refinamento abrangente do bloco `<style>`:
  - Hero funde com catálogo: `.page-hero { background-color: var(--catalog-bg) }` — elimina quebra visual
  - Cobre ajustado para `#C08042` (mais quente, mais premium)
  - `catalog-idx__rule`: opacity 0.3→1 no hover (regra "acende")
  - `catalog-img-frame`: `aspect-ratio: 3/4.8`, fundo `#0B0F14`, gradiente bottom mais profundo
  - `catalog-img`: drop-shadow mais forte, padding `var(--space-6) var(--space-8) 0`, scale 1.05 no hover
  - `::before` novo: glow cobre radial vindo de baixo, aparece no hover
  - `catalog-name`: `clamp(3.5rem, 5vw, 5.5rem)`, `line-height: 0.86`, `letter-spacing: -0.025em`
  - CTA começa com `opacity: 0.6`, sobe para 1; seta percorre 6px com `cubic-bezier(0.16, 1, 0.3, 1)`
  - `prefers-reduced-motion` adicionado

---

## [2026-05-14] FEAT — Redesign página Produtos: layout Catálogo editorial

**Agente:** Claude Code
**Sessão:** Redesign produtos.html — 3 opções de layout + implementação Catálogo

### Alterado
- `produtos.html` — `<style>` block completamente substituído; seção de conteúdo reescrita com layout Catálogo editorial (grid 3 colunas, imagens `aspect-ratio: 3/4.5`, hover zoom, acento cobre `#B87B45`, specs em linhas pontilhadas, bottom strip com CTA); adicionada seção `page-cta` ao final da `<main>`

### Criado
- `preview-A.html` — conceito "Ficha Técnica": painel 44/56 com tabs interativas, ghost number, especificações em tabela, foto bottom-anchored com glow
- `preview-B.html` — conceito "Arsenal": 3 × 100svh por produto, scroll cinematic, ticker CSS, imagem absoluta à direita com gradiente
- `preview-C.html` — conceito "Catálogo": grid editorial 3 colunas, acento cobre, medições com pontilhado, hover em imagem e nome (implementado em `produtos.html`)

---

## [2026-05-14] REFACTOR — Migra subpáginas para subpages.css compartilhado

**Agente:** Claude Code
**Sessão:** Integração subpages.css — remoção de inline styles duplicados

### Criado
- `css/components/subpages.css` — estilos compartilhados de subpáginas: `.page-hero` (com grade, animação eyebrow + title rise + sub fade), `.page-section`, `.sec-header`, `.sec-kicker`, `.sec-title`, `.kpi-strip`, `.kpi-cell`, `.page-cta`

### Alterado
- `produtos.html` — link `subpages.css` adicionado; `<style>` block simplificado (`.page-hero*` removidos, mantidos apenas `.page-content` e `.page-card*`); título `<h1>` atualizado com `.page-hero__title-line` + `.page-hero__title-inner` para animação de entrada
- `clientes.html` — link `subpages.css` adicionado; `<style>` block simplificado (`.page-hero*` e `.page-cta*` removidos, mantidos apenas `.page-content` e `.depo-card*`); título atualizado com wrappers de animação
- `sobre.html` — link `subpages.css` adicionado; `<style>` block simplificado (`.page-hero*` e `.page-cta*` removidos, mantidos apenas estilos de página específicos); `--space-px` solto (CSS inválido) substituído por `1px` direto no gap; título atualizado com wrappers de animação
- `credito.html` — link `subpages.css` adicionado; `<style>` block inline removido completamente (apenas `.page-hero*` e `.page-cta*` estavam lá); título em duas linhas atualizado com wrappers de animação por linha

---

## [2026-05-14] FEAT — Cria página Linha de Crédito e atualiza navbar global

**Agente:** Claude Code
**Sessão:** Criação de credito.html + migração da seção #financiamento

### Criado
- `credito.html` — subpage "Linha de Crédito" com page-hero + seção #financiamento completa + CTA final + footer

### Alterado
- `index.html` — removida seção `#financiamento` e link `financiamento.css`; adicionado `Crédito` ao navbar
- `sobre.html` — adicionado `Crédito` ao navbar
- `produtos.html` — adicionado `Crédito` ao navbar
- `clientes.html` — adicionado `Crédito` ao navbar

---

## [2026-05-14] REFACTOR — Move #depoimentos para o final da home

**Agente:** Claude Code
**Sessão:** Reordenação de seções

### Alterado
- `index.html` — Section `#depoimentos` movida de posição 3 (após hero/sobre) para posição final antes do `</main>`, depois de `#financiamento`; nova ordem: Hero → Sobre → Produtos → Financiamento → Depoimentos → Footer

---

## [2026-05-14] FEAT — Remove section #cta-mid da home

**Agente:** Claude Code
**Sessão:** Remoção da section CTA intermediário

### Removido
- `index.html` — Section `#cta-mid` (CTA intermediário completo com copy, botões, trust list e figura)
- `index.html` — `<link>` para `cta-interstitial.css` removido do `<head>`

---

## [2026-05-14] FIX — #sobre: botão CTA fora do viewport (overflow clip + space-between)

**Agente:** Claude Code
**Sessão:** Fix de layout — botão sumindo abaixo da section

### Alterado
- `css/components/sobre.css` — Removido `overflow: hidden` do `.sobre` (filhos já gerenciam o próprio overflow: `sobre-media` e `sobre-yt` têm regra própria); desktop `.sobre-spec` trocado de `justify-content: space-between` + `gap: 0` para `justify-content: flex-start` + `gap: var(--space-12)`, com `.sobre-spec__footer { margin-top: auto }` para manter footer ancorado na base quando há espaço

---

## [2026-05-14] STYLE — #sobre: espaçamento editorial + fixes web-design-guidelines

**Agente:** Claude Code
**Sessão:** design-system + web-design-guidelines — spacing tier-up

### Alterado
- `css/components/sobre.css` — Espacamento aumentado para tier editorial: `sobre-spec` gap `space-10→12`, padding mobile `space-16→20`; header gap `space-5→6`; KPI cells padding `space-8/6→10/8` (mobile), `space-10/9→12/10` (desktop, fix bug space-9 undefined); hero padding-block `space-10→12` (mobile), `space-12→16` (desktop); footer gap `space-6→8`, padding-top `space-8→10`; desktop spec padding `clamp(space-16→20)→clamp(space-20→24)` block; `text-wrap: balance` no `.sobre-title` (web-design-guidelines: headings); `font-variant-numeric: tabular-nums` no `.sobre-kpi__val` (web-design-guidelines: numeric columns)

---

## [2026-05-14] REFACTOR — #sobre: spec sheet rows → KPI Grid (ui-ux-pro-max)

**Agente:** Claude Code
**Sessão:** Refatoração completa da ficha técnica — KPI Grid visual

### Alterado
- `index.html` — Seção `#sobre`: substituído `.sobre-spec__sheet` + `.sobre-spec__row` por `.sobre-spec__grid` com células `.sobre-kpi`; hero (22 anos) ocupa linha inteira (`--hero`); Unidades Produzidas + Capacidade Fabril ficam em 2 colunas; Estrutura ocupa linha inteira (`--wide`); valor vai acima, label abaixo
- `css/components/sobre.css` — Removidos: `.sobre-spec__sheet`, `.sobre-spec__row`, `.sobre-spec__key`, `.sobre-spec__dots`, `.sobre-spec__val`, `.sobre-spec__plus`, `.sobre-spec__unit` e seus overrides desktop; Adicionados: `.sobre-spec__grid` (gap 1px + bg branco para criar grid lines), `.sobre-kpi`, `.sobre-kpi--hero` (full-width + tint azul permanente + borda left accent), `.sobre-kpi--wide`, `.sobre-kpi__val`, `.sobre-kpi__key`, `.sobre-kpi__plus`, `.sobre-kpi__unit`; Hover usa apenas `background` (sem paint); Desktop: padding maior nas células; Reduced-motion atualizado; Subtitle contrast 0.45→0.62 (fix WCAG AA)

---

## [2026-05-14] STYLE — #sobre spec sheet: hover sweep, contraste e copy revisado

**Agente:** Claude Code
**Sessão:** frontend-design — hover row animation, paleta cinza-azul, copy update

### Alterado
- `index.html` — Spec sheet `#sobre`: removida row "Fundada 2004"; "Unidades" → "Unidades Produzidas"; "Estados 26" → "Capacidade Fabril 3000m²"; row order: Experiência (hero) → Unidades Produzidas → Capacidade Fabril → Estrutura
- `css/components/sobre.css` — Row hover: sweep `background-size 0→100%` com gradiente azul + `box-shadow: inset 2px` accent lateral; key acende para `--color-steel` (#A7B0BA); dots ficam azuis; valores normais acendem em `--color-primary-light`; row hero ganha `text-shadow` glow; transições em `key`, `dots`, `val`; `min-width` key atualizado para `9.5rem` (mobile) / `10.5rem` (desktop); `prefers-reduced-motion` cobre todos novos elementos

---

## [2026-05-14] STYLE — Coluna esquerda #sobre: hierarquia, cores e novos elementos

**Agente:** Claude Code
**Sessão:** Melhoria da coluna de spec sheet — tipografia, hierarquia e layout

### Alterado
- `css/components/sobre.css` — Adicionados: `.sobre-kicker-wrap` (flex row), `.sobre-kicker__rule` (linha 2rem accent color), `.sobre-subtitle` (texto muted abaixo do título), `.sobre-spec__row--hero` (highlight azul na row de destaque), `.sobre-spec__statement` (frase bold no rodapé); Footer ganhou `border-top` separador e `padding-top`; Opacidades ajustadas: `--spec__key` 0.3→0.45, `--spec__dots` 0.1→0.15, `--spec__copy` 0.38→0.55; `--spec__val` font-weight 300→400; Row padding desktop `space-5→space-6`
- `index.html` — Seção `#sobre`: kicker recebeu wrapper com rule span; `<p class="sobre-subtitle">` adicionado; row Experiência ganhou classe `--hero`; `<p class="sobre-spec__statement">` inserida antes do copy

---

## [2026-05-14] FEAT — Subpáginas Produtos, Clientes e Sobre + navbar atualizada

**Agente:** Claude Code
**Sessão:** Criação das subpáginas e atualização de navegação

### Criado
- `produtos.html` — Subpágina com hero, cards das 3 linhas e footer completo
- `clientes.html` — Subpágina com grid de 6 depoimentos de clientes e CTA final
- `sobre.html` — Subpágina com stats, layout split, grid de valores e CTA final

### Alterado
- `index.html` — Navbar: "Depoimentos" renomeado para "Clientes"; links `#produtos`, `#depoimentos`, `#sobre` trocados por `./produtos.html`, `./clientes.html`, `./sobre.html`; footer atualizado para refletir mesmos links

---

## [2026-05-13] FEAT — Efeitos de iluminação e animação na seção #produtos

**Agente:** Claude Code
**Sessão:** Cursor spotlight, parallax, rail indicator, reveal de entrada

### Alterado
- `css/components/produtos.css` — Spotlight seguindo cursor: `--mouse-x/y` no `.produtos-stage`, `::after` com `radial-gradient + mix-blend-mode: screen`, `opacity: 0→1` ao hover; Rail indicator desktop: `.produtos-rail__item::after` com `scaleX(0→1)` ao `.is-active`, `transform-origin: left`
- `css/animations.css` — Estado `cursor--view`: dot some (`opacity: 0`), follower expande para 60px com borda branca sutil
- `js/animations/produtos-tabs.js` — Desktop: spotlight via `pointermove` + `rAF` atualizando CSS vars; parallax na `.produto-figure` ativa (`±12px X, ±6px Y`), reset ao `pointerleave`; reveal de entrada dos rail items (`autoAlpha + y` com stagger, dispara no `onEnter` do ScrollTrigger)
- `js/animations/cursor.js` — Detecta `[data-cursor="view"]` e aplica classes `cursor--view` ao entrar/sair do stage
- `index.html` — `data-cursor="view"` adicionado ao `.produtos-stage`

---

## [2026-05-13] STYLE — Refactor visual #produtos: image cover + tipografia Figma

**Agente:** Claude Code
**Sessão:** Alinhamento com export PNG 2x do Figma — análise das imagens reais

### Alterado
- `css/components/produtos.css` — Desktop: `.produto-figure` agora usa `position: absolute; inset: 0; width/height: 100%` preenchendo o stage inteiro (antes era width clamp com aspect-ratio 9:16); `.produto-figure img` alterado para `object-fit: cover; object-position: center 40%` aproveitando o fundo preto baked-in das imagens; `.produto-figure::before` (glow CSS) oculto no desktop (spotlight já existe nas imagens); `.produto-panel` removido `display: flex` (figure é absolute, flex era irrelevante); `.produtos-line-name` aumentado de `3.8vw` para `clamp(text-5xl, 6vw, text-hero)` para bater com as proporções do Figma; `.produtos-line-name__prefix` sobrescrito para `font-size: 1em` + `color: white` — stacked display com "LINHA" e "LEVE" no mesmo tamanho

---

## [2026-05-13] FEAT — Redesign editorial completo da seção #produtos (frontend-design + ui-ux-pro-max)

**Agente:** Claude Code
**Sessão:** Redesign profissional #produtos — layout cinematic split

### Alterado
- `index.html` — Adicionados: `.produtos-kicker` (linha + label mono), `.produtos-ghost-num` (número decorativo), `.produtos-progress` (contador 01/03 no stage); CTA alterado de `btn--outline` para `btn--split btn--split-outline` no desktop; `.produto-panel__copy` mobile atualizado com `.produto-panel__kicker` no lugar de `.produto-panel__line-name`
- `css/components/produtos.css` — Redesign completo: painel esquerdo alargado para `clamp(300px, 36%, 420px)`; kicker com linha horizontal (padrão hero); ghost number decorativo (`opacity: 0.04`, fonte Machado, 7-11rem); stage com fade lateral esquerda (`::before` gradient preto→transparente); imagem aumentada para `clamp(420px, 88%, 820px)` com produto ancorado no fundo (`align-items: flex-end`); progresso `01/03` no canto inferior do stage; glow expandido (80% largura, opacity 0.18); rail com `rgba(255,255,255,0.3)` inativo → branco ativo
- `js/animations/produtos-tabs.js` — `updateLineContent` expandido: atualiza `.produtos-ghost-num` (fade+scale ao trocar) e `[data-produtos-current]` (progresso); ghost number tem animação scale in/out independente dos demais targets

---

## [2026-05-13] REFACTOR — Seção #produtos simplificada: galeria removida, estilo hero-style

**Agente:** Claude Code
**Sessão:** Simplificação produtos — imagem única por linha + estilo fundo escuro

### Alterado
- `index.html` — Seção #produtos reescrita: galeria multi-imagem removida; cada painel agora usa `<figure class="produto-figure">` com a imagem principal (`leve.png`, `media.png`, `pesada.png`); adicionado `.produto-panel__copy` (nome + desc + CTA) visível apenas no mobile; `.produtos-copy` (com `.produtos-line-desc` e `.produtos-line-cta`) adicionado ao `.produtos-left` para desktop; `data-desc` e `data-href` adicionados aos botões do rail
- `css/components/produtos.css` — CSS reescrito: removidos `.produto-gallery`, thumbs, sweep animation, controles prev/next; adicionados `.produtos-copy`, `.produtos-line-desc`, `.produtos-line-cta`; `.produto-figure` com `aspect-ratio: 9/16`, `object-fit: contain` e glow radial (`--color-primary`) sob o produto; desc e CTA ocultos no mobile, visíveis no desktop ≥1024px; `.produto-panel__copy` oculto no desktop
- `js/animations/produtos-tabs.js` — Lógica de galeria inteiramente removida (stopGallery, showGalleryItem, scheduleGallery, activateGallery, autoplay, thumbs, counter, prev/next); `updateLineName` substituído por `updateLineContent` que atualiza também `.produtos-line-desc` e href do `.produtos-line-cta` via `data-*` dos botões do rail; `animatePanel` simplificada para animar apenas `.produto-figure`

### Imagens agora utilizadas
- `assets/images/produtos/leve.png` — 900×1600 (9:16)
- `assets/images/produtos/media.png` — 900×1600 (9:16)
- `assets/images/produtos/pesada.png` — 900×1600 (9:16)

---

## [2026-05-12] CONTENT — Pilares: corpo de texto substituído por keywords técnicas

**Agente:** Claude Code
**Sessão:** Refatoração section-by-section — Diferenciais

### Alterado
- `index.html` — Parágrafos `<p class="diferencial-step__text">` de cada pilar substituídos por `<p class="diferencial-step__chips">` com 3 keywords separadas por ponto médio (·): 01 Certificado·Rígido·Durável / 02 Corte·Solda·Acabamento / 03 Direta·Clara·Sem intermediários / 04 Escolha·Instalação·Pós-venda
- `css/components/diferenciais.css` — `.diferencial-step__text` renomeado para `.diferencial-step__chips`; estilo alterado para mono uppercase xs com `letter-spacing: 0.09em` e cor muted; gap do `.diferencial-step__content` reduzido de `--space-3` para `--space-2`

---

## [2026-05-12] CHORE — Seção #social-proof removida a pedido do cliente

**Agente:** Claude Code
**Sessão:** Refatoração section-by-section

### Removido
- `index.html` — Seção `#social-proof` (comentário + markup completo) removida; `<link>` para `social-proof.css` removido do `<head>`

---

## [2026-05-12] FEAT — Galeria de produtos com destaque + coluna de miniaturas

**Agente:** Claude Code
**Sessão:** Refatoração section-by-section — Produtos Visual Showcase

### Alterado
- `index.html` — Itens e controles de cada `.produto-gallery` envolvidos em `.produto-gallery__main`
- `css/components/produtos.css` — Desktop: `.produto-gallery` vira grid `1fr 80px`; `.produto-gallery__main` ocupa coluna 1 (imagem destaque); `.produto-gallery__thumbs` viram coluna 2 vertical com `flex: 1` por thumb; thumbs estilizados com `border`, hover e `is-active` com `--color-primary`; sweep animation migrada de `.produto-gallery` para `.produto-gallery__main`
- `js/animations/produtos-tabs.js` — Counter appended ao `gallery__main`; thumbs appended ao `gallery`; `sweepTarget` usa `galleryState.mainEl` quando disponível; `mainEl` adicionado ao estado de cada gallery

---

## [2026-05-12] STYLE — Refatoração proporcional do layout #Produtos com CSS Grid

**Agente:** Claude Code
**Sessão:** Refatoração section-by-section — Produtos Visual Showcase

### Alterado
- `css/components/produtos.css` — Layout reescrito com CSS Grid: `.produtos-shell` usa `grid-template-columns: minmax(260px, 340px) 1fr` no desktop (antes `flex: 34%/66%`); `.produtos-left` usa `grid-template-rows: auto 1fr` para rail no topo e nome ancorado no fundo; font-size do `.produtos-line-name` corrigido de `clamp(4rem, 20vw, 6rem)` para `clamp(var(--text-5xl), 3.5vw, var(--text-6xl))` no desktop e `clamp(var(--text-4xl), 9vw, var(--text-6xl))` no mobile; `.produto-panel__line-name` reduzido de `clamp(2.5rem, 14vw, 3.5rem)` para `clamp(var(--text-3xl), 7vw, var(--text-4xl))`; `.section` padding-block zerado via `padding-block: 0`; adicionado `border-right` sutil no painel esquerdo; padding do painel esquerdo racionalizado

---

## [2026-05-12] FEAT — Redesign visual da seção #Produtos

**Agente:** Claude Code
**Sessão:** Refatoração section-by-section — Produtos Visual Showcase

### Alterado
- `index.html` — Seção #produtos reescrita: removidos header, kicker, tagline, capacidade kg, specs (dl), CTA e tag; estrutura agora é split layout (`.produtos-left` + `.produtos-stage`); rail simplificado (só número + nome, sem meta/kg); adicionado `.produtos-line-name` com tipografia Machado no painel esquerdo; adicionado `data-line-suffix` nos botões do rail; inserido `.produto-panel__line-name` em cada painel para mobile
- `css/components/produtos.css` — CSS completamente reescrito: fundo `--color-black`, split 34%/66% no desktop via flexbox, rail vertical com border-left ativo no desktop, nome da linha em Machado font `clamp(4.5rem, 5.5vw, 7.5rem)`, galeria full-bleed com `aspect-ratio: 4/5` mobile / `height: 100%` desktop, painéis sobrepostos via `position: absolute` apenas ≥1024px, thumbs ocultados via `display: none`, grid texture no painel esquerdo igual ao hero
- `js/animations/produtos-tabs.js` — `animatePanel` simplificada (só galeria); adicionada `updateLineName()` com animação out/in do sufixo ao trocar linha; `setActive` chama `updateLineName`; mobile scroll animation atualizada para `.produto-gallery` e `.produto-panel__line-name`

---

## [2026-05-10] STYLE — Grafite e microanimações em Produtos

**Agente:** Codex
**Sessão:** Acentos em #333333 e movimento leve

### Alterado
- `css/components/produtos.css` — seção Produtos passou a usar o token grafite `--color-menu-bg` em estados ativos, labels técnicos, número de capacidade, linha superior do painel e hover dos chips; adicionadas microanimações de varredura na galeria e acento superior do painel
- `js/animations/produtos-tabs.js` — troca de imagem ganhou escala sutil na foto ativa e entrada leve das thumbnails durante a troca de painel

## [2026-05-10] FIX — Ajuste de overflow no painel de Produtos

**Agente:** Codex
**Sessão:** Refinamento de container direito em Produtos

### Alterado
- `index.html` — título da seção Produtos foi simplificado para “Equipamentos”
- `css/components/produtos.css` — painel técnico da direita recebeu limites de largura, quebra segura de texto, escala menor para capacidade e ajustes responsivos para evitar estouro do conteúdo

## [2026-05-10] STYLE — Vitrine visual da seção Produtos

**Agente:** Codex
**Sessão:** Produtos com mais imagens e menos texto

### Alterado
- `index.html` — reduzida a carga textual da seção Produtos, removendo bullets repetitivos, parágrafos por linha e CTA secundário para deixar a decisão mais visual e direta
- `css/components/produtos.css` — mídia da seção Produtos ganhou mais peso no desktop, specs passaram a funcionar como chips compactos e a galeria recebeu contador e thumbnails visíveis
- `js/animations/produtos-tabs.js` — galerias agora geram thumbnails navegáveis, exibem contador de imagem e preservam a foto escolhida ao alternar entre linhas de produto

## [2026-05-10] FIX — Grid estrutural da seção Produtos

**Agente:** Codex
**Sessão:** Auditoria de grid e alinhamento vertical

### Alterado
- `css/components/produtos.css` — seção Produtos passou a usar uma malha desktop única com três colunas compartilhadas entre header, trilho, imagem e conteúdo técnico, reduzindo desalinhamentos causados por grids independentes

## [2026-05-10] STYLE — Refinamento dos controles e trilho de Produtos

**Agente:** Codex
**Sessão:** Ajuste de ícones e proporção do trilho lateral

### Alterado
- `index.html` — controles da galeria de Produtos trocaram setas textuais por SVGs acessíveis com `aria-label` e `title`
- `css/components/produtos.css` — trilho lateral desktop passou a ocupar a mesma altura do palco/imagem, com cards elásticos e alinhamento visual mais consistente; painéis inativos deixaram de interceptar cliques na galeria ativa

## [2026-05-10] FIX — Refinamento visual e pin da seção Produtos

**Agente:** Codex
**Sessão:** Auditoria crítica Playwright e UI UX Pro Max

### Alterado
- `index.html` — textos da seção Produtos foram encurtados para reduzir competição com a imagem e melhorar clareza comercial
- `css/components/produtos.css` — ajustada escala tipográfica, proporção da imagem, altura do palco, alinhamento do trilho e densidade vertical do painel técnico no desktop; em tablet/mobile, a mídia recebeu largura máxima para não alongar demais os painéis
- `js/animations/produtos-tabs.js` — reduzida a distância do pin por painel para tornar a troca mais natural e menos presa

## [2026-05-10] FIX — Ajuste fullscreen da seção Produtos

**Agente:** Codex
**Sessão:** Auditoria Playwright em desktop 1920x1080

### Alterado
- `css/components/produtos.css` — reduzida a altura do palco/imagem no desktop, ampliada a largura útil dos títulos, centralizado o trilho de produtos e ajustado o grupo de CTAs para evitar aperto vertical em fullscreen
- `index.html` — removido o preload manual da fonte display, mantendo o carregamento via `@font-face` e eliminando avisos do Chromium

## [2026-05-10] FIX — Validação responsiva da seção Produtos

**Agente:** Codex
**Sessão:** Correção pós-auditoria Playwright

### Alterado
- `css/components/produtos.css` — trilho mobile/tablet deixou de ser sticky e painéis receberam margem de rolagem para evitar sobreposição com a navbar
- `js/animations/produtos-tabs.js` — navegação mobile/tablet passou a calcular offset de scroll pela altura da navbar, evitando que o produto ativo fique coberto
- `css/reset.css` — adicionado bloqueio de overflow horizontal no eixo X para conter elementos fixos/animados fora da viewport em mobile

## [2026-05-10] STYLE — Redesign comercial premium da seção Produtos

**Agente:** Codex
**Sessão:** Vitrine de produtos com decisão por linha

### Alterado
- `index.html` — seção Produtos reconstruída como vitrine comercial com header vendedor, trilho de escolha por linha, painéis com capacidade dominante, specs objetivas e CTAs específicos por produto
- `css/components/produtos.css` — layout da seção redesenhado para desktop pinado e mobile empilhado, com trilho sticky, moldura de imagem, specs em régua técnica e hierarquia visual mais forte
- `js/animations/produtos-tabs.js` — interação refatorada para alternar painéis por scroll/nav, preservar galerias por produto, respeitar `prefers-reduced-motion` e bloquear foco nos painéis inativos no desktop
- `js/gsap-setup.js` — registro de plugins GSAP ficou defensivo para evitar quebra caso o CDN do SplitText não carregue

## [2026-05-10] STYLE — Espaço entre retângulos do botão split

**Agente:** Codex
**Sessão:** Ajuste de gap do componente button

### Alterado
- `css/variables.css` — adicionado token de gap para o botão split
- `css/layout.css` — aplicado espaçamento de 6px entre o label e o retângulo do `+`
- `js/animations/button-swap.js` — cálculo da troca horizontal passa a considerar o gap entre os retângulos

## [2026-05-10] STYLE — Botão split sem movimento magnético

**Agente:** Codex
**Sessão:** Ajuste de hover do componente button

### Alterado
- `css/layout.css` — removido o deslocamento vertical e a escala do `+` no hover/active dos botões split, mantendo as trocas visuais e a animação horizontal dos retângulos
- `js/animations/magnetic.js` — botões split deixam de participar da animação magnética por cursor, preservando o bloco fixo na tela

## [2026-05-09] STYLE — Refinamento da seção de pilares

**Agente:** Codex
**Sessão:** Ajuste de hierarquia e pin dos diferenciais

### Alterado
- `index.html` — removido o pilar “Entrega em Todo o Brasil”, renumerado “Suporte Técnico Especializado” para o quarto item e ajustada a sequência de imagens dos pilares para quatro estados
- `css/components/diferenciais.css` — refinada a hierarquia entre título da seção e tópicos, ampliado o espaçamento vertical dos itens e centralizado o bloco da seção durante o pin desktop

## [2026-05-09] STYLE — Aproximação tipográfica da prova social

**Agente:** Codex
**Sessão:** Ajuste de stats inspirado na referência

### Alterado
- `css/components/social-proof.css` — números da prova social refinados com família heading, peso leve, tracking negativo, line-height mais justo, padding editorial e labels mono mais secos; o indicador azul foi reposicionado para não deslocar o texto

## [2026-05-09] FIX — Hero com “PLATAFORMAS” sem corte

**Agente:** Codex
**Sessão:** Correção de clipping no título da hero

### Alterado
- `css/components/hero.css` — ajustada a escala desktop do título e a folga lateral das linhas display para evitar corte visual da palavra “PLATAFORMAS”, preservando o texto plural já existente no HTML

## [2026-05-09] CHORE — Preservação do layout aprovado da prova social

**Agente:** Codex
**Sessão:** Ajuste pós-auditoria — prova social

### Alterado
- `CHANGELOG.md` — registrado que o ajuste proposto para `.stats-container` foi descartado e que o layout aprovado da prova social foi preservado sem alteração final no CSS

## [2026-05-09] FIX — Auditoria geral de UI, estrutura e UX

**Agente:** Codex
**Sessão:** Implementação pós-auditoria — UI/UX Pro Max

### Alterado
- `index.html` — removido import morto de galeria, corrigido skip link para `#main`, adicionada região `<main>`, ajustados links mortos/âncoras, removidos links sociais vazios, corrigidos atributos inválidos de logo, adicionadas dimensões nas imagens de produto e refinados labels acessíveis
- `css/variables.css` — adicionados tokens semânticos para transparências e sombras reutilizáveis, evitando valores soltos nos componentes
- `css/layout.css` — removido `!important`, trocadas sombras/transparências por tokens, adicionados `scroll-margin-top` em seções e `text-wrap: balance` em headings
- `css/components/produtos.css` — controles passaram a usar token de borda em vez de cor solta
- `css/components/financiamento.css` — animação da linha superior do painel deixou de rodar infinitamente e passou a ser um reveal discreto
- `js/main.js` — entry point simplificado para importar módulos específicos de navbar, galeria da seção Sobre e microinteração dos botões

### Criado
- `js/animations/navbar.js` — módulo da navbar com abertura/fechamento, indicador e leitura de tema agendada via `requestAnimationFrame`
- `js/animations/sobre-gallery.js` — módulo dedicado ao carrossel da seção Sobre com guard clause e autoplay via GSAP `delayedCall`
- `js/animations/button-swap.js` — módulo dedicado à microinteração dos botões split

### Removido
- `css/components/galeria.css` — arquivo morto após remoção da seção `#galeria` e do import correspondente
- `css/components/contato.css` — arquivo morto após remoção prévia da seção de contato e do import correspondente

## [2026-05-09] STYLE — Refinamento premium do footer institucional

**Agente:** Codex
**Sessão:** Footer premium — ui-ux-pro-max

### Alterado
- `index.html` — footer ajustado para estrutura institucional enxuta com marca/tagline, navegação central, contato clicável, copyright 2026 e assinatura “Machado Plataformas” em title case no fundo
- `css/components/footer.css` — grid do footer refinado para três colunas, links de contato estilizados, marca d'água preservada com `--font-display`, respiro amplo e responsividade sem quebrar a assinatura gigante

---

## [2026-05-09] STYLE — Redesign editorial industrial do footer

**Agente:** Codex
**Sessão:** Footer referência Good Fella

### Alterado
- `index.html` — footer reorganizado sem bloco de inscrição, com navegação, linhas de produto, CTA de orçamento preservado, status comercial e assinatura `MACHADO PLATAFORMAS` como elemento visual de fundo
- `css/components/footer.css` — rodapé reconstruído com layout editorial escuro, marca gigante translúcida usando a fonte display da HERO, grid técnico, hover/focus em links e CTA, e responsividade para mobile/tablet/desktop
- `js/animations/scroll-triggers.js` — animação da headline do footer ajustada para revelar a assinatura como marca d'água translúcida em vez de texto opaco

---

## [2026-05-09] STYLE — Redesign visual e interativo da seção financiamento

**Agente:** Codex
**Sessão:** UI/UX financiamento — ui-ux-pro-max

### Alterado
- `index.html` — seção `#financiamento` reestruturada com copy reduzida, painel visual com imagem real de produto, etapas curtas de negociação e cards de condição/pagamento clicáveis para WhatsApp
- `css/components/financiamento.css` — componente reconstruído com grid responsivo, painel visual, cards interativos com hover/focus, animação sutil, estados acessíveis e suporte a `prefers-reduced-motion`

---

## [2026-05-09] FIX — Correção de sobreposição dos botões da CTA

**Agente:** Codex
**Sessão:** Ajuste CTA buttons

### Alterado
- `css/components/cta-interstitial.css` — botões dentro de `.cta-mid__btns` passam a manter fluxo em coluna com largura estável, label flexível e `max-width: 100%`, evitando sobreposição em labels longos e no efeito split

---

## [2026-05-09] FIX — Retorno do enquadramento cover para imagens de produto

**Agente:** Codex
**Sessão:** Preferência por redimensionamento manual das imagens

### Alterado
- `css/components/produtos.css` — revertido o uso de `object-fit: contain` e frame `16 / 11`; produtos voltam ao enquadramento original com `object-fit: cover` e proporção `4 / 5`
- `css/components/cta-interstitial.css` — removidos padding/fundo interno da imagem do CTA e restaurado `object-fit: cover`

---

## [2026-05-09] FIX — Ajuste profissional de enquadramento das imagens de produto

**Agente:** Codex
**Sessão:** Imagens de tamanhos diversos sem corte

### Alterado
- `css/components/produtos.css` — imagens da seção de produtos passam a usar frame horizontal estável `16 / 11` com `object-fit: contain`, padding interno e fundo controlado para evitar cortes em assets de proporções diferentes
- `css/components/cta-interstitial.css` — imagem do CTA passa a usar `aspect-ratio: 16 / 11` e `object-fit: contain`, preservando a visualização completa do produto

---

## [2026-05-09] FIX — Correção de caminhos das imagens PNG de produtos

**Agente:** Codex
**Sessão:** Ajuste de assets atualizados

### Alterado
- `index.html` — atualizadas as referências de `LEVE-1`, `MEDIA-1` e `PESADA-1` de `.jpg` para `.png`, incluindo a imagem do CTA e os primeiros slides das linhas de produto

---

## [2026-05-09] STYLE — Reequilíbrio visual da CTA intermediária

**Agente:** Codex
**Sessão:** UI/UX CTA — revisão de composição

### Alterado
- `index.html` — `#cta-mid`: reorganizada a ordem do conteúdo para priorizar mensagem, botões e pontos de confiança antes da imagem em mobile; headline encurtada e sem pontuação final para melhorar leitura
- `css/components/cta-interstitial.css` — CTA simplificada para layout split card: copy e ações integradas à esquerda, imagem de produto à direita sem sobreposição, tipografia reduzida, menos peso visual, trust points integrados e breakpoints ajustados para mobile/tablet/desktop

---

## [2026-05-09] STYLE — Redesign premium da seção CTA intermediária

**Agente:** Codex
**Sessão:** UI/UX CTA — ui-ux-pro-max

### Alterado
- `index.html` — seção `#cta-mid` refatorada com composição em três blocos: copy comercial direta, visual real de produto e área de ação com botão principal, botão secundário e linha de confiança; links de WhatsApp preservados
- `css/components/cta-interstitial.css` — componente CTA reconstruído com layout responsivo, contraste industrial, moldura técnica, imagem integrada, hierarquia de botões, hover sutil em desktop e suporte a `prefers-reduced-motion`

---

## [2026-05-09] STYLE — Redesign premium da seção de depoimentos

**Agente:** Codex
**Sessão:** UI/UX testimonials — ui-ux-pro-max

### Alterado
- `index.html` — seção `#depoimentos` refatorada com header mais forte, subtítulo, resumo de confiança com números já existentes, três cards curtos com rating, tipo de projeto e metadados de cliente/localidade; removidos placeholders externos de foto e navegação de carrossel
- `css/components/depoimentos.css` — componente `.depoimento-card` redesenhado como card reutilizável premium, com grid responsivo, hierarquia tipográfica, bordas/acento azul, avatars por iniciais, hover discreto em desktop e suporte a `prefers-reduced-motion`
- `js/main.js` — removida a inicialização e a função do antigo carrossel de depoimentos, já sem uso no novo layout em grid

---

## [2026-05-09] CONTENT — Reordenação de depoimentos e CTA

**Agente:** Codex
**Sessão:** Feedback do cliente — reorganizar estrutura

### Alterado
- `index.html` — bloco `#depoimentos` seguido de `#cta-mid` movido para imediatamente após `#diferenciais`, sem alterar markup interno, estilos ou scripts

---

## [2026-05-09] CONTENT — Remoção da seção de contato

**Agente:** Codex
**Sessão:** Feedback do cliente — remover seção contato

### Alterado
- `index.html` — removida a seção `#contato` completa conforme feedback do cliente; removido o stylesheet `css/components/contato.css` da página; links de menu e rodapé para `#contato` removidos; CTAs de orçamento que apontavam para o formulário agora abrem o WhatsApp para evitar âncoras quebradas
- `js/main.js` — removida a inicialização e a função do formulário de contato, já sem uso após a exclusão da seção

---

## [2026-05-09] STYLE — Refatoração do componente section-heading: visual premium sem caixa, animação refinada

**Agente:** Claude Code
**Sessão:** Revisão UI/UX — section-heading (ui-ux-pro-max)

### Alterado
- `css/layout.css` — `.section-heading`: removidos `background-color`, `border`, `padding` e `box-sizing` (não existe mais a caixa branca); removidos tokens `--heading-surface` e `--heading-border`; novo token `--heading-rule` (cor da linha); grid invertido de `minmax(0, 1fr) auto` para `auto 1fr` (meta auto, rule preenche o restante); `align-items: center` substitui `start`; `width: 100%` na rule (era `clamp(4rem, 8vw, 7rem)`) para animação da linha em largura total; `line-height: 1.05` e `letter-spacing: -0.01em` no title (era `1` e `0`); `white-space: nowrap` adicionado ao meta; `margin-top: 0.45rem` removido da rule (agora alinhada pelo grid)
- `css/layout.css` — Novo elemento `.section-heading__subtitle`: `grid-column: 1 / -1`, `color: var(--color-text-muted)`, `font-size: var(--text-base)`, `line-height: 1.6` — suporte a subtítulos opcionais
- `css/layout.css` — Removido bloco `@media (max-width: 767px)` com override do grid para `1fr` — não necessário com o novo layout `auto 1fr`
- `css/components/financiamento.css` — `.financiamento .section-heading`: removidos `--heading-surface` e `--heading-border`; renomeado `--heading-border` para `--heading-rule`
- `css/components/produtos.css` — Adicionado `.produtos-header .section-heading__rule { width: clamp(4rem, 8vw, 7rem) }` — restaura largura fixa da rule no contexto de grid `auto` da header absoluta dos produtos
- `js/animations/scroll-triggers.js` — Animação `section-heading`: square agora anima de `opacity: 0` para `opacity: 1` durante o percurso; `subtitle` adicionado ao array `parts`; `y` ajustado de `18` para `14`; `stagger` ajustado de `0.08` para `0.1`

---

## [2026-05-09] STYLE — Refatoração do sistema de botões: qualidade premium, consistência e acessibilidade

**Agente:** Claude Code
**Sessão:** Revisão UI/UX — sistema de botões (ui-ux-pro-max)

### Alterado
- `css/layout.css` — `.btn`: adicionado `user-select: none`; transition atualizada para `--ease-premium` (era `ease` genérico); adicionada transição de `box-shadow`
- `css/layout.css` — `.btn::before`: easing atualizado para `--ease-premium`
- `css/layout.css` — Novo bloco `[disabled]` / `[aria-disabled="true"]`: `opacity: 0.42 + pointer-events: none` — estado universal para botões desabilitados
- `css/layout.css` — `.btn--split .btn__label, .btn__plus`: `min-height` aumentado de `2.5rem` (40px) para `2.75rem` (44px) — atende requisito de touch target; adicionada `transform 180ms var(--ease-premium)` à lista de transições
- `css/layout.css` — `.btn--split-primary .btn__label`: adicionado `box-shadow: inset 0 1px 0 rgba(255,255,255,0.1)` — profundidade sutil no resting state
- `css/layout.css` — `.btn--split-primary:hover .btn__label`: box-shadow atualizado para incluir o inset highlight mais a sombra externa
- `css/layout.css` — Novo bloco `.btn--split:hover .btn__plus { transform: scale(1.1) }` e `.btn--split:active .btn__plus { transform: scale(0.93) }` — microinteração compartilhada em todos os splits
- `css/layout.css` — `.btn--whatsapp`: adicionado hover com `box-shadow` suave
- `css/layout.css` — Novos modificadores de tamanho: `.btn--split--sm` e `.btn--split--lg`
- `css/components/depoimentos.css` — `.dep-btn`: adicionado `background-color: transparent`; transitions atualizadas para `--ease-premium` e inclui agora `transform`; hover com `translateY(-2px)`; novo estado `:active`
- `css/components/produtos.css` — `.produto-gallery__btn, .produtos-arrow`: transitions aceleradas (`--dur-normal` → `--dur-fast`) com `--ease-premium`; adicionado `user-select: none`; novo estado `:active`
- `css/animations.css` — `prefers-reduced-motion`: adicionadas regras para suprimir transforms de `.dep-btn`, `.produto-gallery__btn` e `.produtos-arrow` no modo de movimento reduzido

---

## [2026-05-09] CONTENT — Ajustes cirúrgicos: CTA reposicionado, copy compactado, header de contato removido

**Agente:** Claude Code
**Sessão:** Refinamentos pós-prévia — feedback do cliente

### Alterado
- `index.html` — Seção `#cta-mid` movida de entre `#sobre` e `#financiamento` para após `#depoimentos` (fluxo: Depoimentos → CTA → Contato)
- `index.html` — `#contato`: removido o `section-header` com h2 "Fale com a Machado" e eyebrow "Orçamento"; `aria-labelledby` substituído por `aria-label="Formulário de orçamento"`
- `index.html` — Hero: subtítulo compactado de frase longa para 2 frases curtas e diretas
- `index.html` — Seção `#sobre`: segundo parágrafo de copy encurtado ("Fabricação 100% própria em MG. Controle de qualidade em cada unidade.")
- `index.html` — Seção `#financiamento`: lead encurtado (entrada direta pelas opções de pagamento); parágrafo do panel encurtado para 2 frases curtas

---

## [2026-05-09] FIX — Hero: título completo sem corte

**Agente:** Claude Code
**Sessão:** Correção do overflow no título "PLATAFORMAS"

### Alterado
- `css/components/hero.css` — coluna esquerda do grid alargada de `0.86fr` para `1.1fr` (`.hero-media` é `position: absolute`, não ocupa grid); font-size do título em `1024px+` reduzido de `var(--text-hero)` (6rem fixo) para `clamp(3rem, 4vw, 4.5rem)`; font-size em `1280px+` ajustado de `clamp(6rem, 7vw, 7.5rem)` para `clamp(3.5rem, 4vw, 5rem)` — elimina o corte de "PLATAFORMAS" causado por `overflow: hidden` da animação de reveal

---

## [2026-05-09] STYLE — Cor cinza do menu restaurada

**Agente:** Claude Code
**Sessão:** Reversão da cor --color-menu-bg

### Alterado
- `css/variables.css` — `--color-menu-bg` revertido de `#252E3C` para `#333333` (cinza original que gerava bom contraste na navbar aberta, painéis e controles de produto)

---

## [2026-05-09] FIX — Auditoria UI/UX: acessibilidade, tokens e contraste

**Agente:** Claude Code
**Sessão:** Auditoria ui-ux-pro-max + web-design-guidelines + implementação

### Alterado
- `css/reset.css` — removido `outline: none` global; adicionado `focus-visible` seguro (2px solid primary-light) e componente `.skip-link` com posicionamento via `:focus-visible`
- `index.html` — adicionado `<link rel="preload">` para a fonte Machado; `<a class="skip-link">` como primeiro filho do body; atributos `width`/`height` nas imagens `.navbar-card` (320×224), `.stat-media-card` (440×600) e `.diferenciais` (640×800)
- `css/variables.css` — `--color-menu-bg` alterado de `#333333` (órfão) para `#252E3C` (paleta navy); adicionados `--weight-semibold: 600` e `--weight-bold: 700`
- `css/layout.css` — adicionado `touch-action: manipulation` ao seletor `.btn` (elimina delay de 300ms no mobile)
- `css/components/hero.css` — font-size do título revisado para `clamp()` em todos os breakpoints; usa token `var(--text-hero)` em vez de valor absoluto
- `css/components/footer.css` — removido `opacity: 0` permanente de `.footer-headline`; adicionado padrão `.js-ready .footer-headline { opacity: 0 }` (seguro caso JS falhe); font-size usa `var(--text-hero)`
- `css/components/social-proof.css` — adicionado `font-variant-numeric: tabular-nums` em `.stat-number`; font-size usa `var(--text-hero)`
- `css/components/produtos.css` — removidos hovers em `.produto-slide__title/specs/extra` (anti-pattern UX); contraste de `.produto-slide__spec-row dt` corrigido de `var(--color-bg-light) opacity:0.65` (~2.77:1, WCAG fail) para `var(--color-primary)`
- `css/components/navbar.css` — `padding-inline: 60px` substituído por `var(--container-padding)` no breakpoint 1024px
- `css/components/cta-interstitial.css` — `.cta-mid__headline` font-size de `3.25rem` para `clamp(var(--text-4xl), 6vw, var(--text-hero))`
- `js/main.js` — adicionado `document.documentElement.classList.add('js-ready')` no início de DOMContentLoaded
- `js/animations/diferenciais.js` — breakpoints `1024px`/`1023px` extraídos para constantes `BP_DESKTOP`/`BP_MOBILE`
- `js/animations/produtos-tabs.js` — breakpoints `1024px`/`1023px` extraídos para constantes `BP_DESKTOP`/`BP_MOBILE`

---

## [2026-05-07] CHORE — Plano de ajustes do feedback do cliente

**Agente:** Codex
**Sessão:** Planejamento sem implementação

### Criado
- `PLANO_FEEDBACK_CLIENTE.md` — documento com interpretação do feedback, nova estrutura sugerida, ajustes por seção, diretrizes de copy e prioridades de implementação

## [2026-05-07] CHORE — Ícone da página

**Agente:** Codex
**Sessão:** Favicon da landing page

### Alterado
- `index.html` — adicionado favicon PNG usando `assets/images/logo/Icon.png`

## [2026-05-07] STYLE — Cinza editorial em superfícies internas

**Agente:** Codex
**Sessão:** Aplicação pontual do cinza #333333

### Alterado
- `css/components/financiamento.css` — heading, painel e cards internos passam a usar `--color-menu-bg` como superfície de apoio sobre o fundo azul escuro
- `css/components/produtos.css` — controles de galeria e setas principais passam a usar `--color-menu-bg`, aproximando os controles do menu aberto
- `css/components/contato.css` — campos do formulário, opções do select e placeholder do mapa passam a usar `--color-menu-bg` para maior consistência nas seções escuras
- `css/components/footer.css` — botões sociais recebem superfície `--color-menu-bg`

## [2026-05-07] STYLE — Produtos com scroll mais suave

**Agente:** Codex
**Sessão:** Refinamento da animação dos slides de produtos

### Alterado
- `js/animations/produtos-tabs.js` — distância do ScrollTrigger desktop ampliada, transição horizontal do track desacelerada e entrada do slide ativo suavizada com menor deslocamento e duração maior

## [2026-05-07] STYLE — Financiamento em seção industrial escura

**Agente:** Codex
**Sessão:** Redesign da seção Financiamento

### Alterado
- `index.html` — seção `#financiamento` convertida para fundo escuro, heading técnico reutilizável, copy consultiva, painel de negociação e métodos de pagamento compactos
- `css/components/financiamento.css` — componente refeito com `--color-bg`, painel escuro, grid responsivo, microinterações de hover, square indicator e animação básica de linha no painel

## [2026-05-07] FIX — Badge da seção Sobre acima do carrossel

**Agente:** Codex
**Sessão:** Correção de sobreposição do badge

### Alterado
- `css/components/sobre.css` — `sobre-badge` recebeu camada explícita acima dos slides da galeria para evitar que imagens cubram o selo `DESDE 2004`

## [2026-05-07] FEAT — Sobre com carrossel e métricas atualizadas

**Agente:** Codex
**Sessão:** Ajustes da seção Quem Somos

### Alterado
- `index.html` — seção `#sobre` atualizada para 22 anos, badge `DESDE 2004`, métrica `4000+` unidades produzidas e galeria com imagens locais de `assets/images/sobre/`
- `css/components/sobre.css` — estilos do carrossel, dots de navegação, transições básicas, hover sutil e manutenção do layout responsivo da seção
- `js/main.js` — adicionada `initSobreGallery()` com autoplay via GSAP `delayedCall`, navegação por dots e animação inicial básica com `ScrollTrigger`

## [2026-05-07] FEAT — Botões split com swap animado + remoção da galeria

**Agente:** Claude Code
**Sessão:** Padronização de botões e limpeza de seções

### Alterado
- `css/layout.css` — sistema de botões split completamente redesenhado: novas variantes (`btn--split-primary`, `btn--split-outline`, `btn--split-ghost`, `btn--split-whatsapp`) com `box-shadow: inset` para bordas, `overflow: hidden` no container para clip do swap; `btn__label` sobe para `z-index: 2` e `btn__plus` fica em `z-index: 1` para texto ficar visível durante o cruzamento; removido `letter-spacing` hover que desalinhava a medição no JS; removido `transform: rotate(45deg)` dos hovers de variantes
- `css/variables.css` — adicionado `--ease-premium: cubic-bezier(0.22, 1, 0.36, 1)`
- `css/animations.css` — bloco `prefers-reduced-motion` atualizado com `btn--split`, `btn--split .btn__label`, `btn--split .btn__plus`, `btn--split:hover`
- `js/main.js` — adicionado `initButtonSwap()`: detecta `(hover: hover) e (pointer: fine)`, mede `offsetWidth` de label e plus no hover e anima ambos com GSAP (swap de posição — plus vai à esquerda, label vai à direita); `initContactForm` atualizado para buscar `.btn__label || span` no botão de submit; `initDepoimentos` usa ease `snap`
- `index.html` — todos os botões convertidos para padrão split: hero (primary + outline), produtos 3× (primary + outline por slide), sobre (ghost), cta-mid (primary + whatsapp), financiamento (outline), form submit (primary); seção `#galeria` removida inteiramente (80 linhas de HTML)

### Criado
- `prompts.md` — prompt completo para reimplementação da seção `#sobre` por agente externo

---

## [2026-05-07] FEAT — Produtos: scroll pin, specs dl/dt/dd, marker e dois CTAs

**Agente:** Claude Code
**Sessão:** Reaplicação das melhorias da seção Equipamentos (revertidas por engano junto com text-reveal)

### Alterado
- `js/animations/produtos-tabs.js` — desktop `mm.add` com `ScrollTrigger pin: true`; `onUpdate` avança slides pelo scroll (~90% vh por slide); cursor tracking do `.produto-slide__marker` via `gsap.quickTo`; `animatePanel` usa `.produto-slide__spec-row` (em vez de `specs p`); seletor mobile exclui `.produto-slide__marker`
- `css/components/produtos.css` — `::before` de `.produto-slide__text-inner` substituído por `.produto-slide__marker` (elemento real, `position: absolute`, GSAP-controlled); `.produto-slide__spec-row` com grid `7.5rem 1fr`, `dt` mono xs, `dd` base medium; `.produto-slide__cta` vira flex com gap; seta `.btn__icon` com hover `translateX(5px)`; reduced-motion atualizado
- `index.html` — 3 slides de produto: `<span class="produto-slide__marker">` adicionado; specs convertidas para `<dl>` + `<div class="produto-slide__spec-row">` com `<dt>/<dd>`; kickers `// 01 — Linha Leve / 02 — Linha Média / 03 — Linha Pesada`; CTA duplo "Solicitar Orçamento" (primary) + "Ver mais" (outline)

---

## [2026-05-07] STYLE — Produtos: grid profissional e controles reorganizados

**Agente:** Codex
**Sessão:** Redesign visual da seção Produtos

### Alterado
- `css/components/produtos.css` — seção Produtos redesenhada com grid desktop estável, palco de mídia uniforme, imagens/vídeo preenchendo proporção consistente, controles internos da galeria reposicionados e navegação global separada da área das fotos para evitar colisões
- `js/animations/produtos-tabs.js` — sincronização mobile agora também atualiza o produto ativo ao voltar o scroll pela seção

## [2026-05-05] CONTENT — Produtos: mídias numeradas por linha

**Agente:** Codex
**Sessão:** Classificação das imagens da galeria de produtos

### Alterado
- `index.html` — galerias de Linha Leve, Média e Pesada agora usam arquivos numerados por ordem, removendo referências antigas de WhatsApp e imagens pequenas

---

## [2026-05-05] FIX — Produtos: galeria sem corte

**Agente:** Codex
**Sessão:** Ajuste de enquadramento das mídias de produtos

### Alterado
- `css/components/produtos.css` — galeria recebeu respiro interno, itens passaram a respeitar inset responsivo e mídias usam limites de largura/altura para preservar o enquadramento
- `js/animations/produtos-tabs.js` — removido scale ativo da galeria para evitar corte visual em imagens e vídeos

---

## [2026-05-05] STYLE — Loader antigo com wipe diagonal

**Agente:** Codex
**Sessão:** Ajuste final da transicao do loader

### Alterado
- `css/animations.css` — loader antigo manteve visual original e recebeu `clip-path` inicial para wipe
- `js/loader.js` — saida vertical substituida por wipe diagonal com easing `wipe`, preservando quadrados e label antigos

---

## [2026-05-05] FIX — Loader visual antigo restaurado

**Agente:** Codex
**Sessão:** Reversao parcial do loader mantendo hero premium

### Alterado
- `css/animations.css` — loader voltou ao visual antigo com quadrados maiores e label visivel
- `js/loader.js` — animacao antiga dos quadrados e saida vertical restauradas, mantendo remocao do DOM no final e suporte a reduced motion

---

## [2026-05-05] FEAT — Produtos: galeria interna automatica

**Agente:** Codex
**Sessão:** Galeria com imagens, video e mini setas nos produtos

### Alterado
- `index.html` — areas de imagem de Linha Leve, Media e Pesada convertidas para galerias internas com ate 4 midias, incluindo video na Linha Media e mini setas por galeria
- `css/components/produtos.css` — adicionados estilos de `.produto-gallery`, itens empilhados, transicoes de fade/scale e mini controles responsivos
- `js/animations/produtos-tabs.js` — adicionada logica de estado por galeria, autoplay via `gsap.delayedCall`, reset ao trocar produto, mini setas internas e pausa/play de videos apenas na midia ativa

---

## [2026-05-05] FEAT — Hero premium reveal

**Agente:** Codex
**Sessão:** Loader curto, wipe diagonal e entrada editorial da hero

### Alterado
- `index.html` — imagem principal da hero marcada como `loading="eager"` e `decoding="async"` para priorizar LCP sem shift
- `css/animations.css` — loader convertido para tela fullscreen minimalista com fundo da marca, mini mark central e suporte a wipe diagonal por `clip-path`
- `css/components/hero.css` — adicionados masked text reveal, blocos de revelacao, fade/scale da imagem, textura discreta, spotlight via CSS variables e microinteracoes nos links da hero
- `css/layout.css` — hover dos botoes split ganhou deslocamento sutil e movimento horizontal no bloco de `+`
- `js/gsap-setup.js` — criado easing `wipe` com curva `0.76, 0, 0.24, 1`
- `js/loader.js` — loader refeito para durar aproximadamente 1.1s, remover o DOM ao concluir e respeitar `prefers-reduced-motion` sem `setTimeout`
- `js/animations/hero.js` — entrada da hero reescrita com block reveal, mascara por linha, imagem com fade/scale, cleanup de `will-change` e spotlight controlado por `--mouse-x`/`--mouse-y` em desktop

---

## [2026-05-05] FIX — Produtos: heading acompanha texto

**Agente:** Codex
**Sessão:** Correcao da largura do titulo Equipamentos

### Alterado
- `css/components/produtos.css` — heading de Produtos agora usa `fit-content`, largura minima e titulo menor para acompanhar o texto sem vazar da caixa
- `css/layout.css` — `.section-heading` recebeu `box-sizing: border-box` para preservar borda/padding no calculo visual

---

## [2026-05-05] CONTENT — Headings tecnicos sem numeracao

**Agente:** Codex
**Sessão:** Ajuste de textos dos titulos de Produtos e Diferenciais

### Alterado
- `index.html` — meta de Diferenciais alterado para `// Pilares`, meta de Produtos para `// Categorias` e h2 de Produtos para `Equipamentos`

---

## [2026-05-05] FIX — Diferenciais: scroll sem travamento de pin

**Agente:** Codex
**Sessão:** Suavizacao da entrada na secao de pilares

### Alterado
- `js/animations/diferenciais.js` — removido pin virtual da `.diferenciais-layout`; pilares e imagem agora sincronizam pelo scroll natural da pagina, evitando a pausa/encaixe ao entrar na secao

---

## [2026-05-05] FIX — Produtos: titulo sem quebra

**Agente:** Codex
**Sessão:** Correcao do heading compacto de Produtos

### Alterado
- `css/components/produtos.css` — heading de Produtos ficou um pouco mais largo, com gap menor e titulo sem quebra de linha
- `css/layout.css` — titulo global de `section-heading` passou a preservar palavras sem quebra forcada

---

## [2026-05-05] STYLE — Produtos: heading compacto

**Agente:** Codex
**Sessão:** Ajuste do titulo da secao Produtos

### Alterado
- `index.html` — titulo da secao Produtos resumido para "Produtos"
- `css/components/produtos.css` — largura do heading de Produtos reduzida para evitar sobreposicao com a area de imagem e titulo local ajustado para `--text-3xl`

---

## [2026-05-05] STYLE — Section heading claro restaurado

**Agente:** Codex
**Sessão:** Reversao da variacao navy dos titulos

### Alterado
- `index.html` — removida classe `section-heading--navy` dos headings de Diferenciais e Produtos
- `css/layout.css` — removida variacao navy, mantendo o componente claro/cinza em tamanho compacto

---

## [2026-05-05] STYLE — Section heading navy

**Agente:** Codex
**Sessão:** Ajuste de cor do componente de titulos

### Alterado
- `css/layout.css` — adicionada variacao `.section-heading--navy` com fundo azul escuro, borda cinza/translucida, texto branco e meta em azul claro
- `index.html` — headings de Diferenciais e Produtos passaram a usar a variacao navy

---

## [2026-05-05] STYLE — Section heading mais compacto

**Agente:** Codex
**Sessão:** Reducao visual do componente de titulo tecnico

### Alterado
- `css/layout.css` — componente `.section-heading` compactado com menor padding, largura maxima reduzida, linha mais curta e titulo em `--text-4xl`
- `css/components/diferenciais.css` e `css/components/produtos.css` — titulos locais reduzidos para `--text-4xl` para evitar presenca exagerada

---

## [2026-05-05] FEAT — Section heading tecnico animado

**Agente:** Codex
**Sessão:** Componente visual para titulos de secao

### Alterado
- `index.html` — headings de Diferenciais e Produtos passaram a usar `section-heading` com meta mono, linha tecnica e square azul
- `css/layout.css` — criado componente global `.section-heading` com variacoes compactas, superficie cinza, borda sutil, regra horizontal e square
- `css/components/diferenciais.css` e `css/components/produtos.css` — estilos locais dos headers ajustados para herdar o novo componente sem conflito
- `js/animations/scroll-triggers.js` — adicionada animacao GSAP para headings: linha expande, square percorre a regra e meta/titulo entram com fade
- `js/animations/diferenciais.js` — animacao antiga do titulo e kicker e ignorada quando o novo heading animado esta presente, evitando timeline duplicada

---

## [2026-05-05] STYLE — Diferenciais: titulo dentro da timeline

**Agente:** Codex
**Sessão:** Ajuste estrutural do header de Diferenciais

### Alterado
- `index.html` — `h2#diferenciais-heading` e kicker movidos para dentro de `.diferenciais-timeline`, mantendo o `aria-labelledby` da section
- `css/components/diferenciais.css` — header da timeline teve espaçamento ajustado e timeline passou a alinhar conteudo pelo topo

---

## [2026-05-05] STYLE — Social proof: escala dos stats alinhada a referencia

**Agente:** Codex
**Sessão:** Refinamento visual dos numeros de social proof

### Alterado
- `css/components/social-proof.css` — `stat-number` ajustado para `6rem` com `line-height: 1`, peso light e kerning normal; labels mono reduzidos para `--text-base`, line-height mais seco e menor letter-spacing

---

## [2026-05-05] FIX — Fonts: familia Adobe aplicada

**Agente:** Codex
**Sessão:** Correcao do fallback para Arial

### Alterado
- `css/variables.css` — tokens tipograficos agora priorizam os nomes de familia servidos pelo Adobe Fonts (`aktiv-grotesk` e `geist-mono`), mantendo nomes locais como fallback

---

## [2026-05-05] FIX — Fonts: Aktiv via Typekit

**Agente:** Codex
**Sessão:** Carregamento real da Aktiv Grotesk

### Alterado
- `index.html` — adicionado stylesheet Adobe Typekit `https://use.typekit.net/wfu4nak.css` e preconnects para Typekit
- `css/typography.css` — removidos `@font-face` locais da Aktiv baseados em `local()`, evitando fallback para Arial quando a fonte nao existe instalada no sistema

---

## [2026-05-05] STYLE — Social proof: numeros mais leves

**Agente:** Codex
**Sessão:** Refinamento do peso dos stats

### Alterado
- `css/components/social-proof.css` — `.stat-number__value` passou a usar `--weight-light` para reduzir o peso visual dos numeros principais

---

## [2026-05-05] STYLE — Pesos tipograficos sistematizados

**Agente:** Codex
**Sessão:** Aplicacao do plano de weight inspirado na referencia

### Alterado
- `css/variables.css` — adicionados tokens `--weight-light`, `--weight-regular` e `--weight-medium`
- `css/typography.css` — base de leitura ajustada para regular, hero da marca preservada em Machado e classes globais passaram a usar tokens de peso
- `css/layout.css`, `css/animations.css` e componentes — pesos tipograficos migrados para tokens semanticos, com light em numeros grandes, regular em textos/titulos e medium em CTAs/labels/estados ativos

---

## [2026-05-05] FIX — Hero: fonte da marca preservada

**Agente:** Codex
**Sessão:** Restauracao da tipografia proprietaria no titulo da hero

### Alterado
- `css/variables.css` — `--font-display` voltou a priorizar a fonte `Machado` apenas para display
- `css/typography.css` — `@font-face` da fonte proprietaria restaurado e `.hero-title` voltou para peso normal da marca

---

## [2026-05-05] STYLE — Tipografia global Aktiv Grotesk e Geist Mono

**Agente:** Codex
**Sessão:** Troca do sistema tipografico do site

### Alterado
- `index.html` — carregamento externo reduzido para `Geist Mono` nos pesos 400 e 500
- `css/variables.css` — tokens globais de fonte migrados para `Aktiv Grotesk` em display/heading/body e `Geist Mono` em labels/numeros/microcopy
- `css/typography.css` — declarados pesos locais da `Aktiv Grotesk` via `local()`, corpo em light, headlines em regular/light, fundos via variavel e letter-spacing zerado
- `css/layout.css` e componentes tipograficos — pesos antigos `700/800/900` reduzidos para `500`, letter-spacing negativo removido e tamanhos baseados em `vw` substituidos por valores fixos em `rem`

---

## [2026-05-05] FIX — Produtos: deslocamento correto das setas

**Agente:** Codex
**Sessão:** Correcao do carrossel de Produtos

### Alterado
- `js/animations/produtos-tabs.js` — setas agora deslocam o track por largura de viewport (`100vw`) em vez de percentual da largura total, evitando salto para area branca; resize realinha o produto ativo

---

## [2026-05-05] FEAT — Produtos: navegacao por setas

**Agente:** Codex
**Sessão:** Troca do controle por scroll para controles direcionais

### Alterado
- `index.html` — adicionados botoes anterior/proximo na secao Produtos
- `css/components/produtos.css` — criados estilos minimalistas para as setas, estados de hover/focus/disabled e wrapper com overflow controlado
- `js/animations/produtos-tabs.js` — vitrine desktop deixou de depender do wheel/pin para trocar produtos; setas e indicadores agora animam o track diretamente com GSAP

---

## [2026-05-05] FIX — Produtos: scroll por gesto discreto

**Agente:** Codex
**Sessão:** Navegacao travada no centro do slide de Produtos

### Alterado
- `js/animations/produtos-tabs.js` — scroll horizontal encurtado e mais travado; cada gesto de wheel agora mira o proximo slide com animacao programatica mais rapida, mantendo o painel ativo centralizado e reduzindo estados intermediarios com conteudo cortado

---

## [2026-05-05] STYLE — Cursor customizado removido

**Agente:** Codex
**Sessão:** Remoção do efeito no cursor do mouse

### Alterado
- `index.html` — removidos os elementos `#cursor` e `#cursor-follower`
- `js/main.js` — removida importação e chamada de `initCursor()`

---

## [2026-05-05] STYLE — Diferenciais: fundo claro padrão do site

**Agente:** Codex
**Sessão:** Alinhamento visual entre Diferenciais e Produtos

### Alterado
- `css/components/diferenciais.css` — background de `.diferenciais` alterado de `--color-white` para `--color-stats-bg`, mantendo o padrão claro `#EEEEEE` via variável do projeto

---

## [2026-05-05] FEAT — Produtos: square indicator animado no hover

**Agente:** Codex
**Sessão:** Refinamento interativo dos textos de Produtos

### Alterado
- `css/components/produtos.css` — square indicator do bloco de texto agora se move, reduz e rotaciona ao passar o mouse sobre título, specs, descrição ou CTA; textos ganham deslocamento e mudança de cor no hover, em padrão semelhante ao indicador da navbar

---

## [2026-05-05] FIX — Produtos: slide não volta após wheel

**Agente:** Codex
**Sessão:** Correção de navegação discreta da seção Produtos

### Alterado
- `js/animations/produtos-tabs.js` — removido `snap` do ScrollTrigger para evitar disputa com navegação por wheel; wheel agora usa `targetIndex` como fonte de verdade para impedir retorno ao slide anterior durante scroll suave
- `css/components/produtos.css` — tipografia e contraste dos textos refinados com tokens/cores semânticas, largura de texto reduzida e estilos mobile ajustados para evitar cortes

---

## [2026-05-05] FIX — Produtos: scroll sem cortes visuais

**Agente:** Codex
**Sessão:** Refinamento do scroll horizontal de Produtos

### Alterado
- `css/components/produtos.css` — removido clipping interno da área de imagem para evitar cortes durante parallax/animação
- `js/animations/produtos-tabs.js` — removido `clip-path` da entrada da imagem, parallax reduzido, distância de scroll ampliada e snap ajustado para reduzir estados intermediários com conteúdo parcialmente cortado

---

## [2026-05-05] FIX — Produtos: scroll menos sensível

**Agente:** Codex
**Sessão:** Ajuste de leitura no scroll horizontal de Produtos

### Alterado
- `js/animations/produtos-tabs.js` — distância vertical do pin horizontal aumentada em 55%, `scrub` suavizado para `1.25` e `snap` tornado mais paciente para dar mais tempo de leitura entre produtos

---

## [2026-05-05] FEAT — Produtos: square indicator e animações técnicas

**Agente:** Codex
**Sessão:** Camada de animação da seção Produtos

### Alterado
- `css/components/produtos.css` — adicionados square indicators no bloco de texto e na linha técnica da imagem; progress indicator ganhou quadrado ativo; estados ativos com rotação e transições alinhadas ao padrão visual das seções existentes
- `js/animations/produtos-tabs.js` — entrada ativa dos produtos agora anima imagem com `clip-path`, texto com stagger lateral refinado, scale mais sutil e parallax leve via `containerAnimation` durante o scroll horizontal

---

## [2026-05-05] FIX — Scroll entre Diferenciais e Produtos

**Agente:** Codex
**Sessão:** Correção de conflito de pins ScrollTrigger

### Alterado
- `js/animations/diferenciais.js` — adicionado `refreshPriority` alto no pin da seção Diferenciais para garantir cálculo antes da seção Produtos
- `js/animations/produtos-tabs.js` — animação horizontal passou a mover o `.produtos-track` inteiro em vez de cada slide; pin ativado apenas em desktop (`min-width: 1024px`); `end` calculado por altura real da viewport; `refreshPriority` baixo e refresh via `requestAnimationFrame` para evitar início antecipado do pin/snap
- `css/components/produtos.css` — breakpoints alinhados ao JS (`1024px`) para evitar layout horizontal sem pin em tablets

---

## [2026-05-05] STYLE — Produtos: imagem grande à esquerda sem moldura

**Agente:** Codex
**Sessão:** Alinhamento da seção Produtos ao padrão Diferenciais

### Alterado
- `css/components/produtos.css` — removidos grid decorativo, moldura/container da imagem e estilos de quadro; imagem ampliada e fixada à esquerda em todos os slides; textos realinhados à direita com tipografia e espaçamento próximos da seção Diferenciais; fundo mantido no padrão claro do site

---

## [2026-05-05] STYLE — Produtos: fundo claro, imagens maiores e CTA Ver mais

**Agente:** Codex
**Sessão:** Ajuste final de composição da seção Produtos

### Alterado
- `index.html` — CTAs dos produtos alterados de "Solicitar Orçamento" para "Ver mais"
- `css/components/produtos.css` — seção Produtos voltou para o fundo claro padrão `--color-stats-bg`; grid sutil adaptado ao tema claro; imagens ampliadas e centralizadas; textos reposicionados ao lado da imagem com cores escuras e melhor contraste

---

## [2026-05-05] STYLE — Produtos: layout editorial compacto com texto lateral

**Agente:** Codex
**Sessão:** Aproximação visual da referência de cards compactos

### Alterado
- `index.html` — adicionado header visível na seção Produtos com label e headline editorial
- `css/components/produtos.css` — seção convertida para palco escuro minimalista com grid sutil, quadro compacto de imagem e bloco de texto lateral por produto
- `js/animations/produtos-tabs.js` — texto dos produtos passa a surgir lateralmente (`x`) ao ativar cada slide, mantendo scroll horizontal com pin/scrub/snap

---

## [2026-05-05] STYLE — Produtos: vitrine horizontal compacta e minimalista

**Agente:** Codex
**Sessão:** Compactação visual da seção Produtos

### Alterado
- `css/components/produtos.css` — mantida a lógica horizontal com painéis 100vw, mas conteúdo reduzido para cards menores centralizados; imagens com área visual compacta, textos menores, espaçamento mais contido e progress indicator reposicionado

---

## [2026-05-05] STYLE — Produtos: backgrounds semânticos e tipografia refinada

**Agente:** Codex
**Sessão:** Refinamento visual da seção Produtos

### Alterado
- `css/components/produtos.css` — adicionadas variáveis semânticas locais por slide para fundo, superfície de imagem, área de texto e cores de cópia; tipografia revisada com `--font-heading`, tamanhos por tokens/breakpoints, specs mais legíveis e contraste ajustado para slides claros e escuro

---

## [2026-05-05] FIX — Produtos: escala das imagens e sobreposição de texto

**Agente:** Codex
**Sessão:** Ajuste visual da vitrine horizontal de produtos

### Alterado
- `css/components/produtos.css` — imagens contidas com `object-fit: contain`, área visual com padding, indicador movido para o topo e slide pesado alterado para split sem texto absoluto sobre a imagem
- `js/animations/produtos-tabs.js` — escala ativa das imagens reduzida para um efeito mais sutil

---

## [2026-05-05] FEAT — Produtos: vitrine horizontal premium com ScrollTrigger

**Agente:** Codex
**Sessão:** Product showcase horizontal scroll-driven

### Alterado
- `index.html` — specs dos produtos convertidas de lista para linhas limpas, mantendo 3 informações curtas por slide
- `css/components/produtos.css` — seção Produtos reescrita como vitrine horizontal pinned, com painéis 100vw/100svh, layouts alternados, terceiro slide imersivo, indicador de progresso e fallback mobile vertical
- `js/animations/produtos-tabs.js` — módulo GSAP refeito com `xPercent`, `pin`, `scrub`, `snap`, highlight ativo, animação staggered de texto, escala sutil nas imagens e comportamento mobile/reduced-motion

---

## [2026-05-05] FIX — Produtos: espaçamento, tipografia e scroll-driven pin

**Agente:** Claude Code
**Sessão:** Ajuste de layout, tipografia e comportamento scroll na seção Produtos

### Alterado
- `index.html` — kicker trocado de `.eyebrow` para `.produtos-kicker` (evita `::before '— '` do eyebrow)
- `css/components/produtos.css` — espaçamento revisado (trigger padding-block space-6, body gap space-5, body padding-bottom space-10); tipografia padronizada (títulos em --font-body 32px igual ao diferenciais, nums em --font-ui-mono, specs em --font-body text-base); `.produtos-kicker` adicionado igual ao diferenciais-kicker; `.produto-item__name` sem hover ativo (só scroll/click)
- `js/animations/produtos-tabs.js` — adicionado GSAP ScrollTrigger pin no `.produtos-split` (espelho exato do diferenciais); animação de entrada do header e itens; scroll avança os produtos automaticamente

---

## [2026-05-05] FEAT — Seção Produtos repaginada: layout split-screen interativo

**Agente:** Claude Code
**Sessão:** Redesign Produtos — split-screen com imagem sticky e lista expansível

### Alterado
- `index.html` — seção #produtos completamente reescrita: grid de cards removido, substituído por split-screen (lista esquerda + imagem sticky direita); ordem Leve → Média → Pesada; textos reais do cliente
- `css/components/produtos.css` — CSS reescrito do zero para o novo layout
- `js/animations/produtos-tabs.js` — JS reescrito: hover (desktop) / click ativa item, expande specs e troca imagem com transição suave

---

## [2026-05-05] FIX — Proporção corrigida: steps 60% / imagem 40%

**Agente:** Claude Code
**Sessão:** Correção da proporção invertida na seção Diferenciais

### Alterado
- `css/components/diferenciais.css` — `grid-template-columns` corrigido de `1fr / 1.5fr` para `1.5fr / 1fr`; imagem ficava em 60% causando altura absurda com aspect-ratio 4:5; agora steps=60%, imagem=40%, resultado visual aprovado

---

## [2026-05-05] STYLE — Tipografia e container de imagem Diferenciais ajustados à referência

**Agente:** Claude Code
**Sessão:** Font sizes fixos + aspect-ratio retrato na imagem

### Alterado
- `css/components/diferenciais.css`:
  - `.diferenciais-title` → `font-size: 64px` (era clamp)
  - `.diferencial-step__title` → `font-size: 32px`
  - `.diferencial-step__text` → `font-size: 16px`
  - Desktop: `.diferenciais-visual__sticky` → `aspect-ratio: 4/5` substituindo `flex: 1 / min-height` — proporção retrato igual à referência (526×658px)
  - Desktop: `.diferenciais-layout` → `align-items: start` (imagem tem altura própria via aspect-ratio, não precisa de stretch)

---

## [2026-05-05] STYLE — Proporção de colunas Diferenciais ajustada para referência good-fella

**Agente:** Claude Code
**Sessão:** Alinhamento da seção Diferenciais à referência (grid overlay good-fella.com)

### Alterado
- `css/components/diferenciais.css` — grid-template-columns alterado para `1fr / 1.5fr` (40%/60%), espelhando o split de 5/7 colunas da referência; `align-self: start` no timeline para a imagem preencher exatamente a altura dos steps sem ultrapassar

---

## [2026-05-05] STYLE — Redução proporcional da seção Diferenciais

**Agente:** Claude Code
**Sessão:** Redução de escala da seção Diferenciais mantendo proporções

### Alterado
- `css/components/diferenciais.css` — redução uniforme ~25-30% em todos os tamanhos:
  - Título: `clamp(2.4rem→1.75rem, 4→3vw, 4rem→2.75rem)`
  - Margin header: `--space-12 → --space-8`; gap header: `--space-4 → --space-3`
  - Gap entre steps (mobile): `--space-8 → --space-6`; (768px): `--space-9 → --space-6`; (1024px): `clamp(space-7,3vh,space-9) → clamp(space-5,2vh,space-6)`
  - Título do step: `32px → 22px`; texto do step: `text-base → text-sm`
  - Imagem mobile: `min-height clamp(28rem,78vw,38rem) → clamp(18rem,55vw,26rem)`
  - Imagem desktop: `min-height clamp(32rem,60vh,44rem) → clamp(22rem,45vh,32rem)`
  - Padding da seção desktop: `clamp(space-20,8vw,space-32) → clamp(space-12,5vw,space-20)`
  - Gap do layout desktop: `clamp(space-12,6vw,space-24) → clamp(space-8,4vw,space-16)`
  - Padding-left timeline: `--space-10 → --space-8`

---

## [2026-05-05] FIX — Background da página e layout da seção Diferenciais

**Agente:** Claude Code
**Sessão:** Correção background #EEEEEE e quebra de layout diferenciais no fim do scroll

### Alterado
- `css/typography.css` — `body { background-color }` alterado de `var(--color-bg)` (#1C2430) para `#EEEEEE`
- `css/components/diferenciais.css` — removido `position: sticky` e `top:` de `.diferenciais-visual__sticky` em desktop (conflitava com o `ScrollTrigger.pin()` do JS, causando quebra visual no último passo); substituído por `position: relative` + `.diferenciais-visual { display: flex; flex-direction: column }` e `.diferenciais-visual__sticky { flex: 1 }` para preenchimento correto da imagem

---

## [2026-05-01] STYLE — Scroll virtual nos diferenciais sem alterar layout

**Agente:** Codex
**Sessão:** Ajuste de ritmo da timeline de diferenciais

### Alterado
- `css/components/diferenciais.css` — removida a altura mínima dos itens no desktop, mantendo o layout compacto anterior da timeline.
- `js/animations/diferenciais.js` — troca dos pilares no desktop passou a usar `ScrollTrigger` com pin e duração virtual maior, exigindo mais rolagem entre itens sem aumentar o tamanho visual dos textos.

---

## [2026-05-01] STYLE — Scroll dos diferenciais mais longo entre pilares

**Agente:** Codex
**Sessão:** Ajuste de ritmo da timeline de diferenciais

### Alterado
- `css/components/diferenciais.css` — no desktop, cada `.diferencial-step` ganhou altura mínima responsiva e o gap da timeline foi zerado, aumentando a distância de scroll entre trocas.
- `js/animations/diferenciais.js` — ponto de foco do cálculo do item ativo ajustado para `46%` da viewport, deixando a troca mais estável com a imagem sticky.

---

## [2026-05-01] REFACTOR — Hero troca block reveal por clip reveal editorial

**Agente:** Codex
**Sessão:** Substituição da animação principal do hero

### Alterado
- `index.html` — atributos do hero trocados de `data-block-reveal` para `data-hero-reveal`.
- `css/components/hero.css` — removida estrutura de máscara/bloco e adicionados estados iniciais de clip reveal com `clip-path`, `opacity` e `translateY`.
- `js/animations/hero.js` — animação do hero reescrita para revelar os textos por `clip-path` com stagger suave, mantendo CTA, imagem e scroll indicator.
- `js/gsap-setup.js` — removido `blockReveal`, pois a animação voltou a usar o easing `machado`.

---

## [2026-05-01] FIX — Máscara do block reveal não fica sobre o hero

**Agente:** Codex
**Sessão:** Correção do reveal do hero

### Alterado
- `css/components/hero.css` — conteúdo do block reveal agora mantém camada, cor e tipografia herdadas; máscara recebeu dimensões explícitas.
- `js/animations/hero.js` — máscara do block reveal agora é ocultada com `autoAlpha: 0` ao final da passagem, evitando barras visíveis sobre o texto.

---

## [2026-05-01] FEAT — Hero com block reveal animation

**Agente:** Codex
**Sessão:** Animação premium de reveal no hero

### Alterado
- `index.html` — textos do hero receberam `data-block-reveal` e temas de máscara nos dois versos do título.
- `css/components/hero.css` — adicionada estrutura reutilizável de block reveal com container mascarado, conteúdo e bloco absoluto, incluindo fallback para `prefers-reduced-motion`.
- `js/animations/hero.js` — animação de caracteres substituída por block reveal reutilizável que cria camadas de conteúdo/máscara, faz o bloco atravessar o texto e revela o conteúdo com fade + translateY.
- `js/gsap-setup.js` — adicionado CustomEase `blockReveal` com curva `0.22, 1, 0.36, 1`.

---

## [2026-05-01] STYLE — Square gira apenas na troca de pilar

**Agente:** Codex
**Sessão:** Ajuste da rotação do indicador da timeline

### Alterado
- `css/components/diferenciais.css` — removida rotação contínua do square e adicionada variável `--indicator-rotation` aplicada no `::before`.
- `js/animations/diferenciais.js` — indicador agora incrementa a rotação via GSAP somente quando o item ativo muda durante o scroll.

---

## [2026-05-01] FIX — Square dos diferenciais gira sem sair do eixo

**Agente:** Codex
**Sessão:** Correção da rotação do indicador da timeline

### Alterado
- `css/components/diferenciais.css` — rotação do indicador movida para `.diferenciais-indicator::before`, mantendo o elemento pai responsável apenas pelo deslocamento vertical e evitando o efeito de órbita.

---

## [2026-05-01] STYLE — Step ativo desloca inteiro e indicador gira

**Agente:** Codex
**Sessão:** Ajuste de microinteração da timeline de diferenciais

### Alterado
- `css/components/diferenciais.css` — deslocamento de 40px movido do conteúdo para o `.diferencial-step.is-active` inteiro, incluindo número e texto; indicador ampliado para `1rem` e animado com rotação contínua no próprio eixo via `@keyframes`.
- `js/animations/diferenciais.js` — removido controle de rotação do tween do indicador para evitar conflito com a animação CSS.

---

## [2026-05-01] STYLE — Texto ativo dos diferenciais desloca à direita

**Agente:** Codex
**Sessão:** Ajuste de microinteração da timeline de diferenciais

### Alterado
- `css/components/diferenciais.css` — conteúdo textual do `.diferencial-step.is-active` agora desloca `--space-10` (40px) para a direita com transição suave, respeitando `prefers-reduced-motion`.

---

## [2026-05-01] STYLE — Timeline de diferenciais mais fluida

**Agente:** Codex
**Sessão:** Suavização da animação da seção diferenciais

### Alterado
- `js/animations/diferenciais.js` — movimento do indicador agora cancela o tween anterior antes de iniciar o próximo, usa `duration: 0.72`, `power3.out` e `overwrite: auto` para evitar travadas.
- `css/components/diferenciais.css` — transições de passos e imagens alongadas para suavizar opacidade, escala e crossfade.

---

## [2026-05-01] STYLE — Detalhes dos pilares no azul padrão

**Agente:** Codex
**Sessão:** Ajuste de cor da timeline de diferenciais

### Alterado
- `css/variables.css` — `--color-process-accent` agora aponta para `--color-primary`, deixando kicker e indicador da seção `#diferenciais` no azul padrão Machado.

---

## [2026-05-01] STYLE — Refinos visuais da timeline de diferenciais

**Agente:** Codex
**Sessão:** Ajustes pós-implementação da seção diferenciais

### Alterado
- `index.html` — seção `#diferenciais` trocada de `section--dark` para `section--light` e timeline passou a usar um único `.diferenciais-indicator` móvel em vez de um indicador por item.
- `css/components/diferenciais.css` — fundo da seção alterado para `--color-white`, textos em tons escuros, heading menor em linha única, título dos passos fixado em `32px`, números em `--font-ui-mono`, imagem com card arredondado e lista compactada para caber visualmente dentro da altura da imagem.
- `js/animations/diferenciais.js` — indicador laranja agora se desloca verticalmente com `gsap.to()` para acompanhar o item ativo, seguindo o comportamento do indicador da navbar.

---

## [2026-05-01] FEAT — Diferenciais como timeline interativa por scroll

**Agente:** Codex
**Sessão:** Recriação da seção Por que Machado?

### Alterado
- `index.html` — seção `#diferenciais` reestruturada de cards estáticos para timeline de cinco pilares com passos numerados, indicador ativo e painel visual com cinco imagens reais da galeria.
- `css/variables.css` — adicionado token `--color-process-accent` para o indicador laranja da timeline sem hardcode no componente.
- `css/components/diferenciais.css` — componente recriado com layout editorial em duas colunas, imagem sticky no desktop, estados ativo/inativo, crossfade suave de imagens e responsivo mobile sem sticky.
- `js/main.js` — importado e inicializado `initDiferenciais()` junto às animações principais.

### Criado
- `js/animations/diferenciais.js` — módulo isolado para ativar pilares conforme o scroll, alternar imagens, animar entrada inicial e respeitar `prefers-reduced-motion`.

---

## [2026-05-01] STYLE — Hover suave no label dos stats

**Agente:** Codex
**Sessão:** Microinteração dos textos inferiores da social-proof

### Alterado
- `css/components/social-proof.css` — `.stat-label-wrapper` agora recebe transição de transform e desloca `--space-2` para a direita no hover do `.stat-card`, evitando conflito com o transform inline que o GSAP aplica no `.stat-label`; fallback mantido em `prefers-reduced-motion`.

---

## [2026-05-01] STYLE — Label e square dos stats maiores

**Agente:** Codex
**Sessão:** Ajuste visual dos textos inferiores da social-proof

### Alterado
- `css/components/social-proof.css` — `.stat-label` aumentado para `clamp(1.15rem, 1.25vw, 1.35rem)`, `.stat-square` ampliado para `0.8rem` e espaçamento entre square/texto ajustado para `--space-3`.

---

## [2026-05-01] FIX — Contadores social-proof em valores absolutos

**Agente:** Codex
**Sessão:** Ajuste de texto dos contadores da social-proof

### Alterado
- `index.html` — contadores da social-proof alterados de 4mil+/2mil+ para 4000+/2000+, com `data-count` usando os valores absolutos para preservar a animação.
- `css/components/social-proof.css` — removida a classe `.stat-number__unit`, que não é mais usada após a troca para 4000+/2000+.
- `js/animations/stats.js` — contagem da social-proof permanece formatando apenas números inteiros, agora com alvos 4000 e 2000; os valores são inicializados em `0` e animados por um gatilho dedicado na seção inteira com `IntersectionObserver`, separado da timeline visual dos cards e independente da posição horizontal de cada card.
- `js/main.js` — `initStats()` passou a rodar logo no `DOMContentLoaded`, antes do loader, para preparar o contador sem depender do fim da animação inicial.
- `js/animations/counters.js` — contadores genéricos agora ignoram elementos dentro de `[data-stats-card]`, evitando sobrescrever `4mil` e `2mil` depois da animação específica da social-proof.

---

## [2026-05-01] STYLE — Social-proof em linha horizontal com cards 440x600

**Agente:** Codex
**Sessão:** Ajuste de dimensões da seção social-proof

### Alterado
- `css/components/social-proof.css` — seção social-proof ajustada para grid horizontal fixo com quatro colunas de 440px, cards e imagem com 440px x 600px, gap de `--space-5` (20px) e container centralizado na página, mantendo todos os itens lado a lado com rolagem horizontal quando necessário.

---

## [2026-05-01] STYLE — Hero image ancorada no canto inferior direito

**Agente:** Codex
**Sessão:** Ajuste de posicionamento da imagem principal do hero

### Alterado
- `css/components/hero.css` — `.hero-media` virou camada absoluta com largura de viewport e `.hero-img` agora fica ancorada em `right: 0; bottom: 0`, removendo os offsets negativos por breakpoint que prendiam a imagem à coluna em vez do canto inferior direito da tela.

---

## [2026-04-30] STYLE — Social-proof desktop: layout 4 colunas flat estilo good-fella.com

**Agente:** Claude Code
**Sessão:** Rewrite do layout desktop da seção de prova social

### Alterado
- `css/components/social-proof.css` — `@media 1024px`: grid trocado de `repeat(2, 1fr)` para `repeat(4, minmax(0, 1fr))` com `gap: 0`; cards recebem `background-color: transparent; border: none; border-right: 1px solid var(--color-stats-divider)` para efeito de colunas planas separadas por linha fina; último card sem `border-right` via `:last-child`; adicionado override `@media (hover: hover) and (min-width: 1024px)` para suprimir feedback de borda no hover em desktop (a animação do `stat-square` já provê o feedback)

---

## [2026-05-01] STYLE — Cards 590×440px, 50px margem lateral, texto ancorado à esquerda

**Agente:** Claude Code
**Sessão:** Ajuste de dimensões e layout da seção social-proof

### Alterado
- `css/components/social-proof.css` — `.stat-label-wrapper` trocado de `inline-flex` para `flex` com `width: 100%` (texto fica anchored à esquerda do card inteiro); `@media 1024px`: container override com `max-width: 1300px; padding-inline: 50px` (resulta em inner-width 1200px → cards ~592px com gap 16px); grid trocado de `repeat(4, 1fr)` para `repeat(2, 1fr)` criando layout 2×2; cards com `height: 440px`; removido pseudo-element `::after` de separador que não se aplica ao novo layout 2 colunas

---

## [2026-05-01] FIX — Refinamentos de UX: hover, square, scroll top, label speed

**Agente:** Claude Code
**Sessão:** Ajustes pós-revisão da seção social-proof

### Alterado
- `css/components/social-proof.css` — removido `translateY` do hover do card (sem lift); removido `transition: transform` da regra base pois não é mais necessário; rotação inicial do `stat-square` reduzida de `-135deg` para `-45deg` (mais sutil); duração de entrada encurtada para `0.32s/0.42s`; trigger do square permanece `.stat-card:hover` (card inteiro, não só o texto)
- `index.html` — adicionado script inline no `<head>` com `history.scrollRestoration = 'manual'` e `window.scrollTo(0,0)` — garante scroll para o topo em F5 e navegação back/forward, antes de qualquer CDN carregar
- `js/animations/stats.js` — label: deslocamento inicial reduzido de `y:16` para `y:10`, duração de `0.65s` para `0.38s`, ease trocado para `power3.out` (mais fluido para deslocamentos curtos), position na timeline adiantado de `0.32` para `0.28`

---

## [2026-05-01] FEAT — Animações da seção Social Proof redesenhadas

**Agente:** Claude Code
**Sessão:** Refinamento de social-proof — hover, stat-square, scroll animations, contagem de números

### Alterado
- `css/variables.css` — adicionados tokens `--ease-machado` e `--ease-snap` para uso em transições CSS (evita cubic-bezier solto fora dos tokens)
- `css/components/social-proof.css` — hover do card reduzido de `translateY(-4px)` para `translateY(-2px)`, transição de transform encurtada para `--dur-fast`; borda no hover trocada para `--color-border-light` (mais sutil); `stat-square` agora oculto por padrão (`opacity:0; scale(0) rotate(-135deg)`), reaparece no hover do card com transição `machado` suave (0.55s) e retorna rapidamente (0.22s) — CSS puro sem GSAP; adicionado bloco `prefers-reduced-motion` desativando a transição do square
- `js/animations/stats.js` — reescrito com três layers independentes: (1) card entra de baixo (y:36→0), (2) `.stat-label` sobe separado (y:16→0) durante a entrada do card, (3) números contam de 0 até o valor via `data-count` / `data-count-suffix`; estado inicial dos labels pré-definido com `gsap.set` antes dos ScrollTriggers; bloco `prefers-reduced-motion` reseta labels também
- `index.html` — adicionados `data-count` e `data-count-suffix` nos três `.stat-number__value` (22; 4mil; 2mil)

---

## [2026-05-01] FIX — Bugs de CSS e reduced-motion + galeria com imagens reais

**Agente:** Claude Code
**Sessão:** Retomada de projeto — diagnóstico e correções

### Alterado
- `css/variables.css` — adicionado token `--space-14: 3.5rem` (corrige padding quebrado em tablet: hero.css linha 207 usava variável inexistente)
- `css/components/financiamento.css` — 2 rgba hardcoded substituídos por `--color-border-soft` e `--color-primary-surface`
- `css/components/sobre.css` — rgba hardcoded `rgba(255,255,255,0.7)` substituído por `--color-white-muted`
- `css/components/cta-interstitial.css` — rgba hardcoded substituído por `--color-primary-soft`
- `css/components/contato.css` — 2 rgba hardcoded substituídos por `--color-primary-ring` e `--color-error-ring`; adicionada classe `.form-field--full` (usada no HTML mas não definida)
- `js/animations/scroll-triggers.js` — corrigido bug de `prefers-reduced-motion`: footer headline ficava `opacity:0` porque a função retornava cedo sem resetar o estado inicial do CSS
- `index.html` — galeria substituída: 8 imagens reais de `assets/images/galeria/` no lugar de placeholders `picsum.photos`

---

## [2026-04-29] STYLE — Navbar refinada com animações good-fella.com

**Agente:** Claude Code
**Sessão:** Refinamento de navbar/menu aberto seguindo referência good-fella.com

### Alterado
- `index.html` — seção logo abaixo da hero reestruturada para três métricas institucionais da Machado com markup novo (`stats-section`, `stats-container`, `stat-card`, `stat-number`, `stat-label`).
- `css/variables.css` — adicionados tokens específicos da nova seção clara de resultados (`#EEEEEE` no fundo da seção e `#F7F7F7` nos cards), além de bordas e sombras dedicadas.
- `css/components/social-proof.css` — componente recriado com visual premium claro, três cards responsivos, hover sutil, separadores desktop e números em destaque com detalhe azul.
- `css/components/social-proof.css` — seção recalibrada para layout editorial em quatro painéis, com imagem na primeira coluna e três blocos numéricos altos seguindo a composição da referência.
- `index.html` — adicionada coluna visual com imagem da plataforma antes das métricas, alinhando a seção ao layout de referência.
- `css/components/social-proof.css` — painéis refinados para ficar mais fiéis à referência: quatro containers bem definidos, números maiores, labels menores no rodapé e proporções mais altas no desktop.
- `css/components/social-proof.css` — proporção dos quatro painéis reduzida para um formato menos vertical e mais próximo de um bloco horizontal premium.
- `index.html` — legendas dos cards de resultado reestruturadas com wrapper, square azul e texto em linha única.
- `css/components/social-proof.css` — labels dos cards travadas em uma linha, com square azul fixo e espaçamento alinhado à referência.
- `js/animations/stats.js` — microanimação adicionada ao rodapé dos cards: square azul entra girando junto com a legenda, em sequência e apenas uma vez.
- `js/main.js` — integração da animação dedicada da seção de resultados na ordem de inicialização pós-loader.
- `css/variables.css` — adicionados tokens de largura máxima, colunas e gaps do menu aberto para evitar medidas soltas no componente.
- `css/components/navbar.css` — seção inferior do menu aberto reconstruída com grid estável de três áreas, limitando a navegação à esquerda, o bloco de texto ao centro e o bloco de imagens à direita.
- `css/components/navbar.css` — cards da direita convertidos para `flex` contido com `min-width: 0`, `max-width: 100%` e imagens com `width: 100%`/`height: auto`, eliminando a sobreposição sobre o texto central.
- `css/components/navbar.css` — navbar fechada mantém fundo transparente para se mesclar com o background do site; cartão cinza escuro (`--color-menu-bg`) reservado exclusivamente para o estado de menu aberto.
- `css/components/navbar.css` — tema claro da navbar fechada ajustado para cartão cinza claro (`--color-surface`) sobre seções claras, como nas referências 4 e 5.
- `index.html` — adicionado `.nav-indicator` (elemento único) dentro de `.navbar-panel__nav`.
- `css/components/navbar.css` — removidos `::before` dos links da nav; adicionado `.nav-indicator` com `position: absolute` e `transition: transform` para deslizar verticalmente entre itens.
- `js/main.js` — lógica de indicador animado: `positionIndicator()` move o quadrado via `translateY` no hover, `moveIndicatorToActive()` retorna ao item ativo no mouseleave, reposicionamento automático no resize.
- `css/components/navbar.css` — layout do painel aberto revertido para proporções anteriores (`1.02fr / 0.56fr / 1.22fr`, `aspect-ratio: 0.72`, gap padrão) após teste visual.
- `js/main.js` — animações de abertura/fechamento do menu expandido refatoradas para timeline GSAP com `clip-path` (revelação de cima para baixo), stagger refinado em três grupos (nav links, meta blocks, cards) e easing `machado`.
- `js/main.js` — fechamento do menu agora usa timeline GSAP com `clearProps: 'all'` para limpeza segura após a animação.

---

## [2026-04-29] STYLE — Hero redesenhada com composição editorial premium

**Agente:** Codex
**Sessão:** Refinamento visual da hero

### Alterado
- `index.html` — hero reestruturada com kicker técnico, CTA principal, ação secundária e linha de highlights para melhorar hierarquia e leitura.
- `css/components/hero.css` — layout da hero reconstruído em mobile-first com grid editorial, palco visual para a imagem, glow azul controlado e escala mais premium em desktop.
- `js/animations/hero.js` — animação de entrada expandida para contemplar os novos elementos da hero sem quebrar o split do título.
- `css/components/hero.css` — refinamento do layout para corrigir o empilhamento do título e restaurar a composição horizontal com texto à esquerda e produto à direita.
- `index.html` — CTA principal da hero e CTA fixo do canto inferior direito convertidos para o formato bloco + quadrado com `+`.
- `css/layout.css` — criação do padrão reutilizável de CTA split inspirado na referência visual, adaptado para a paleta Machado.
- `css/animations.css` — substituição do botão circular flutuante por um CTA fixo no novo formato visual.
- `css/components/hero.css` — ajuste da largura do CTA principal para ficar mais próximo da referência.
- `css/variables.css` — adição da família `JetBrains Mono` para CTAs e microtipografia de interface.
- `index.html` — importação da JetBrains Mono, redução do texto da hero e remoção dos highlights para simplificar a composição.
- `css/layout.css` — redução do tamanho dos CTAs split e troca da tipografia para JetBrains Mono fina.
- `css/components/hero.css` — hero refinada para deixar o naming menor, em linha, com a imagem mais próxima do bloco principal e o link secundário sublinhado.
- `css/components/hero.css` — remoção do fade de fundo, hero com preto sólido, tipografia da marca sem clipping aparente e imagem menor/anexada ao rodapé visual da seção.
- `css/layout.css` — hover do CTA split suavizado para uma resposta mais discreta.
- `css/animations.css` — CTA fixo do canto inferior direito com hover mais sutil.
- `css/layout.css` — CTAs split reduzidos novamente para se aproximarem mais da escala da referência atual.
- `css/components/hero.css` — título da hero reduzido, com melhor espaçamento entre linhas, e imagem reposicionada para um layout mais ancorado ao canto inferior direito da tela.
- `css/components/hero.css` — imagem da hero ampliada e deslocada ainda mais para o canto direito da tela no desktop.
- `css/components/hero.css` — hero image deslocada além do padding do container no desktop para encostar visualmente no canto inferior direito da seção.
- `css/components/hero.css` — hero image reposicionada alguns pixels mais para baixo no desktop, mantendo a composição do canto inferior direito.
- `index.html` — texto da hero refinado para uma leitura mais direta e mais próxima da referência.
- `css/layout.css` — CTAs split da hero e do botão fixo reduzidos novamente para ficarem mais próximos da escala visual de referência.
- `css/components/hero.css` — coluna de texto da hero refinada com melhor hierarquia, respiro entre título azul/branco e subtítulo mais contido.
- `css/components/hero.css` — bloco de texto da hero ampliado em torno de 15% e hero image reposicionada mais para baixo no desktop.
- `css/components/hero.css` — bloco de texto da hero ampliado novamente para ganhar mais presença e largura útil no desktop.
- `css/components/hero.css` — coluna esquerda da hero ampliada de forma mais agressiva, com mais largura de grid e mais espaço útil para título, subtítulo e CTAs.
- `css/components/hero.css` — coluna esquerda da hero ampliada novamente com escala aproximada de 1.3 para kicker, título, subtítulo e CTA principal.
- `index.html` — CTA secundário da hero encurtado de "Ver modelos disponíveis" para "Ver modelos".
- `index.html` — navbar reestruturada com CTA split, toggle "Menu" mais refinado e melhor hierarquia no menu mobile.
- `css/components/navbar.css` — navbar totalmente redesenhada com barra flutuante escura, navegação desktop mais editorial e overlay mobile mais premium.
- `js/main.js` — comportamento da navbar refinado com controle explícito de abertura/fechamento, `aria-expanded` e fechamento via `Escape`.
- `index.html` — navbar reestruturada novamente para um padrão mais fiel às referências, com topo minimalista e painel expandido em três áreas.
- `css/components/navbar.css` — navegação refeita com barra flutuante compacta e painel editorial inspirado diretamente nas referências de `assets/images/references/nav bar`.
- `js/main.js` — toggle da navbar adaptado ao novo `navbar-panel`, com rótulo `Menu/Close` e fade de abertura/fechamento do painel.
- `css/components/navbar.css` — adição de estado claro da navbar para contraste sobre seções claras, mantendo o mesmo layout flutuante.
- `js/main.js` — navbar agora alterna automaticamente entre tema escuro e claro de acordo com a seção visível no topo da página.
- `js/main.js` — fechamento da navbar reforçado com clique fora do painel expandido e rotina de `closeMenu()` mais robusta.
- `css/variables.css` — novos tokens ajustados para navbar clara e overlay suave dentro da mesma paleta do projeto.
- `css/components/navbar.css` — navbar redefinida para fundo branco/cinza, texto preto e estados ativos em azul tanto na barra quanto no painel expandido.
- `js/main.js` — remoção da troca automática de tema da navbar para manter o novo padrão claro fixo durante o scroll.
- `css/components/navbar.css` — correção da navbar fechada para voltar a ficar transparente, acompanhando a seção ao fundo, com cartão cinza reservado apenas ao menu aberto.
- `js/main.js` — restauração da leitura de `.section--light` para alternar a cor da navbar fechada conforme a seção visível no topo da página.
- `css/variables.css` — tokens da navbar ajustados novamente para o menu aberto voltar ao cinza escuro editorial, com destaque azul no lugar do laranja da referência.
- `css/components/navbar.css` — menu aberto redesenhado para ficar muito mais próximo da referência visual: barra superior escura, navegação grande à esquerda, bloco de contato ao centro e cards verticais à direita.
- `css/components/navbar.css` — tipografia dos links grandes do menu refinada para peso 500 e escala desktop de `64px / 72px`, usando a família carregada mais próxima da referência `Aktiv Grotesk`.
- `css/variables.css` — cor do fundo da navbar aberta ajustada para a base `#333333`, aplicada via token para manter a regra de zero hex direto nos componentes.
- `css/variables.css` — novos tokens de espaçamento da navbar aberta para controlar topo e margem inferior do painel via variável.
- `css/components/navbar.css` — cards da direita ampliados, bloco central deslocado para a esquerda e painel aberto limitado com margem inferior de `100px`.
- `css/variables.css` — novo token para controlar o gap vertical do bloco central da navbar aberta no desktop.
- `css/components/navbar.css` — bloco central da navbar aberta ajustado para `200px` de espaçamento vertical entre os grupos de conteúdo.
- `css/variables.css` — fundo da navbar aberta tornado totalmente opaco usando `#333333` via token, sem transparência no painel.
- `css/components/navbar.css` — bloco central da navbar aberta corrigido para usar gap real de `200px`, removendo o efeito extra causado por `space-between`.
- `css/components/navbar.css` — barra superior da navbar aberta alinhada visualmente ao painel principal, removendo blur e sombra para manter exatamente a mesma cor de fundo.
- `css/components/navbar.css` — retângulo do `+` no CTA da navbar aberta ajustado para usar o mesmo cinza `#333333` do topo, eliminando a diferença de cor no estado aberto.
- `css/components/navbar.css` — correção final da navbar aberta: CTA restaurado ao visual anterior e bordas do topo/painel igualadas ao mesmo fundo `#333333` para eliminar a leitura de dois tons diferentes.
- `css/components/navbar.css` — teste de opacidade no wrapper superior da navbar aberta revertido; mantido apenas o ajuste de cor do bloco superior para acompanhar o painel aberto sem alterar o comportamento anterior.
- `css/variables.css` — criação do token único `--color-menu-bg` para centralizar a cor real do menu aberto.
- `css/components/navbar.css` — topo aberto (`.navbar.is-open .navbar-inner`) e bloco abaixo (`.navbar-panel__inner`) unificados explicitamente no mesmo `background-color` usando `--color-menu-bg`.
- `css/components/navbar.css` — ajuste do wrapper externo do menu aberto revertido para transparente, preservando a separação entre a barra superior e o bloco de conteúdo, enquanto os dois retângulos continuam compartilhando o mesmo `--color-menu-bg`.
- `css/components/navbar.css` — opacidade removida do wrapper do menu aberto e aplicada ao bloco interno, evitando alteração perceptiva na cor do painel inferior.
- `js/main.js` — animação de abertura/fechamento da navbar expandida movida do wrapper do painel para `.navbar-panel__inner`, preservando a mesma cor chapada entre os dois retângulos.

## [2026-04-29] STYLE — Loader redesenhado e base visual saneada

**Agente:** Codex
**Sessão:** Continuação do projeto + redesign do loading screen

### Alterado
- `css/variables.css` — adição de tokens semânticos para transparências, glow, ring e sombras, evitando valores soltos fora da fonte da verdade.
- `css/layout.css` — base de botões ajustada para usar tokens de duração e cor do projeto.
- `css/animations.css` — remoção de `!important`, centralização de sombras em tokens e redesign completo do loading screen para o novo layout com quatro quadrados.
- `js/animations/hero.js` — integração com helper de `SplitText` com guard clause adicional.
- `js/animations/scroll-triggers.js` — animação de linhas refatorada para usar helper centralizado.
- `js/main.js` — inicialização alinhada ao `DOMContentLoaded` e inclusão do módulo opcional de marquee no fluxo.
- `js/loader.js` — animação do loader refeita para quatro quadrados que entram rolando, se alinham e depois liberam a tela.
- `index.html` — markup do loader simplificado para a nova composição visual.

### Criado
- `js/animations/text-split.js` — utilitário central para splits por chars e linhas com guard clauses.
- `js/animations/marquee.js` — módulo opcional de marquee horizontal, pronto para uso futuro.
- `js/animations/stats.js` — animação sequencial da nova seção de números/resultados com entrada única ao entrar na viewport.

## [2026-04-29] CHORE — Setup inicial completo do projeto

**Agente:** Claude Code
**Sessão:** Setup & estrutura base

### Criado
- Estrutura completa de pastas (`assets/`, `css/`, `css/components/`, `js/`, `js/animations/`)
- `css/reset.css` — CSS reset moderno
- `css/variables.css` — Todos os tokens de design (cores, tipografia, espaçamento, animações)
- `css/typography.css` — `@font-face` Machado + escala tipográfica + classes utilitárias
- `css/layout.css` — Container, grid, botões base, utilitários de layout
- `css/animations.css` — Estados iniciais GSAP, loader, cursor, WhatsApp flutuante, `prefers-reduced-motion`
- `css/components/navbar.css`
- `css/components/hero.css`
- `css/components/social-proof.css`
- `css/components/diferenciais.css`
- `css/components/produtos.css`
- `css/components/galeria.css`
- `css/components/sobre.css`
- `css/components/cta-interstitial.css`
- `css/components/financiamento.css`
- `css/components/depoimentos.css`
- `css/components/contato.css`
- `css/components/footer.css`
- `js/gsap-setup.js` — Register plugins + CustomEase `"machado"` e `"snap"`
- `js/lenis.js` — Smooth scroll + sincronização com ScrollTrigger
- `js/loader.js` — Loading screen animada com Promise e safety timeout
- `js/animations/cursor.js` — Cursor customizado (desabilitado em touch)
- `js/animations/magnetic.js` — Efeito magnético em botões `[data-magnetic]`
- `js/animations/counters.js` — Animação de contadores numéricos com ScrollTrigger
- `js/animations/hero.js` — Animação de entrada do hero (SplitText + timeline)
- `js/animations/scroll-triggers.js` — Todos os `[data-animate]`: fade-up, fade-in, slide-left, slide-right, scale-in, lines
- `js/animations/produtos-tabs.js` — Hover nos cards de produto
- `js/main.js` — Entry point com ordem de inicialização
- `index.html` — Página completa com 12 seções (Navbar, Hero, Social Proof, Diferenciais, Produtos, Galeria, Sobre, CTA Mid, Financiamento, Depoimentos, Contato, Footer)
- `CHANGELOG.md` — Este arquivo

### Copiado de `imgs/`
- `assets/images/logo/logo.svg` ← `imgs/logosvg 1.svg`
- `assets/images/hero/plataforma-hero.png` ← `imgs/fotohero.png`

### Regras validadas
- Zero hex hardcoded em CSS (todos via `variables.css`)
- Guard clause em todos os módulos JS
- `markers: false` em todos os ScrollTriggers
- Mobile-first em todos os componentes
- `prefers-reduced-motion` implementado

---
