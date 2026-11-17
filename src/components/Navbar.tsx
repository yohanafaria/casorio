import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sparkles } from 'lucide-react';
import { Monogram } from './Monogram';
import { useCart } from '../features/cart/CartContext';
import { weddingConfig } from '../config/weddingConfig';

const NAV_ITEMS = [
  { to: '/', label: 'Início' },
  { to: '/local', label: 'Local' },
  { to: '/presentes', label: 'Lista de presentes' },
  { to: '/confirmar-presenca', label: 'Confirme sua presença' },
];

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItemsCount, openCartDrawer } = useCart();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-warmwhite/95 backdrop-blur-md border-b border-blush/35 py-3 shadow-sm'
          : 'bg-ivory/80 backdrop-blur-sm py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Assinatura / Monograma */}
        <Link
          to="/"
          className="group flex items-center gap-3 rounded-lg py-1 pr-2 transition-opacity hover:opacity-90"
          aria-label="Daniel e Yohana — Ir para a página inicial"
        >
          <Monogram size="sm" variant="burgundy" />
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl tracking-tight text-burgundy leading-none">
              Daniel <span className="italic font-normal text-olive">&amp;</span> Yohana
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-graphite-muted mt-1">
              {weddingConfig.date.shortDate} • Rio
            </span>
          </div>
        </Link>

        {/* Navegação Desktop */}
        <nav aria-label="Menu principal" className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isRsvp = item.to === '/confirmar-presenca';
            if (isRsvp) {
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-4 py-2 text-xs uppercase tracking-[0.16em] font-medium transition-all rounded-full border ${
                      isActive
                        ? 'bg-burgundy text-warmwhite border-burgundy'
                        : 'border-burgundy/40 text-burgundy hover:bg-burgundy hover:text-warmwhite'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              );
            }
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative py-1 text-sm transition-colors ${
                    isActive
                      ? 'text-burgundy font-medium after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[1.5px] after:bg-burgundy'
                      : 'text-graphite hover:text-burgundy'
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Botão do Carrinho + Menu Mobile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openCartDrawer}
            className="relative inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-blush/60 bg-warmwhite text-graphite hover:border-burgundy hover:text-burgundy transition-colors min-h-[42px]"
            aria-label={`Abrir sacola de presentes com ${totalItemsCount} ${
              totalItemsCount === 1 ? 'item' : 'itens'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-burgundy" aria-hidden="true" />
            <span className="text-xs font-medium hidden sm:inline">Presentes</span>
            {totalItemsCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-semibold rounded-full bg-burgundy text-warmwhite">
                {totalItemsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border border-blush/60 bg-warmwhite text-graphite hover:text-burgundy transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Menu Mobile Acessível */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation-drawer"
          aria-label="Menu principal mobile"
          className="md:hidden bg-warmwhite border-b border-blush/50 px-4 pt-4 pb-6 animate-fade-in-up"
        >
          <ul className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-base transition-colors ${
                      isActive
                        ? 'bg-burgundy/10 text-burgundy font-medium'
                        : 'text-graphite hover:bg-ivory'
                    }`
                  }
                >
                  <span>{item.label}</span>
                  {item.to === '/confirmar-presenca' && (
                    <Sparkles className="w-4 h-4 text-burgundy" aria-hidden="true" />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};
