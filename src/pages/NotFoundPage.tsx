import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const NotFoundPage: React.FC = () => {
  useDocumentMeta({
    title: 'Página não encontrada (404)',
  });

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-warmwhite border border-blush/60 flex items-center justify-center text-burgundy">
        <Compass className="w-7 h-7" aria-hidden="true" />
      </div>

      <div className="space-y-2 max-w-md">
        <span className="text-xs uppercase tracking-[0.22em] text-olive font-semibold">
          Erro 404 • Desvio no Caminho
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-burgundy">
          Esse acorde não está na nossa partitura
        </h1>
        <p className="text-sm text-graphite-muted leading-relaxed">
          A página que você tentou acessar mudou de endereço ou não existe. Mas a roda de samba continua logo ali no início!
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.16em] font-semibold hover:bg-burgundy-dark transition-all"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Voltar para a Página Inicial</span>
      </Link>
    </div>
  );
};
