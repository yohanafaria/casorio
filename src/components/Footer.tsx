import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Heart, MapPin, Calendar, Palette } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { Monogram } from './Monogram';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-wine text-ivory overflow-hidden mt-20">
      {/* Divisor superior em onda orgânica imitando tecido */}
      <svg
        viewBox="0 0 1440 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-10 sm:h-16 -mt-1 block"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 0 L1440 0 L1440 35 C1120 90, 720 -15, 0 55 Z"
          fill="#F5F0E8"
        />
      </svg>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-ivory/15">
          {/* Coluna 1: Identidade e frase musical */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <Monogram size="md" variant="ivory" />
              <div>
                <p className="font-serif text-3xl text-ivory tracking-tight">
                  {weddingConfig.couple.fullTitle}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-blush">
                  {weddingConfig.date.shortDate} • {weddingConfig.location.city}
                </p>
              </div>
            </div>
            <p className="font-serif italic text-xl text-blush-light/90 leading-relaxed pt-2">
              “{weddingConfig.texts.heroQuote}”
            </p>
            {Boolean(
              (weddingConfig.texts as { musicalInspirationNote?: string }).musicalInspirationNote
            ) && (
              <p className="text-xs text-ivory/70 flex items-center gap-2">
                <Music className="w-3.5 h-3.5 text-blush shrink-0" aria-hidden="true" />
                <span>
                  {(weddingConfig.texts as { musicalInspirationNote?: string }).musicalInspirationNote}
                </span>
              </p>
            )}
          </div>

          {/* Coluna 2: Navegação rápida */}
          <div className="md:col-span-3 space-y-3">
            <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-blush">
              Caminhos do site
            </h2>
            <ul className="space-y-2 text-sm text-ivory/85">
              <li>
                <Link to="/" className="hover:text-blush transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/local" className="hover:text-blush transition-colors">
                  Local &amp; Como chegar
                </Link>
              </li>
              <li>
                <Link to="/presentes" className="hover:text-blush transition-colors">
                  Lista de presentes
                </Link>
              </li>
              <li>
                <Link to="/confirmar-presenca" className="hover:text-blush transition-colors">
                  Confirme sua presença (RSVP)
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/identidade-visual"
                  className="inline-flex items-center gap-1.5 text-xs text-blush hover:text-ivory transition-colors"
                >
                  <Palette className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Guia de Identidade &amp; Design System</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Resumo do Encontro */}
          <div className="md:col-span-4 space-y-3">
            <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-blush">
              Nosso Encontro
            </h2>
            <div className="space-y-2.5 text-sm text-ivory/85">
              <p className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-blush shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  {weddingConfig.date.displayDate} ({weddingConfig.date.dayOfWeek}) às{' '}
                  {weddingConfig.date.ceremonyTime}
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blush shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  {weddingConfig.location.venueName} — {weddingConfig.location.addressLine1}
                </span>
              </p>
            </div>
            <div className="pt-3">
              <Link
                to="/confirmar-presenca"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-ivory text-burgundy text-xs uppercase tracking-[0.16em] font-semibold hover:bg-blush-light transition-colors"
              >
                Confirmar Presença
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/60">
          <p className="flex items-center gap-1.5">
            Feito com açúcar e com afeto por nós dois 
            <Heart className="w-3.5 h-3.5 text-blush fill-blush" aria-hidden="true" />
          </p>
          <p>{weddingConfig.couple.hashtag}</p>
        </div>
      </div>
    </footer>
  );
};
