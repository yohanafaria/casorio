import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Minus, ShoppingBag, Music, Check } from 'lucide-react';
import { Gift } from '../../types';
import { giftService } from '../../services/giftService';
import { formatCurrencyBRL } from '../../utils/formatters';

interface GiftDetailModalProps {
  gift: Gift | null;
  onClose: () => void;
  onAddToCart: (
    gift: Gift,
    quantity: number,
    isPartialContribution: boolean,
    customAmount?: number
  ) => void;
}

export const GiftDetailModal: React.FC<GiftDetailModalProps> = ({
  gift,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [contributionMode, setContributionMode] = useState<'full' | 'partial'>('full');
  const [customAmount, setCustomAmount] = useState<number>(0);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (gift) {
      setQuantity(1);
      setContributionMode('full');
      setCustomAmount(
        gift.suggestedContributions && gift.suggestedContributions.length > 0
          ? gift.suggestedContributions[0]
          : Math.round(gift.price / 2)
      );
      closeBtnRef.current?.focus();
    }
  }, [gift]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && gift) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gift, onClose]);

  if (!gift) return null;

  const availability = giftService.getAvailabilityStatus(gift);
  const isSoldOut = availability === 'sold_out';

  const handleConfirmAdd = () => {
    if (isSoldOut) return;
    const isPartial = gift.allowPartialContribution && contributionMode === 'partial';
    const validCustom = isPartial ? Math.max(50, customAmount || 100) : undefined;
    onAddToCart(gift, quantity, isPartial, validCustom);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gift-modal-title"
    >
      <div
        className="fixed inset-0 bg-graphite/60 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl rounded-organic bg-warmwhite border border-blush/50 shadow-2xl overflow-hidden animate-fade-in-up my-8">
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-warmwhite/90 border border-blush/50 flex items-center justify-center text-graphite hover:text-burgundy transition-colors"
          aria-label="Fechar detalhes do presente"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-5 bg-ivory flex flex-col justify-between p-6 border-b md:border-b-0 md:border-r border-blush/35">
            <img
              src={gift.image}
              alt={gift.name}
              className="w-full aspect-[4/3] md:aspect-square object-cover rounded-xl border border-blush/30 bg-warmwhite"
            />
            {gift.musicalNote && (
              <div className="mt-4 p-3 rounded-xl bg-warmwhite/80 border border-blush/35 flex items-center gap-2 text-xs text-olive">
                <Music className="w-4 h-4 text-burgundy shrink-0" aria-hidden="true" />
                <span className="italic">{gift.musicalNote}</span>
              </div>
            )}
          </div>

          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full bg-olive/15 text-olive font-medium">
                  {gift.category}
                </span>
                {availability === 'available' && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-eucalyptus/20 text-olive-dark font-medium">
                    Disponível ({gift.availableQuantity} un.)
                  </span>
                )}
                {availability === 'reserved' && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blush/40 text-burgundy font-medium">
                    Última unidade / Reservado recentemente
                  </span>
                )}
                {availability === 'sold_out' && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-graphite/15 text-graphite-muted font-medium">
                    Esgotado
                  </span>
                )}
              </div>

              <h2 id="gift-modal-title" className="font-serif text-3xl text-graphite leading-tight">
                {gift.name}
              </h2>

              <p className="font-serif text-3xl font-semibold text-burgundy">
                {formatCurrencyBRL(gift.price)}
              </p>

              <p className="text-sm text-graphite-muted leading-relaxed">
                {gift.longDescription || gift.description}
              </p>
            </div>

            {!isSoldOut && (
              <div className="space-y-4 pt-2 border-t border-blush/35">
                {/* Opção de contribuição integral ou parcial quando habilitada */}
                {gift.allowPartialContribution && (
                  <div className="space-y-2.5">
                    <label className="block text-xs uppercase tracking-[0.16em] text-graphite-muted font-medium">
                      Modalidade do presente
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setContributionMode('full')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-left transition-all flex items-center justify-between ${
                          contributionMode === 'full'
                            ? 'border-burgundy bg-burgundy/10 text-burgundy'
                            : 'border-blush/50 bg-ivory/50 text-graphite'
                        }`}
                      >
                        <span>Valor integral</span>
                        {contributionMode === 'full' && <Check className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setContributionMode('partial')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-medium border text-left transition-all flex items-center justify-between ${
                          contributionMode === 'partial'
                            ? 'border-burgundy bg-burgundy/10 text-burgundy'
                            : 'border-blush/50 bg-ivory/50 text-graphite'
                        }`}
                      >
                        <span>Contribuir com cota</span>
                        {contributionMode === 'partial' && <Check className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {contributionMode === 'partial' && (
                      <div className="p-3.5 rounded-xl bg-ivory/75 border border-blush/45 space-y-2.5">
                        <p className="text-xs text-graphite-muted">
                          Escolha uma cota sugerida ou digite o valor que desejar (mínimo R$ 50):
                        </p>
                        {gift.suggestedContributions && (
                          <div className="flex flex-wrap gap-2">
                            {gift.suggestedContributions.map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setCustomAmount(val)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                  customAmount === val
                                    ? 'bg-burgundy text-warmwhite'
                                    : 'bg-warmwhite border border-blush/60 text-graphite hover:border-burgundy'
                                }`}
                              >
                                {formatCurrencyBRL(val)}
                              </button>
                            ))}
                          </div>
                        )}
                        <div>
                          <label htmlFor="custom-partial-amount" className="sr-only">
                            Valor da contribuição em reais
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-graphite-muted font-medium">
                              R$
                            </span>
                            <input
                              id="custom-partial-amount"
                              type="number"
                              min={50}
                              max={gift.price}
                              step={10}
                              value={customAmount}
                              onChange={(e) => setCustomAmount(Number(e.target.value))}
                              className="w-full pl-9 pr-3 py-2 rounded-lg border border-blush/60 bg-warmwhite text-sm text-graphite"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Controle de Quantidade */}
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.16em] text-graphite-muted font-medium">
                    Quantidade
                  </span>
                  <div className="inline-flex items-center rounded-full border border-blush/60 bg-ivory/50">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center text-graphite hover:text-burgundy"
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <span className="px-4 text-sm font-medium text-graphite">{quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity((q) => Math.min(gift.availableQuantity, q + 1))
                      }
                      disabled={quantity >= gift.availableQuantity}
                      className="w-9 h-9 flex items-center justify-center text-graphite hover:text-burgundy disabled:opacity-40"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmAdd}
                  className="w-full py-3.5 px-6 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.16em] font-semibold hover:bg-burgundy-dark transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                  <span>
                    Adicionar à sacola •{' '}
                    {formatCurrencyBRL(
                      (gift.allowPartialContribution && contributionMode === 'partial'
                        ? Math.max(50, customAmount || 0)
                        : gift.price) * quantity
                    )}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
