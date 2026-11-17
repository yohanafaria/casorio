import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Info,
} from 'lucide-react';
import { useCart } from '../features/cart/CartContext';
import { cartService } from '../services/cartService';
import { checkoutService } from '../services/checkoutService';
import { paymentService, InitializePaymentResponse } from '../services/paymentService';
import { Order, Payment } from '../types';
import { formatBrazilianPhone, formatCurrencyBRL } from '../utils/formatters';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { envConfig } from '../services/apiClient';

const checkoutSchema = z.object({
  buyerName: z
    .string()
    .min(3, 'Por favor, informe seu nome completo para que o casal saiba quem presenteou.'),
  buyerEmail: z.string().email('Informe um e-mail válido para receber o comprovante do pedido.'),
  buyerPhone: z
    .string()
    .min(14, 'Informe um telefone/WhatsApp válido com DDD. Ex: (21) 99999-9999'),
  message: z
    .string()
    .max(500, 'Sua mensagem pode ter até 500 caracteres.')
    .optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

type CheckoutScreenState =
  | 'form_and_brick'
  | 'submitting'
  | 'payment_pending'
  | 'payment_rejected'
  | 'payment_success_preview'
  | 'payment_error';

export const CheckoutPage: React.FC = () => {
  useDocumentMeta({
    title: 'Checkout de Presentes',
    description: 'Finalize seu presente para Daniel e Yohana com mensagem carinhosa ao casal.',
  });

  const { items, subtotal, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [screenState, setScreenState] = useState<CheckoutScreenState>('form_and_brick');
  const [brickLoading, setBrickLoading] = useState(true);
  const [brickSession, setBrickSession] = useState<InitializePaymentResponse | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [createdPayment, setCreatedPayment] = useState<Payment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkingBackendStatus, setCheckingBackendStatus] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      buyerName: '',
      buyerEmail: '',
      buyerPhone: '',
      message: '',
    },
  });

  const phoneValue = watch('buyerPhone');

  // Inicializa a sessão preparatória do Mercado Pago Payment Brick
  useEffect(() => {
    let active = true;
    setBrickLoading(true);
    paymentService
      .preparePaymentBrickSession('PREVIEW-ORDER', total)
      .then((res) => {
        if (active) setBrickSession(res);
      })
      .catch(() => {
        if (active) setBrickSession(null);
      })
      .finally(() => {
        if (active) setBrickLoading(false);
      });
    return () => {
      active = false;
    };
  }, [total]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBrazilianPhone(e.target.value);
    setValue('buyerPhone', formatted, { shouldValidate: true });
  };

  const processCheckoutSubmission = async (
    values: CheckoutFormValues,
    scenario: 'pending' | 'rejected' | 'backend_confirmed_preview' = 'pending'
  ) => {
    if (items.length === 0) return;
    setScreenState('submitting');
    setErrorMessage(null);

    try {
      const order = await checkoutService.createOrder({
        items,
        buyerName: values.buyerName,
        buyerEmail: values.buyerEmail,
        buyerPhone: values.buyerPhone,
        message: values.message,
      });
      setCreatedOrder(order);

      const payment = await paymentService.createPayment({
        orderId: order.id,
        amount: order.total,
        paymentMethod: 'mercado_pago_brick',
        mockScenario: scenario,
      });
      setCreatedPayment(payment);

      if (scenario === 'rejected') {
        setScreenState('payment_rejected');
      } else if (scenario === 'backend_confirmed_preview') {
        clearCart();
        setScreenState('payment_success_preview');
      } else {
        clearCart();
        setScreenState('payment_pending');
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Não foi possível registrar seu pedido no momento.'
      );
      setScreenState('payment_error');
    }
  };

  const handleRefreshPaymentStatus = async () => {
    if (!createdPayment) return;
    setCheckingBackendStatus(true);
    try {
      const refreshed = await paymentService.getPaymentStatus(createdPayment.paymentId);
      if (refreshed) {
        setCreatedPayment(refreshed);
      }
    } finally {
      setCheckingBackendStatus(false);
    }
  };

  // Estado vazio se não houver itens e ainda não tiver gerado pedido
  if (items.length === 0 && screenState === 'form_and_brick') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-warmwhite border border-blush/50 mx-auto flex items-center justify-center text-burgundy">
          <ShoppingBag className="w-7 h-7" aria-hidden="true" />
        </div>
        <h1 className="font-serif text-4xl text-graphite">
          Sua sacola de presentes está vazia
        </h1>
        <p className="text-sm text-graphite-muted max-w-md mx-auto">
          Escolha um presente na nossa vitrine antes de seguir para o checkout.
        </p>
        <Link
          to="/presentes"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.16em] font-semibold"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Voltar para a Lista de Presentes</span>
        </Link>
      </div>
    );
  }

  // TELAS DE RETORNO PÓS-CHECKOUT (PENDENTE, SUCESSO, RECUSADO, ERRO)
  if (screenState !== 'form_and_brick' && screenState !== 'submitting') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 space-y-8 animate-fade-in-up">
        {/* Seletor de visualização dos estados do Checkout exigidos no escopo */}
        <div className="p-4 rounded-2xl bg-warmwhite border border-blush/50 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-graphite-muted font-medium flex items-center gap-1.5">
            <Info className="w-4 h-4 text-olive" aria-hidden="true" />
            <span>Alternar estados visuais pós-checkout (Modo Arquitetura/Mock):</span>
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setScreenState('payment_pending')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                screenState === 'payment_pending'
                  ? 'bg-olive text-warmwhite'
                  : 'bg-ivory text-graphite hover:bg-blush/30'
              }`}
            >
              Pagamento Pendente
            </button>
            <button
              type="button"
              onClick={() => setScreenState('payment_success_preview')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                screenState === 'payment_success_preview'
                  ? 'bg-burgundy text-warmwhite'
                  : 'bg-ivory text-graphite hover:bg-blush/30'
              }`}
            >
              Tela de Sucesso
            </button>
            <button
              type="button"
              onClick={() => setScreenState('payment_rejected')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                screenState === 'payment_rejected'
                  ? 'bg-wine text-warmwhite'
                  : 'bg-ivory text-graphite hover:bg-blush/30'
              }`}
            >
              Pagamento Recusado
            </button>
            <button
              type="button"
              onClick={() => setScreenState('payment_error')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                screenState === 'payment_error'
                  ? 'bg-graphite text-warmwhite'
                  : 'bg-ivory text-graphite hover:bg-blush/30'
              }`}
            >
              Erro de Comunicação
            </button>
          </div>
        </div>

        {/* 1. TELA DE PAGAMENTO PENDENTE (Padrão seguro sem confirmação de backend) */}
        {screenState === 'payment_pending' && (
          <div className="p-8 sm:p-10 rounded-organic bg-warmwhite border border-blush/55 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-olive/15 text-olive mx-auto flex items-center justify-center">
              <Clock className="w-8 h-8" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-olive font-semibold">
                Pedido Registrado • Aguardando Confirmação do Servidor
              </span>
              <h1 className="font-serif text-4xl text-graphite">
                Recebemos a sua intenção de presente!
              </h1>
              <p className="text-sm text-graphite-muted max-w-xl mx-auto leading-relaxed">
                Por segurança, um pedido nunca é marcado como pago apenas pelo navegador. Assim que o backend processar o retorno e o webhook do Mercado Pago (<code>GET /api/payments/:id/status</code>), seu presente será confirmado.
              </p>
            </div>

            {createdOrder && (
              <div className="p-5 rounded-2xl bg-ivory/75 border border-blush/40 text-left max-w-lg mx-auto space-y-2 text-xs text-graphite-muted">
                <div className="flex justify-between">
                  <span>Código do Pedido:</span>
                  <strong className="text-graphite">{createdOrder.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Presenteador(a):</span>
                  <strong className="text-graphite">{createdOrder.buyerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Valor Total:</span>
                  <strong className="text-burgundy">
                    {formatCurrencyBRL(createdOrder.total)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Status Atual:</span>
                  <span className="px-2 py-0.5 rounded bg-olive/15 text-olive font-semibold">
                    Aguardando confirmação do backend
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRefreshPaymentStatus}
                disabled={checkingBackendStatus}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-olive text-olive text-xs uppercase tracking-[0.15em] font-semibold hover:bg-olive/10 transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${checkingBackendStatus ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                <span>Consultar status no backend</span>
              </button>
              <Link
                to="/presentes"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.15em] font-semibold hover:bg-burgundy-dark transition-colors"
              >
                <span>Voltar à lista de presentes</span>
              </Link>
            </div>
          </div>
        )}

        {/* 2. TELA DE SUCESSO (Exibida quando o backend confirma o pagamento) */}
        {screenState === 'payment_success_preview' && (
          <div className="p-8 sm:p-10 rounded-organic bg-warmwhite border border-olive/45 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-olive/20 text-olive mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-olive font-semibold">
                Muito obrigado pelo carinho!
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl text-burgundy">
                Seu presente e sua mensagem chegaram ao casal
              </h1>
              <p className="text-sm text-graphite-muted max-w-xl mx-auto leading-relaxed">
                Daniel e Yohana agradecem de coração por fazer parte desse capítulo. Em ambiente de produção, esta tela é apresentada após a confirmação oficial do endpoint <code>GET /api/payments/:id/status</code>.
              </p>
            </div>

            {createdOrder?.message && (
              <blockquote className="max-w-lg mx-auto p-5 rounded-2xl bg-ivory border border-blush/40 font-serif italic text-xl text-graphite">
                “{createdOrder.message}”
                <footer className="mt-2 font-sans not-italic text-xs text-olive uppercase tracking-widest">
                  — {createdOrder.buyerName}
                </footer>
              </blockquote>
            )}

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                to="/presentes"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.16em] font-semibold"
              >
                <span>Voltar à lista de presentes</span>
              </Link>
              <Link
                to="/confirmar-presenca"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-burgundy/40 text-burgundy text-xs uppercase tracking-[0.16em] font-semibold"
              >
                <span>Confirmar minha presença (RSVP)</span>
              </Link>
            </div>
          </div>
        )}

        {/* 3. TELA DE PAGAMENTO RECUSADO */}
        {screenState === 'payment_rejected' && (
          <div className="p-8 sm:p-10 rounded-organic bg-warmwhite border border-burgundy/45 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-burgundy/15 text-burgundy mx-auto flex items-center justify-center">
              <XCircle className="w-8 h-8" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-burgundy font-semibold">
                Pagamento Não Autorizado
              </span>
              <h1 className="font-serif text-4xl text-graphite">
                Não foi possível concluir o pagamento
              </h1>
              <p className="text-sm text-graphite-muted max-w-xl mx-auto leading-relaxed">
                O meio de pagamento selecionado não foi autorizado pela instituição financeira. Você pode revisar os dados ou escolher outra forma de pagamento (como Pix ou outro cartão).
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setScreenState('form_and_brick')}
                className="px-6 py-3 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.15em] font-semibold"
              >
                Tentar outro meio de pagamento
              </button>
              <Link
                to="/presentes"
                className="px-6 py-3 rounded-full border border-blush/60 text-graphite text-xs uppercase tracking-[0.15em] font-semibold"
              >
                Voltar à lista de presentes
              </Link>
            </div>
          </div>
        )}

        {/* 4. TELA DE ERRO TÉCNICO */}
        {screenState === 'payment_error' && (
          <div className="p-8 sm:p-10 rounded-organic bg-warmwhite border border-burgundy/40 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-burgundy/10 text-burgundy mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h1 className="font-serif text-3xl text-graphite">
                Ops! Tivemos uma instabilidade temporária
              </h1>
              <p className="text-sm text-graphite-muted max-w-md mx-auto">
                {errorMessage ||
                  'Não conseguimos comunicar com o servidor de pagamentos neste instante. Nenhum valor foi cobrado.'}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setScreenState('form_and_brick')}
                className="px-6 py-3 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.15em] font-semibold"
              >
                Voltar e tentar novamente
              </button>
              <Link
                to="/presentes"
                className="px-6 py-3 rounded-full border border-blush/60 text-graphite text-xs uppercase tracking-[0.15em] font-semibold"
              >
                Voltar à lista de presentes
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
      <div className="mb-8">
        <Link
          to="/presentes"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-olive hover:text-burgundy font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Voltar para a lista de presentes</span>
        </Link>
        <h1 className="font-serif text-4xl sm:text-5xl text-burgundy mt-2">
          Finalizar Presente para Daniel &amp; Yohana
        </h1>
      </div>

      <form
        onSubmit={handleSubmit((vals) => processCheckoutSubmission(vals, 'pending'))}
        noValidate
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Coluna Esquerda: Identificação de quem presenteia + Mensagem + Container Mercado Pago Brick */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Identificação e Mensagem ao Casal */}
          <section className="p-6 sm:p-8 rounded-organic bg-warmwhite border border-blush/50 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-blush/35 pb-4">
              <Sparkles className="w-5 h-5 text-burgundy" aria-hidden="true" />
              <h2 className="font-serif text-2xl text-graphite">
                1. Quem está presenteando o casal?
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="buyerName"
                  className="block text-xs uppercase tracking-[0.14em] text-graphite font-medium mb-1.5"
                >
                  Seu nome completo (ou da família) *
                </label>
                <input
                  id="buyerName"
                  type="text"
                  {...register('buyerName')}
                  aria-invalid={Boolean(errors.buyerName)}
                  aria-describedby={errors.buyerName ? 'buyerName-error' : undefined}
                  placeholder="Ex: Mariana e Pedro Alves"
                  className="w-full px-4 py-3 rounded-xl border border-blush/60 bg-ivory/40 text-sm text-graphite"
                />
                {errors.buyerName && (
                  <p id="buyerName-error" className="mt-1.5 text-xs text-burgundy font-medium">
                    {errors.buyerName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="buyerEmail"
                    className="block text-xs uppercase tracking-[0.14em] text-graphite font-medium mb-1.5"
                  >
                    Seu e-mail *
                  </label>
                  <input
                    id="buyerEmail"
                    type="email"
                    {...register('buyerEmail')}
                    aria-invalid={Boolean(errors.buyerEmail)}
                    aria-describedby={errors.buyerEmail ? 'buyerEmail-error' : undefined}
                    placeholder="voce@exemplo.com.br"
                    className="w-full px-4 py-3 rounded-xl border border-blush/60 bg-ivory/40 text-sm text-graphite"
                  />
                  {errors.buyerEmail && (
                    <p id="buyerEmail-error" className="mt-1.5 text-xs text-burgundy font-medium">
                      {errors.buyerEmail.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="buyerPhone"
                    className="block text-xs uppercase tracking-[0.14em] text-graphite font-medium mb-1.5"
                  >
                    Telefone / WhatsApp *
                  </label>
                  <input
                    id="buyerPhone"
                    type="tel"
                    value={phoneValue}
                    onChange={handlePhoneChange}
                    aria-invalid={Boolean(errors.buyerPhone)}
                    aria-describedby={errors.buyerPhone ? 'buyerPhone-error' : undefined}
                    placeholder="(21) 99999-9999"
                    className="w-full px-4 py-3 rounded-xl border border-blush/60 bg-ivory/40 text-sm text-graphite"
                  />
                  {errors.buyerPhone && (
                    <p id="buyerPhone-error" className="mt-1.5 text-xs text-burgundy font-medium">
                      {errors.buyerPhone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="buyerMessage"
                  className="block text-xs uppercase tracking-[0.14em] text-graphite font-medium mb-1.5"
                >
                  Mensagem carinhosa para Daniel &amp; Yohana (opcional)
                </label>
                <textarea
                  id="buyerMessage"
                  rows={3}
                  {...register('message')}
                  placeholder="Deixe um recado especial que será entregue ao casal junto com o presente..."
                  className="w-full px-4 py-3 rounded-xl border border-blush/60 bg-ivory/40 text-sm text-graphite resize-y"
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-burgundy font-medium">
                    {errors.message.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 2. Container Reservado para o Mercado Pago Payment Brick */}
          <section className="p-6 sm:p-8 rounded-organic bg-warmwhite border border-blush/50 space-y-5">
            <div className="flex items-center justify-between border-b border-blush/35 pb-4">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-olive" aria-hidden="true" />
                <h2 className="font-serif text-2xl text-graphite">
                  2. Pagamento Seguro (Mercado Pago Bricks)
                </h2>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-olive/15 text-olive font-medium">
                Pix • Cartão • Boleto
              </span>
            </div>

            {/* Container Oficial #paymentBrick_container */}
            <div
              id="paymentBrick_container"
              aria-live="polite"
              className="rounded-2xl border-2 border-dashed border-blush/70 bg-ivory/60 p-6 transition-all"
            >
              {brickLoading ? (
                <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-9 h-9 rounded-full border-2 border-burgundy border-t-transparent animate-spin" />
                  <p className="text-xs uppercase tracking-[0.18em] text-graphite-muted">
                    Inicializando container do Mercado Pago Payment Brick...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-olive shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="space-y-1">
                      <h3 className="font-serif text-xl text-graphite">
                        Container Pronto para Mercado Pago Payment Brick
                      </h3>
                      <p className="text-xs text-graphite-muted leading-relaxed">
                        {brickSession?.backendNote ||
                          'A criação da preferência (POST /api/payments/create), renderização do Brick e validação via webhook dependem do backend.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-warmwhite border border-blush/40 text-xs space-y-1.5 text-graphite-muted">
                    <p>
                      <strong className="text-graphite">Modo da API:</strong>{' '}
                      {envConfig.useMockApi ? 'Mock Ativo (VITE_USE_MOCK_API=true)' : 'API Real'}
                    </p>
                    <p>
                      <strong className="text-graphite">Public Key no Navegador:</strong>{' '}
                      <code>{brickSession?.publicKeyPreview || 'VITE_MERCADO_PAGO_PUBLIC_KEY'}</code>
                    </p>
                    <p>
                      <strong className="text-graphite">Segurança:</strong> Nenhum{' '}
                      <code>ACCESS_TOKEN</code> ou <code>CLIENT_SECRET</code> está exposto no frontend.
                    </p>
                  </div>

                  {/* Botões de Submissão e Teste dos Estados do Fluxo */}
                  <div className="pt-2 space-y-3">
                    <button
                      type="submit"
                      disabled={screenState === 'submitting'}
                      className="w-full py-4 px-6 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.16em] font-semibold hover:bg-burgundy-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {screenState === 'submitting' ? (
                        <span>Registrando pedido...</span>
                      ) : (
                        <span>
                          Registrar Pedido ({formatCurrencyBRL(total)}) • Aguardar Confirmação Backend
                        </span>
                      )}
                    </button>

                    <div className="pt-2 border-t border-blush/35 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-[11px] text-graphite-muted">
                        Testar outros retornos visuais do checkout:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleSubmit((vals) =>
                            processCheckoutSubmission(vals, 'backend_confirmed_preview')
                          )}
                          className="text-[11px] px-3 py-1 rounded-full bg-olive/15 text-olive hover:bg-olive/25 font-medium transition-colors"
                        >
                          Pré-visualizar Tela de Sucesso
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmit((vals) =>
                            processCheckoutSubmission(vals, 'rejected')
                          )}
                          className="text-[11px] px-3 py-1 rounded-full bg-burgundy/15 text-burgundy hover:bg-burgundy/25 font-medium transition-colors"
                        >
                          Pré-visualizar Recusa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Coluna Direita: Resumo do Pedido */}
        <aside className="lg:col-span-5 p-6 sm:p-8 rounded-organic bg-warmwhite border border-blush/50 space-y-6 sticky top-24">
          <div className="flex items-center justify-between border-b border-blush/35 pb-4">
            <h2 className="font-serif text-2xl text-graphite">Resumo do Presente</h2>
            <button
              type="button"
              onClick={() => navigate('/presentes')}
              className="text-xs text-burgundy underline hover:no-underline"
            >
              Alterar itens
            </button>
          </div>

          <ul className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {items.map((item, idx) => {
              const unitPrice = cartService.getItemUnitPrice(item);
              const itemTotal = cartService.getItemSubtotal(item);
              return (
                <li
                  key={`${item.gift.id}-${idx}`}
                  className="flex items-start gap-3.5 pb-4 border-b border-blush/25 last:border-b-0 last:pb-0"
                >
                  <img
                    src={item.gift.image}
                    alt={item.gift.name}
                    className="w-14 h-14 rounded-xl object-cover border border-blush/30 bg-ivory shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-lg text-graphite leading-snug">
                      {item.gift.name}
                    </p>
                    <p className="text-xs text-graphite-muted">
                      Qtd: {item.quantity}{' '}
                      {item.isPartialContribution
                        ? `• Cota parcial (${formatCurrencyBRL(unitPrice)})`
                        : `• ${formatCurrencyBRL(unitPrice)}`}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-burgundy">
                    {formatCurrencyBRL(itemTotal)}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-blush/40 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-graphite-muted">
              <span>Subtotal</span>
              <span>{formatCurrencyBRL(subtotal)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-blush/25">
              <span className="font-serif text-xl text-graphite">Total</span>
              <span className="font-serif text-3xl font-semibold text-burgundy">
                {formatCurrencyBRL(total)}
              </span>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
};
