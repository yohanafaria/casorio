import React from 'react';
import { Monogram } from '../components/Monogram';
import { BotanicalCornerLeft } from '../components/BotanicalMotifs';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const PALETTE_SWATCHES = [
  { name: 'Ivory (Base Principal)', hex: '#F5F0E8', usage: 'Fundos principais, respiro editorial', textDark: true },
  { name: 'Branco Quente', hex: '#FCFAF6', usage: 'Superfícies de cards, modais e áreas de leitura', textDark: true },
  { name: 'Bordô Profundo', hex: '#621F2A', usage: 'Títulos principais, CTAs primários, antúrios', textDark: false },
  { name: 'Vinho Escuro', hex: '#40151D', usage: 'Rodapé, contrastes intensos e estados hover', textDark: false },
  { name: 'Verde Oliva', hex: '#596044', usage: 'Destaques botânicos, tags, ações secundárias', textDark: false },
  { name: 'Verde Eucalipto', hex: '#7E8C78', usage: 'Folhagens, ilustrações e estados suaves', textDark: false },
  { name: 'Blush Discreto', hex: '#D8B8AF', usage: 'Bordas finas, linhas orgânicas e divisores', textDark: true },
  { name: 'Grafite Quente', hex: '#292622', usage: 'Texto corrido com alto contraste WCAG AA', textDark: false },
];

export const DesignSystemPage: React.FC = () => {
  useDocumentMeta({
    title: 'Identidade Visual & Design System',
    description: 'Guia interno da identidade visual autoral do casamento de Daniel e Yohana.',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      {/* Cabeçalho */}
      <header className="space-y-4 border-b border-blush/45 pb-8">
        <span className="text-xs uppercase tracking-[0.22em] text-olive font-semibold">
          Direção de Arte &amp; Guia de Identidade Visual
        </span>
        <h1 className="font-serif text-5xl text-burgundy">
          Sistema Visual — Daniel &amp; Yohana
        </h1>
        <p className="text-base text-graphite-muted max-w-3xl leading-relaxed">
          Concebido a partir das referências de arcos arquitetônicos fluidos (<code>arcoondas.jpg</code>), tecidos bordô drapeados (<code>floress.jpg</code>), paleta orgânica (<code>cores.jpg</code>) e botânica tropical escultural com eucaliptos, antúrios e copos-de-leite escuros (<code>flores.jpg</code>).
        </p>
      </header>

      {/* 1. Assinatura Principal e Monograma */}
      <section className="space-y-6">
        <h2 className="font-serif text-3xl text-graphite">
          1. Assinatura Principal &amp; Monograma “D &amp; Y”
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-organic bg-warmwhite border border-blush/50 flex flex-col items-center justify-center text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-graphite-muted">
              Assinatura Editorial
            </span>
            <p className="font-serif text-4xl text-burgundy">
              Daniel <span className="italic font-normal text-olive">&amp;</span> Yohana
            </p>
          </div>

          <div className="p-8 rounded-organic bg-warmwhite border border-blush/50 flex flex-col items-center justify-center text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-graphite-muted">
              Monograma Versão Clara
            </span>
            <div className="flex items-center gap-4">
              <Monogram size="sm" variant="burgundy" />
              <Monogram size="md" variant="olive" />
              <Monogram size="lg" variant="burgundy" />
            </div>
          </div>

          <div className="p-8 rounded-organic bg-wine text-ivory flex flex-col items-center justify-center text-center space-y-3">
            <span className="text-xs uppercase tracking-widest text-blush">
              Monograma Versão Noturna
            </span>
            <Monogram size="lg" variant="ivory" />
          </div>
        </div>
      </section>

      {/* 2. Paleta de Cores */}
      <section className="space-y-6">
        <h2 className="font-serif text-3xl text-graphite">
          2. Paleta Cromática &amp; Contraste
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PALETTE_SWATCHES.map((swatch) => (
            <div
              key={swatch.hex}
              className="rounded-organic overflow-hidden border border-blush/50 bg-warmwhite flex flex-col justify-between"
            >
              <div
                className="h-28 p-4 flex items-end justify-between"
                style={{ backgroundColor: swatch.hex }}
              >
                <span
                  className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                    swatch.textDark
                      ? 'bg-warmwhite/85 text-graphite'
                      : 'bg-graphite/60 text-warmwhite'
                  }`}
                >
                  {swatch.hex}
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-serif text-xl text-graphite">{swatch.name}</h3>
                <p className="text-xs text-graphite-muted">{swatch.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Tipografia */}
      <section className="space-y-6">
        <h2 className="font-serif text-3xl text-graphite">3. Hierarquia Tipográfica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-organic bg-warmwhite border border-blush/50 space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-olive font-semibold">
              Títulos &amp; Destaques Editoriais
            </span>
            <p className="font-serif text-4xl text-burgundy">Cormorant Garamond</p>
            <p className="font-serif italic text-2xl text-graphite">
              “A vida fica mais feliz quando é compartilhada.”
            </p>
            <p className="text-xs text-graphite-muted">
              Serifada contemporânea de alto contraste, excelente suporte a acentuação em português e curvas inspiradas na estética editorial brasileira.
            </p>
          </div>

          <div className="p-8 rounded-organic bg-warmwhite border border-blush/50 space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] text-olive font-semibold">
              Interface, Leitura &amp; Formulários
            </span>
            <p className="font-sans text-3xl font-semibold text-graphite">Plus Jakarta Sans</p>
            <p className="font-sans text-sm text-graphite-muted leading-relaxed">
              Sans-serif geométrica humanista limpa, altamente legível em telas mobile (a partir de 320px), botões, filtros do marketplace e rótulos de formulário.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Componentes e Grafismos */}
      <section className="space-y-6">
        <h2 className="font-serif text-3xl text-graphite">
          4. Botões, Estados Interativos &amp; Grafismo Botânico
        </h2>
        <div className="p-8 rounded-organic bg-warmwhite border border-blush/50 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.18em] text-graphite-muted">
              Botões &amp; Controles
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="px-6 py-3 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.16em] font-semibold hover:bg-burgundy-dark transition-all"
              >
                Primário Bordô
              </button>
              <button
                type="button"
                className="px-6 py-3 rounded-full bg-olive text-warmwhite text-xs uppercase tracking-[0.16em] font-semibold hover:bg-olive-dark transition-all"
              >
                Secundário Oliva
              </button>
              <button
                type="button"
                className="px-6 py-3 rounded-full border border-burgundy/45 text-burgundy text-xs uppercase tracking-[0.16em] font-semibold hover:bg-ivory transition-all"
              >
                Outline Editorial
              </button>
            </div>
            <p className="text-xs text-graphite-muted pt-2">
              Cards utilizam o raio assimétrico <code>rounded-organic</code> (<code>24px 8px 24px 8px</code>), evitando a rigidez de templates tradicionais e remetendo ao corte de folhas e tecidos fluidos.
            </p>
          </div>

          <div className="relative h-56 rounded-organic bg-ivory border border-blush/40 overflow-hidden flex items-center justify-center">
            <BotanicalCornerLeft className="w-48 h-48" />
            <span className="text-xs text-olive font-medium px-4">
              Recorte vetorial: Eucalipto, Antúrio Bordô &amp; Amaranto
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
