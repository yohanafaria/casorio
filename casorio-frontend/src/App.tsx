import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './features/cart/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './features/cart/CartDrawer';
import { HomePage } from './pages/HomePage';
import { VenuePage } from './pages/VenuePage';
import { GiftsPage } from './pages/GiftsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { RSVPPage } from './pages/RSVPPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { NotFoundPage } from './pages/NotFoundPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CartProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-ivory text-graphite">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:rounded-full focus:bg-burgundy focus:text-warmwhite focus:text-xs"
          >
            Pular para o conteúdo principal
          </a>
          <Navbar />
          <CartDrawer />
          <main id="main-content" className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/local" element={<VenuePage />} />
              <Route path="/presentes" element={<GiftsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/confirmar-presenca" element={<RSVPPage />} />
              <Route path="/identidade-visual" element={<DesignSystemPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
