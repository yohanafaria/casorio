import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from './CartContext';
import { cartService } from '../../services/cartService';
import { formatCurrencyBRL } from '../../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    items,
    total,
    totalItemsCount,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isCartDrawerOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isCartDrawerOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartDrawerOpen) {
        closeCartDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartDrawerOpen, closeCartDrawer]);

  if (!isCartDrawerOpen) return null;

  const handleProceedToCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-graphite/50 backdrop-blur-xs transition-opacity"
        onClick={closeCartDrawer}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-warmwhite shadow-2xl border-l border-blush/40 flex flex-col justify-between">
          {/* Cabeçalho */}
          <div className="p-6 border-b border-blush/35 flex items-center justify-between bg-ivory/60">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-burgundy" aria-hidden="true" />
              <h2 id="cart-drawer-title" className="font-serif text-2xl text-graphite">
                Sua Seleção de Presentes
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeCartDrawer}
              className="p-2 rounded-full text-graphite-muted hover:text-burgundy hover:bg-ivory transition-colors"
              aria-label="Fechar sacola de presentes"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Lista de Itens */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-14 space-y-4">
                <div className="w-14 h-14 rounded-full bg-ivory mx-auto flex items-center justify-center text-olive">
                  <ShoppingBag className="w-6 h-6" aria-hidden="true" />
                </div>
                <p className="font-serif text-2xl text-graphite">
                  Sua sacola ainda está vazia
                </p>
                <p className="text-sm text-graphite-muted max-w-xs mx-auto">
                  Escolha um mimo, experiência ou cota da lua de mel para celebrar esse encontro com Daniel e Yohana.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeCartDrawer();
                    navigate('/presentes');
                  }}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.15em] font-medium hover:bg-burgundy-dark transition-colors"
                >
                  Explorar lista de presentes
                </button>
              </div>
            ) : (
              items.map((item, idx) => {
                const unitPrice = cartService.getItemUnitPrice(item);
                const itemSubtotal = cartService.getItemSubtotal(item);
                return (
                  <div
                    key={`${item.gift.id}-${idx}`}
                    className="flex gap-4 p-4 rounded-2xl bg-ivory/65 border border-blush/35"
                  >
                    <img
                      src={item.gift.image}
                      alt={item.gift.name}
                      className="w-20 h-20 rounded-xl object-cover border border-blush/30 shrink-0 bg-warmwhite"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-lg text-graphite leading-snug">
                          {item.gift.name}
                        </h3>
                        <button
                          type="button"
                          onClick={() => removeFromCart(idx)}
                          className="text-graphite-muted hover:text-burgundy p-1 transition-colors"
                          aria-label={`Remover ${item.gift.name} da sacola`}
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>

                      {item.isPartialContribution && (
                        <span className="inline-block mt-0.5 text-[11px] px-2 py-0.5 rounded-full bg-olive/15 text-olive font-medium">
                          Contribuição parcial ({formatCurrencyBRL(unitPrice)})
                        </span>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-blush/60 bg-warmwhite">
                          <button
                            type="button"
                            onClick={() => updateQuantity(idx, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-graphite hover:text-burgundy"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <span className="px-2.5 text-xs font-medium text-graphite">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(idx, item.quantity + 1)}
                            disabled={item.quantity >= item.gift.availableQuantity}
                            className="w-7 h-7 flex items-center justify-center text-graphite hover:text-burgundy disabled:opacity-40"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        <span className="font-medium text-sm text-burgundy">
                          {formatCurrencyBRL(itemSubtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Rodapé do Drawer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-blush/40 bg-ivory/80 space-y-4">
              <div className="flex items-center justify-between text-sm text-graphite-muted">
                <span>Itens selecionados ({totalItemsCount})</span>
                <span>Sem taxas adicionais</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-xl text-graphite">Total do presente</span>
                <span className="font-serif text-2xl font-semibold text-burgundy">
                  {formatCurrencyBRL(total)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-6 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.16em] font-semibold hover:bg-burgundy-dark transition-all flex items-center justify-center gap-2"
              >
                <span>Continuar para o Checkout</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
