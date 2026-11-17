import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  ArrowDown,
  ArrowRight,
  Gift,
  Sparkles,
  Music,
  ExternalLink,
} from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import {
  BotanicalCornerLeft,
  BotanicalCornerRight,
  ArchitecturalWaveBackdrop,
} from '../components/BotanicalMotifs';
import { Monogram } from '../components/Monogram';
import { CountdownTimer } from '../components/CountdownTimer';

export const HomePage: React.FC = () => {
  useDocumentMeta({
    title: 'Início — Nosso Casamento',
    description: weddingConfig.texts.heroSubquote,
  });

  // Dados estruturados Schema.org para o evento
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SocialEvent',
    name: `Casamento de ${weddingConfig.couple.fullTitle}`,
    startDate: weddingConfig.date.iso,
    location: {
      '@type': 'Place',
      name: weddingConfig.location.venueName,
      address: weddingConfig.location.fullAddress,
    },
    description: weddingConfig.texts.heroSubquote,
  };

  return (
    <div className="overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      {/* 1. HERO MINIMALISTA EM TELA QUASE CHEIA */}
      <section className="relative min-h-[88vh] flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 pt-10 pb-14 bg-linen-texture">
        {/* Grafismos botânicos sutis nas laterais */}
        <BotanicalCornerLeft className="absolute left-0 bottom-8 w-52 sm:w-72 md:w-80 opacity-85" />
        <BotanicalCornerRight className="absolute right-0 top-6 w-52 sm:w-72 md:w-80 opacity-85" />

        {/* Ondas de tecido arquitetônico ao fundo */}
        <ArchitecturalWaveBackdrop className="absolute bottom-0 left-0 right-0 h-44 sm:h-64" />

        <div className="div-spacer" aria-hidden="true" />

        {/* Conteúdo central com bastante respiro visual */}
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up my-auto py-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-blush/60 bg-warmwhite/75 text-olive text-xs uppercase tracking-[0.24em]">
            <span>{weddingConfig.date.shortDate}</span>
            <span aria-hidden="true">•</span>
            <span>{weddingConfig.location.city}</span>
          </div>

          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl text-burgundy tracking-tight leading-[1.03]">
            {weddingConfig.couple.partner1}{' '}
            <span className="italic font-normal text-olive">&amp;</span>{' '}
            {weddingConfig.couple.partner2}
          </h1>

          <p className="font-serif italic text-2xl sm:text-3xl text-graphite max-w-xl mx-auto leading-relaxed">
            “{weddingConfig.texts.heroQuote}”
          </p>

          <p className="text-sm sm:text-base text-graphite-muted max-w-lg mx-auto leading-relaxed">
            {weddingConfig.texts.heroSubquote}
          </p>

          {/* CTAs Principal e Secundário */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/confirmar-presenca"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.18em] font-semibold hover:bg-burgundy-dark transition-all"
            >
              <span>Confirmar presença</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>

            <Link
              to="/presentes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full border border-burgundy/45 bg-warmwhite/85 text-burgundy text-xs uppercase tracking-[0.18em] font-semibold hover:bg-ivory-dark transition-all"
            >
              <Gift className="w-4 h-4" aria-hidden="true" />
              <span>Ver lista de presentes</span>
            </Link>
          </div>
        </div>

        {/* Indicação delicada para continuar rolando */}
        <a
          href="#boas-vindas"
          className="relative z-10 inline-flex flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-graphite-muted hover:text-burgundy transition-colors mt-6"
          aria-label="Rolar para a mensagem de boas-vindas"
        >
          <span>Descubra nosso encontro</span>
          <ArrowDown className="w-4 h-4 animate-bounce text-burgundy" aria-hidden="true" />
        </a>
      </section>

      {/* 2. MENSAGEM DE BOAS-VINDAS & CONTAGEM REGRESSIVA */}
      <section
        id="boas-vindas"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-warmwhite border-y border-blush/30"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Monogram size="md" variant="olive" />

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-olive font-medium">
              Nosso melhor encontro está chegando
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-burgundy">
              {weddingConfig.texts.welcomeTitle}
            </h2>
          </div>

          <p className="text-base sm:text-lg text-graphite-muted leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
            {weddingConfig.texts.welcomeBody}
          </p>

          <div className="pt-6">
            <CountdownTimer targetIsoDate={weddingConfig.date.iso} />
          </div>
        </div>
      </section>

      {/* 3. RESUMO COM DATA, HORÁRIO, LOCAL E ACESSO RÁPIDO AO MAPA */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-olive font-medium">
              <Sparkles className="w-3.5 h-3.5 text-burgundy" aria-hidden="true" />
              <span>Quando &amp; Onde</span>
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-graphite leading-tight">
               Uma tarde entre árvores, amigos e samba
            </h2>
            <p className="text-sm sm:text-base text-graphite-muted leading-relaxed">
              Tanto a cerimônia quanto a festa acontecerão no mesmo espaço, cercado pela natureza do Rio, para que você aproveite cada instante com conforto.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/local"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-olive text-warmwhite text-xs uppercase tracking-[0.16em] font-semibold hover:bg-olive-dark transition-colors"
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>Ver mapa e dicas de chegada</span>
              </Link>
              <a
                href={weddingConfig.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-olive/40 text-olive text-xs uppercase tracking-[0.16em] font-semibold hover:bg-olive/10 transition-colors"
              >
                <span>Abrir no Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 rounded-organic bg-warmwhite border border-blush/45 space-y-3">
              <div className="w-10 h-10 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center">
                <Calendar className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-2xl text-graphite">A Data</h3>
              <p className="text-sm text-graphite-muted">
                {weddingConfig.date.displayDate}
                <br />
                <span className="text-olive font-medium">{weddingConfig.date.dayOfWeek}</span>
              </p>
            </div>

            <div className="p-6 rounded-organic bg-warmwhite border border-blush/45 space-y-3">
              <div className="w-10 h-10 rounded-full bg-olive/15 text-olive flex items-center justify-center">
                <Clock className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-2xl text-graphite">O Horário</h3>
              <p className="text-sm text-graphite-muted">
                Cerimônia às <strong>{weddingConfig.date.ceremonyTime}</strong>
                <br />
                Recepção a seguir
              </p>
            </div>

            <div className="p-6 rounded-organic bg-warmwhite border border-blush/45 space-y-3">
              <div className="w-10 h-10 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center">
                <MapPin className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-2xl text-graphite">O Lugar</h3>
              <p className="text-sm text-graphite-muted">
                {weddingConfig.location.venueName}
                <br />
                <span className="text-xs">{weddingConfig.location.neighborhood}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEÇÃO CURTA SOBRE O CASAL (PREPARADA PARA FOTOS) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-ivory-dark/45 border-t border-blush/35">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Molduras arquitetônicas em arco inspiradas em arcoondas.jpg */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 sm:gap-6">
            <div className="aspect-[3/4] rounded-arch bg-warmwhite border border-blush/50 p-3 flex flex-col justify-end relative overflow-hidden group">
              <svg
                viewBox="0 0 300 400"
                className="absolute inset-0 w-full h-full object-cover"
                aria-hidden="true"
              >
                <rect width="300" height="400" fill="#F5F0E8" />
                <circle cx="150" cy="145" r="75" fill="#D8B8AF" opacity="0.45" />
                <path
                  d="M0 320 C90 260, 210 350, 300 280 L300 400 L0 400 Z"
                  fill="#621F2A"
                  opacity="0.78"
                />
                <path
                  d="M40 360 Q110 210 215 110"
                  stroke="#596044"
                  strokeWidth="2.5"
                  fill="none"
                />
              </svg>
              <div className="relative z-10 bg-warmwhite/90 backdrop-blur-xs p-3.5 rounded-xl border border-blush/30">
                <p className="font-serif text-lg text-burgundy leading-tight">
                  Domingos de sol &amp; vinil
                </p>
                <p className="text-[11px] text-graphite-muted">
                  Espaço preparado para foto do casal
                </p>
              </div>
            </div>

            <div className="aspect-[3/4] rounded-arch bg-warmwhite border border-blush/50 p-3 flex flex-col justify-end relative overflow-hidden mt-8">
              <svg
                viewBox="0 0 300 400"
                className="absolute inset-0 w-full h-full object-cover"
                aria-hidden="true"
              >
                <rect width="300" height="400" fill="#EAE2D6" />
                <path
                  d="M0 290 C120 230, 180 330, 300 250 L300 400 L0 400 Z"
                  fill="#596044"
                  opacity="0.75"
                />
                <circle cx="165" cy="150" r="65" fill="#621F2A" opacity="0.22" />
                <path
                  d="M75 110 C130 190, 170 250, 245 330"
                  stroke="#621F2A"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
              <div className="relative z-10 bg-warmwhite/90 backdrop-blur-xs p-3.5 rounded-xl border border-blush/30">
                <p className="font-serif text-lg text-olive leading-tight">
                  Risos e mesa comprida
                </p>
                <p className="text-[11px] text-graphite-muted">
                  Espaço preparado para ensaio pré-wedding
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-burgundy font-medium">
              <Music className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Nossa Sintonia</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-graphite leading-tight">
              {weddingConfig.texts.coupleSectionTitle}
            </h2>
            {Boolean(
              (weddingConfig.texts as { coupleSectionSubtitle?: string }).coupleSectionSubtitle
            ) && (
              <p className="text-base text-graphite-muted leading-relaxed">
                {(weddingConfig.texts as { coupleSectionSubtitle?: string }).coupleSectionSubtitle}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 5. CHAMADAS FINAIS PARA RSVP E LISTA DE PRESENTES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card RSVP */}
          <div className="p-8 sm:p-10 rounded-organic bg-burgundy text-ivory flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-3 relative z-10">
              <span className="text-xs uppercase tracking-[0.22em] text-blush">
                Confirmação de Presença
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-warmwhite">
                Vem celebrar esse encontro com a gente?
              </h3>
              <p className="text-sm text-ivory/85 leading-relaxed">
                Confirme sua presença até <strong>{weddingConfig.rsvp.deadlineDisplay}</strong>, informe acompanhantes e eventuais restrições alimentares em menos de 1 minuto.
              </p>
            </div>
            <div className="relative z-10">
              <Link
                to="/confirmar-presenca"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-warmwhite text-burgundy text-xs uppercase tracking-[0.16em] font-semibold hover:bg-blush-light transition-colors"
              >
                <span>Ir para o RSVP</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Card Presentes */}
          <div className="p-8 sm:p-10 rounded-organic bg-warmwhite border border-blush/55 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.22em] text-olive">
                Mimos &amp; Experiências
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-graphite">
                Nossa Lista de Presentes
              </h3>
              <p className="text-sm text-graphite-muted leading-relaxed">
                Trocamos os itens de casa por memórias que levaremos para sempre. Escolha uma experiência para a nossa lua de mel e deixe um recado especial.
              </p>
            </div>
            <div>
              <Link
                to="/presentes"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-olive text-warmwhite text-xs uppercase tracking-[0.16em] font-semibold hover:bg-olive-dark transition-colors"
              >
                <Gift className="w-4 h-4" aria-hidden="true" />
                <span>Explorar lista de presentes</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
