# Notas de acessibilidade (botões e links)

## Decisões WCAG / ARIA

- **Semântica:** Navegação com `<a href>`. Não há `<div>` clicáveis; ações futuras devem usar `<button>`.
- **Focus:** `:focus { outline: none }` + `:focus-visible` com outline 2px `#151515` e offset 2px (contraste ≥ 3:1 no fundo `#FDFDFD`).
- **Hover:** Cor `#5A5A5A` sobre `#FDFDFD` (~6.8:1, WCAG AA); sem sublinhado; `transition: color 0.18s ease-out`.
- **Active:** `#3A3A3A` + `translateY(1px)` (~11.2:1 sobre `#FDFDFD`).
- **Disabled:** Apenas cards de projeto sem case study (`aria-disabled="true"`, `tabindex="-1"`); sem opacidade reduzida, mas sem interação (`pointer-events: none`) e cursor `not-allowed`.
- **Nomes acessíveis:** Cards com `aria-label` descritivo; externos com “(opens in new tab)”; ícone do back com `aria-hidden="true"`.
- **Skip link:** “Skip to content” → `#main-content` para utilizadores de teclado.
- **Vídeos nos cards:** `aria-hidden="true"` porque o link pai já tem nome acessível (evita leitura duplicada).
- **Reduced motion:** `prefers-reduced-motion` desativa transições e `translateY` nos estados active.

## Contraste (referência)

- Texto `#151515` em fundo `#fdfdfd`: ~16.5:1 (passa AA/AAA para texto normal).
- Meta `#666666` em branco: ~5.7:1 (passa AA para texto 14px).
- Skip link: texto branco em fundo `#151515`.
