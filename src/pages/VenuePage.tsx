import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Copy,
  Check,
  Car,
  Accessibility,
  Hotel,
  Calendar,
  Clock,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const VenuePage: React.FC = () => {
  useDocumentMeta({
    title: 'Local & Como Chegar',
    description: `Saiba como chegar ao ${weddingConfig.location.venueName}, horários, estacionamento e acessibilidade.`,
  });

  const [copied, setCopied] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(weddingConfig.location.fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback para seleção manual caso clipboard API não esteja disponível
      setCopied(false);
    }
  };

  return (
    <div className="pb-16">
      {/* Hero do Local */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-warmwhite border-b border-blush/35 text-center">
        <div className="max-w-3xl mx-auto space-y-4 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-olive font-medium">
            <MapPin className="w-3.5 h-3.5 text-burgundy" aria-hidden="true" />
            <span>Nosso Ponto de Encontro</span>
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl text-burgundy">
            {weddingConfig.location.venueName}
          </h1>
          <p className="text-base sm:text-lg text-graphite-muted">
            {weddingConfig.location.addressLine1} • {weddingConfig.location.city}
          </p>
        </div>
      </section>

      {/* Card Principal: Endereço, Botões de Rota e Mapa */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Informações e Ações */}
          <div className="lg:col-span-5 p-7 sm:p-8 rounded-organic bg-warmwhite border border-blush/50 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-olive font-medium">
                Cerimônia &amp; Recepção no mesmo local
              </span>
              <h2 className="font-serif text-3xl text-graphite">
                {weddingConfig.location.venueName}
              </h2>
            </div>

            <div className="space-y-3 text-sm text-graphite-muted border-y border-blush/35 py-5">
              <p className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-burgundy shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  <strong className="text-graphite">{weddingConfig.date.displayDate}</strong> (
                  {weddingConfig.date.dayOfWeek})
                </span>
              </p>
              <p className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-burgundy shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Cerimônia às <strong className="text-graphite">{weddingConfig.date.ceremonyTime}</strong>{' '}
                  • Recepção às {weddingConfig.date.receptionTime}
                </span>
              </p>
              <p className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-burgundy shrink-0 mt-0.5" aria-hidden="true" />
                <span>{weddingConfig.location.fullAddress}</span>
              </p>
            </div>

            {/* Botão Copiar Endereço */}
            <div>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="w-full py-3 px-4 rounded-xl border border-blush/60 bg-ivory/70 hover:bg-ivory text-graphite text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-olive" aria-hidden="true" />
                    <span className="text-olive font-semibold">
                      Endereço copiado para a área de transferência!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-burgundy" aria-hidden="true" />
                    <span>Copiar endereço completo</span>
                  </>
                )}
              </button>
            </div>

            {/* Botões Google Maps e Waze */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href={weddingConfig.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-4 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.14em] font-semibold hover:bg-burgundy-dark transition-colors flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>Abrir no Google Maps</span>
                <ExternalLink className="w-3 h-3 opacity-80" aria-hidden="true" />
              </a>

              <a
                href={weddingConfig.location.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-4 rounded-full bg-olive text-warmwhite text-xs uppercase tracking-[0.14em] font-semibold hover:bg-olive-dark transition-colors flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" aria-hidden="true" />
                <span>Abrir no Waze</span>
                <ExternalLink className="w-3 h-3 opacity-80" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Mapa Interativo com Estado de Carregamento e Fallback */}
          <div className="lg:col-span-7 rounded-organic overflow-hidden border border-blush/50 bg-warmwhite min-h-[380px] relative flex flex-col">
            {!mapLoaded && !mapError && (
              <div className="absolute inset-0 z-10 bg-ivory flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full border-2 border-burgundy border-t-transparent animate-spin" />
                <p className="text-xs uppercase tracking-[0.18em] text-graphite-muted">
                  Carregando mapa da região...
                </p>
              </div>
            )}

            {mapError ? (
              <div className="flex-1 p-10 flex flex-col items-center justify-center text-center space-y-4 bg-ivory/60">
                <AlertCircle className="w-8 h-8 text-burgundy" aria-hidden="true" />
                <div className="space-y-1 max-w-md">
                  <h3 className="font-serif text-2xl text-graphite">
                    Visualização do mapa indisponível no momento
                  </h3>
                  <p className="text-sm text-graphite-muted">
                    Você pode abrir a localização diretamente no seu aplicativo de navegação preferido usando os botões abaixo:
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 justify-center pt-2">
                  <a
                    href={weddingConfig.location.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.14em] font-semibold"
                  >
                    Google Maps
                  </a>
                  <a
                    href={weddingConfig.location.wazeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-olive text-warmwhite text-xs uppercase tracking-[0.14em] font-semibold"
                  >
                    Waze
                  </a>
                </div>
              </div>
            ) : (
              <iframe
                title={`Mapa de localização: ${weddingConfig.location.venueName}`}
                src={weddingConfig.location.embedMapUrl}
                className="w-full h-[400px] border-0"
                loading="lazy"
                onLoad={() => setMapLoaded(true)}
                onError={() => setMapError(true)}
              />
            )}

            <div className="px-5 py-3 bg-warmwhite border-t border-blush/35 flex flex-wrap items-center justify-between gap-2 text-xs text-graphite-muted">
              <span>
                Coordenadas: {weddingConfig.location.coordinates.lat},{' '}
                {weddingConfig.location.coordinates.lng}
              </span>
              <button
                type="button"
                onClick={() => setMapError((prev) => !prev)}
                className="text-burgundy underline hover:no-underline"
              >
                {mapError ? 'Tentar recarregar mapa' : 'Modo texto / fallback'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Orientações de chegada, estacionamento, acessibilidade e hospedagem */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-organic bg-warmwhite border border-blush/45 space-y-3">
            <div className="w-10 h-10 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center">
              <Navigation className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-serif text-2xl text-graphite">Orientações de Chegada</h3>
            <p className="text-sm text-graphite-muted leading-relaxed">
              {weddingConfig.venueDetails.arrivalTips}
            </p>
          </div>

          <div className="p-7 rounded-organic bg-warmwhite border border-blush/45 space-y-3">
            <div className="w-10 h-10 rounded-full bg-olive/15 text-olive flex items-center justify-center">
              <Car className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-serif text-2xl text-graphite">Estacionamento</h3>
            <p className="text-sm text-graphite-muted leading-relaxed">
              {weddingConfig.venueDetails.parking}
            </p>
          </div>

          <div className="p-7 rounded-organic bg-warmwhite border border-blush/45 space-y-3">
            <div className="w-10 h-10 rounded-full bg-burgundy/10 text-burgundy flex items-center justify-center">
              <Accessibility className="w-5 h-5" aria-hidden="true" />
            </div>
            <h3 className="font-serif text-2xl text-graphite">Acessibilidade</h3>
            <p className="text-sm text-graphite-muted leading-relaxed">
              {weddingConfig.venueDetails.accessibility}
            </p>
          </div>
        </div>

        {/* Hospedagem e Transporte (exibido apenas se estiver ativo no weddingConfig) */}
        {'accommodationAndTransport' in weddingConfig.venueDetails &&
          Array.isArray(
            (
              weddingConfig.venueDetails as {
                accommodationAndTransport?: { title: string; description: string }[];
              }
            ).accommodationAndTransport
          ) && (
            <div className="mt-8 p-8 rounded-organic bg-ivory-dark/55 border border-blush/45">
              <div className="flex items-center gap-2.5 text-olive mb-4">
                <Hotel className="w-5 h-5" aria-hidden="true" />
                <h3 className="font-serif text-2xl text-graphite">
                  Hospedagem &amp; Logística de Retorno
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(
                  (
                    weddingConfig.venueDetails as {
                      accommodationAndTransport?: { title: string; description: string }[];
                    }
                  ).accommodationAndTransport || []
                ).map((info) => (
                  <div key={info.title} className="space-y-1.5">
                    <h4 className="font-medium text-sm text-burgundy">{info.title}</h4>
                    <p className="text-sm text-graphite-muted leading-relaxed">
                      {info.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
      </section>
    </div>
  );
};
