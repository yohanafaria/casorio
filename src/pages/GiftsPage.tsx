import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  ShoppingBag,
  Check,
  Sparkles,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { Gift } from '../types';
import { giftService } from '../services/giftService';
import { useCart } from '../features/cart/CartContext';
import { GiftDetailModal } from '../features/gifts/GiftDetailModal';
import { formatCurrencyBRL } from '../utils/formatters';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'name_asc';

export const GiftsPage: React.FC = () => {
  useDocumentMeta({
    title: 'Lista de Presentes — Experiências de Lua de Mel',
    description:
      'Escolha uma experiência de lua de mel ou contribua com uma cota especial para a viagem de Daniel e Yohana.',
  });

  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [selectedGiftForModal, setSelectedGiftForModal] = useState<Gift | null>(null);

  const {
    addToCart,
    recentlyAddedId,
    totalItemsCount,
    total,
    openCartDrawer,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    giftService
      .getGifts()
      .then((data) => {
        if (mounted) {
          setGifts(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar presentes.');
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredAndSortedGifts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = gifts.filter((gift) => {
      const matchesQuery =
        !query ||
        gift.name.toLowerCase().includes(query) ||
        gift.description.toLowerCase().includes(query);
      return matchesQuery;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name, 'pt-BR');
      return 0;
    });
  }, [gifts, searchQuery, sortBy]);

  return (
    <div className="pb-24">
      {/* Cabeçalho da Lista de Presentes */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-warmwhite border-b border-blush/35 text-center">
        <div className="max-w-3xl mx-auto space-y-4 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-olive font-medium">
            <Sparkles className="w-3.5 h-3.5 text-burgundy" aria-hidden="true" />
            <span>Experiências &amp; Memórias na Lua de Mel</span>
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl text-burgundy">
            Lista de Presentes
          </h1>
          <p className="text-base sm:text-lg text-graphite-muted leading-relaxed">
            Trocamos os itens de casa por memórias que levaremos para sempre: escolha uma experiência da nossa lua de mel e deixe um recado especial.
          </p>
        </div>
      </section>

      {/* Barra de Busca e Ordenação */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="p-5 sm:p-6 rounded-organic bg-warmwhite border border-blush/45">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Busca */}
            <div className="md:col-span-7 relative">
              <label htmlFor="gift-search-input" className="sr-only">
                Buscar experiência por nome ou descrição
              </label>
              <Search
                className="w-4 h-4 text-graphite-muted absolute left-4 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="gift-search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por jantar, passeio de barco, spa, passagens..."
                className="w-full pl-11 pr-4 py-3 rounded-full border border-blush/60 bg-ivory/50 text-sm text-graphite placeholder:text-graphite-light focus:bg-warmwhite transition-colors"
              />
            </div>

            {/* Ordenação por preço */}
            <div className="md:col-span-5 flex items-center gap-3">
              <SlidersHorizontal
                className="w-4 h-4 text-olive shrink-0 hidden sm:block"
                aria-hidden="true"
              />
              <label htmlFor="gift-sort-select" className="text-xs text-graphite-muted shrink-0">
                Ordenar por:
              </label>
              <select
                id="gift-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="flex-1 py-3 px-4 rounded-full border border-blush/60 bg-ivory/50 text-sm text-graphite"
              >
                <option value="featured">Destaques da viagem</option>
                <option value="price_asc">Menor valor primeiro</option>
                <option value="price_desc">Maior valor primeiro</option>
                <option value="name_asc">Ordem alfabética (A–Z)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Grade de Presentes */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-96 rounded-organic bg-warmwhite border border-blush/35 p-5 animate-pulse flex flex-col justify-between"
              >
                <div className="w-full h-48 rounded-xl bg-ivory-dark" />
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-ivory-dark rounded" />
                  <div className="h-6 w-3/4 bg-ivory-dark rounded" />
                  <div className="h-10 w-full bg-ivory-dark rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-10 rounded-organic bg-warmwhite border border-burgundy/40 text-center space-y-4">
            <AlertCircle className="w-8 h-8 text-burgundy mx-auto" aria-hidden="true" />
            <h2 className="font-serif text-2xl text-graphite">{error}</h2>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.15em]"
            >
              Tentar novamente
            </button>
          </div>
        ) : filteredAndSortedGifts.length === 0 ? (
          <div className="p-12 rounded-organic bg-warmwhite border border-blush/45 text-center space-y-4">
            <p className="font-serif text-3xl text-graphite">
              Nenhum presente encontrado para essa busca
            </p>
            <p className="text-sm text-graphite-muted">
              Tente limpar os filtros ou buscar por outro termo.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-full border border-burgundy text-burgundy text-xs uppercase tracking-[0.15em] font-semibold"
            >
              Mostrar todas as experiências
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedGifts.map((gift) => {
              const availability = giftService.getAvailabilityStatus(gift);
              const isSoldOut = availability === 'sold_out';
              const isRecentlyAdded = recentlyAddedId === gift.id;

              return (
                <article
                  key={gift.id}
                  className={`group rounded-organic bg-warmwhite border transition-all flex flex-col justify-between overflow-hidden ${
                    isSoldOut
                      ? 'border-blush/30 opacity-75'
                      : 'border-blush/50 hover:border-burgundy/50'
                  }`}
                >
                  <div>
                    {/* Imagem + Badges */}
                    <div className="relative aspect-[4/3] bg-ivory overflow-hidden border-b border-blush/30">
                      <img
                        src={gift.image}
                        alt={gift.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-warmwhite/90 backdrop-blur-xs text-[10px] uppercase tracking-[0.16em] text-olive font-semibold border border-blush/40">
                          {gift.category}
                        </span>
                        {gift.badge && !isSoldOut && (
                          <span className="px-2.5 py-1 rounded-full bg-burgundy text-warmwhite text-[10px] uppercase tracking-[0.14em] font-medium">
                            {gift.badge}
                          </span>
                        )}
                      </div>

                      {/* Badge de disponibilidade */}
                      <div className="absolute bottom-3 right-3">
                        {availability === 'sold_out' && (
                          <span className="px-3 py-1 rounded-full bg-graphite text-warmwhite text-[11px] font-medium">
                            Já presenteado (Esgotado)
                          </span>
                        )}
                        {availability === 'reserved' && (
                          <span className="px-3 py-1 rounded-full bg-blush-light text-burgundy border border-burgundy/30 text-[11px] font-medium">
                            Reservado / Última unidade
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Corpo do Card */}
                    <div className="p-6 space-y-2.5">
                      <h2 className="font-serif text-2xl text-graphite leading-snug">
                        {gift.name}
                      </h2>
                      <p className="text-sm text-graphite-muted line-clamp-2 leading-relaxed">
                        {gift.description}
                      </p>
                    </div>
                  </div>

                  {/* Preço e Ações */}
                  <div className="p-6 pt-0 space-y-4">
                    <div className="flex items-baseline justify-between border-t border-blush/35 pt-4">
                      <div>
                        <span className="text-[11px] uppercase tracking-[0.14em] text-graphite-muted block">
                          {gift.allowPartialContribution
                            ? 'Valor integral ou em cotas'
                            : 'Valor do presente'}
                        </span>
                        <span className="font-serif text-2xl font-semibold text-burgundy">
                          {formatCurrencyBRL(gift.price)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedGiftForModal(gift)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-olive hover:text-burgundy transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Detalhes</span>
                      </button>
                    </div>

                    <div className="flex gap-2">
                      {isSoldOut ? (
                        <button
                          type="button"
                          disabled
                          className="w-full py-3 px-4 rounded-full bg-ivory-dark text-graphite-muted text-xs uppercase tracking-[0.15em] font-medium cursor-not-allowed"
                        >
                          Item já presenteado
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => addToCart(gift, 1, false)}
                            className={`flex-1 py-3 px-4 rounded-full text-xs uppercase tracking-[0.15em] font-semibold transition-all flex items-center justify-center gap-2 ${
                              isRecentlyAdded
                                ? 'bg-olive text-warmwhite'
                                : 'bg-burgundy text-warmwhite hover:bg-burgundy-dark'
                            }`}
                          >
                            {isRecentlyAdded ? (
                              <>
                                <Check className="w-4 h-4" aria-hidden="true" />
                                <span>Adicionado!</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                                <span>Presentear</span>
                              </>
                            )}
                          </button>

                          {gift.allowPartialContribution && (
                            <button
                              type="button"
                              onClick={() => setSelectedGiftForModal(gift)}
                              className="py-3 px-3.5 rounded-full border border-burgundy/40 text-burgundy text-xs font-medium hover:bg-burgundy/10 transition-colors"
                              title="Escolher cota parcial"
                            >
                              Cotas
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Barra Flutuante de Resumo do Carrinho quando houver itens */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-3xl mx-auto z-30 animate-fade-in-up">
          <div className="p-4 sm:px-6 rounded-full bg-wine text-ivory shadow-xl border border-blush/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-burgundy flex items-center justify-center text-xs font-bold">
                {totalItemsCount}
              </span>
              <div>
                <p className="text-xs text-blush">Total na sua sacola de presentes</p>
                <p className="font-serif text-xl font-semibold text-warmwhite leading-none">
                  {formatCurrencyBRL(total)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={openCartDrawer}
                className="px-4 py-2.5 rounded-full border border-ivory/35 text-xs uppercase tracking-[0.14em] hover:bg-ivory/10 transition-colors"
              >
                Ver sacola
              </button>
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="px-5 py-2.5 rounded-full bg-ivory text-burgundy text-xs uppercase tracking-[0.14em] font-semibold hover:bg-blush-light transition-colors"
              >
                Finalizar presente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes e Contribuição Parcial */}
      <GiftDetailModal
        gift={selectedGiftForModal}
        onClose={() => setSelectedGiftForModal(null)}
        onAddToCart={addToCart}
      />
    </div>
  );
};
