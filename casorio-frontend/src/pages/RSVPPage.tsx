import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle2,
  Users,
  Sparkles,
  Search,
  Edit3,
  AlertCircle,
  ArrowRight,
  Check,
} from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';
import { rsvpService } from '../services/rsvpService';
import { RSVPSubmission } from '../types';
import { formatBrazilianPhone } from '../utils/formatters';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const companionSchema = z.object({
  name: z.string().min(2, 'Informe o nome completo do acompanhante.'),
  dietaryRestrictions: z.string().optional(),
});

const rsvpSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Por favor, digite seu nome completo como consta no convite.'),
  email: z.string().email('Digite um endereço de e-mail válido.'),
  phone: z
    .string()
    .min(14, 'Informe um WhatsApp/telefone válido com DDD. Ex: (21) 99999-9999'),
  inviteCode: z.string().optional(),
  attending: z.enum(['yes', 'no'], {
    required_error: 'Selecione se você poderá comparecer.',
  }),
  companionsCount: z
    .number()
    .min(0)
    .max(
      weddingConfig.rsvp.maxCompanions,
      `O limite máximo configurado por convite é de ${weddingConfig.rsvp.maxCompanions} acompanhantes.`
    ),
  companions: z.array(companionSchema),
  dietaryRestrictions: z.string().optional(),
  notes: z.string().max(400, 'Máximo de 400 caracteres.').optional(),
  consentAccepted: z.literal(true, {
    errorMap: () => ({
      message:
        'É necessário concordar com o uso dos dados exclusivamente para a organização do casamento.',
    }),
  }),
});

type RSVPFormValues = z.infer<typeof rsvpSchema>;

export const RSVPPage: React.FC = () => {
  useDocumentMeta({
    title: 'Confirme sua Presença (RSVP)',
    description:
      'Confirme sua presença no casamento de Daniel e Yohana, informe acompanhantes e restrições alimentares.',
  });

  const [step, setStep] = useState<'form' | 'review' | 'success'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savedSubmission, setSavedSubmission] = useState<RSVPSubmission | null>(null);

  // Busca de RSVP existente para edição posterior (preparado para GET / PUT /api/rsvp/:token)
  const [lookupToken, setLookupToken] = useState(() => rsvpService.getLastSavedToken() || '');
  const [editingToken, setEditingToken] = useState<string | null>(null);
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RSVPFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      inviteCode: '',
      attending: 'yes',
      companionsCount: 0,
      companions: [],
      dietaryRestrictions: '',
      notes: '',
      consentAccepted: undefined as unknown as true,
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: 'companions',
  });

  const watchedValues = watch();
  const isAttending = watchedValues.attending === 'yes';

  const handleCompanionsCountChange = (count: number) => {
    const clamped = Math.max(0, Math.min(weddingConfig.rsvp.maxCompanions, count));
    setValue('companionsCount', clamped, { shouldValidate: true });

    const currentCompanions = watchedValues.companions || [];
    if (clamped > currentCompanions.length) {
      const next = [...currentCompanions];
      for (let i = currentCompanions.length; i < clamped; i++) {
        next.push({ name: '', dietaryRestrictions: '' });
      }
      replace(next);
    } else if (clamped < currentCompanions.length) {
      replace(currentCompanions.slice(0, clamped));
    }
  };

  const handlePhoneMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('phone', formatBrazilianPhone(e.target.value), { shouldValidate: true });
  };

  const handleLookupExistingRSVP = async () => {
    if (!lookupToken.trim()) return;
    setLookupLoading(true);
    setLookupMessage(null);
    try {
      const found = await rsvpService.getRSVPByToken(lookupToken);
      if (!found) {
        setLookupMessage(
          'Nenhuma confirmação encontrada com esse código ou e-mail neste navegador.'
        );
      } else {
        setEditingToken(found.token);
        reset({
          fullName: found.fullName,
          email: found.email,
          phone: found.phone,
          inviteCode: found.inviteCode || '',
          attending: found.attending,
          companionsCount: found.companionsCount,
          companions: found.companions,
          dietaryRestrictions: found.dietaryRestrictions || '',
          notes: found.notes || '',
          consentAccepted: true,
        });
        setStep('form');
        setLookupMessage(
          `Confirmação de ${found.fullName} (${found.token}) carregada para edição!`
        );
      }
    } catch {
      setLookupMessage('Não foi possível consultar a confirmação agora.');
    } finally {
      setLookupLoading(false);
    }
  };

  const onFormValidMoveToReview = () => {
    setSubmitError(null);
    setStep('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalConfirm = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        fullName: watchedValues.fullName,
        email: watchedValues.email,
        phone: watchedValues.phone,
        inviteCode: watchedValues.inviteCode,
        attending: watchedValues.attending,
        companionsCount: isAttending ? watchedValues.companionsCount : 0,
        companions: isAttending ? watchedValues.companions : [],
        dietaryRestrictions: watchedValues.dietaryRestrictions,
        notes: watchedValues.notes,
        consentAccepted: watchedValues.consentAccepted,
      };

      const result = editingToken
        ? await rsvpService.updateRSVP(editingToken, payload)
        : await rsvpService.createRSVP(payload);

      setSavedSubmission(result);
      setEditingToken(result.token);
      setLookupToken(result.token);
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Erro ao salvar sua confirmação de presença.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-20">
      {/* Cabeçalho */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-warmwhite border-b border-blush/35 text-center">
        <div className="max-w-3xl mx-auto space-y-4 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-olive font-medium">
            <Sparkles className="w-3.5 h-3.5 text-burgundy" aria-hidden="true" />
            <span>Confirmação até {weddingConfig.rsvp.deadlineDisplay}</span>
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl text-burgundy">
            Confirme sua Presença
          </h1>
          <p className="text-base sm:text-lg text-graphite-muted leading-relaxed">
            Queremos preparar cada mesa, cada taça e cada detalhe pensando em você. 
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
        {/* Barra para editar resposta anterior (GET/PUT /api/rsvp/:token) */}
        {step === 'form' && (
          <div className="p-5 rounded-organic bg-ivory-dark/55 border border-blush/45 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xs uppercase tracking-[0.16em] text-olive font-semibold">
                  Já confirmou antes e precisa alterar algum dado?
                </h2>
                <p className="text-xs text-graphite-muted">
                  Informe o código da sua confirmação (ex: <code>DY-XXXXXX</code>) ou seu e-mail para editar.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="rsvp-lookup-input" className="sr-only">
                  Código da confirmação ou e-mail
                </label>
                <input
                  id="rsvp-lookup-input"
                  type="text"
                  value={lookupToken}
                  onChange={(e) => setLookupToken(e.target.value)}
                  placeholder="Código DY-... ou e-mail"
                  className="px-3.5 py-2 rounded-full border border-blush/60 bg-warmwhite text-xs text-graphite w-48"
                />
                <button
                  type="button"
                  onClick={handleLookupExistingRSVP}
                  disabled={lookupLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-olive text-warmwhite text-xs font-medium hover:bg-olive-dark transition-colors"
                >
                  <Search className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{lookupLoading ? 'Buscando...' : 'Carregar'}</span>
                </button>
              </div>
            </div>
            {lookupMessage && (
              <p className="text-xs text-burgundy font-medium">{lookupMessage}</p>
            )}
          </div>
        )}

        {/* ETAPA 1: FORMULÁRIO */}
        {step === 'form' && (
          <form
            onSubmit={handleSubmit(onFormValidMoveToReview)}
            noValidate
            className="p-6 sm:p-10 rounded-organic bg-warmwhite border border-blush/50 space-y-6"
          >
            {editingToken && (
              <div className="p-3.5 rounded-xl bg-olive/15 text-olive text-xs font-medium flex items-center justify-between">
                <span>Editando confirmação existente: {editingToken}</span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingToken(null);
                    reset();
                  }}
                  className="underline"
                >
                  Criar nova confirmação
                </button>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="rsvp-fullName"
                  className="block text-xs uppercase tracking-[0.14em] text-graphite font-medium mb-1.5"
                >
                  Nome completo *
                </label>
                <input
                  id="rsvp-fullName"
                  type="text"
                  {...register('fullName')}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'rsvp-fullName-err' : undefined}
                  placeholder="Como aparece no seu convite"
                  className="w-full px-4 py-3 rounded-xl border border-blush/60 bg-ivory/40 text-sm text-graphite"
                />
                {errors.fullName && (
                  <p id="rsvp-fullName-err" className="mt-1.5 text-xs text-burgundy font-medium">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="rsvp-email"
                    className="block text-xs uppercase tracking-[0.14em] text-graphite font-medium mb-1.5"
                  >
                    E-mail *
                  </label>
                  <input
                    id="rsvp-email"
                    type="email"
                    {...register('email')}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'rsvp-email-err' : undefined}
                    placeholder="seuemail@exemplo.com"
                    className="w-full px-4 py-3 rounded-xl border border-blush/60 bg-ivory/40 text-sm text-graphite"
                  />
                  {errors.email && (
                    <p id="rsvp-email-err" className="mt-1.5 text-xs text-burgundy font-medium">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="rsvp-phone"
                    className="block text-xs uppercase tracking-[0.14em] text-graphite font-medium mb-1.5"
                  >
                    Telefone / WhatsApp *
                  </label>
                  <input
                    id="rsvp-phone"
                    type="tel"
                    value={watchedValues.phone}
                    onChange={handlePhoneMask}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'rsvp-phone-err' : undefined}
                    placeholder="(21) 99999-9999"
                    className="w-full px-4 py-3 rounded-xl border border-blush/60 bg-ivory/40 text-sm text-graphite"
                  />
                  {errors.phone && (
                    <p id="rsvp-phone-err" className="mt-1.5 text-xs text-burgundy font-medium">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="rsvp-inviteCode"
                  className="block text-xs uppercase tracking-[0.14em] text-graphite font-medium mb-1.5"
                >
                  Código ou nome no convite (opcional)
                </label>
                <input
                  id="rsvp-inviteCode"
                  type="text"
                  {...register('inviteCode')}
                  placeholder="Ex: Família Silva / Convite #42"
                  className="w-full px-4 py-3 rounded-xl border border-blush/60 bg-ivory/40 text-sm text-graphite"
                />
              </div>

              {/* Confirmação: Sim ou Não */}
              <fieldset className="space-y-2.5 pt-2">
                <legend className="text-xs uppercase tracking-[0.14em] text-graphite font-medium">
                  Você poderá comparecer? *
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all ${
                      watchedValues.attending === 'yes'
                        ? 'border-burgundy bg-burgundy/10 text-burgundy font-semibold'
                        : 'border-blush/60 bg-ivory/40 text-graphite'
                    }`}
                  >
                    <span className="text-sm">Sim, estarei presente!</span>
                    <input
                      type="radio"
                      value="yes"
                      {...register('attending')}
                      className="sr-only"
                    />
                    {watchedValues.attending === 'yes' && <Check className="w-4 h-4" />}
                  </label>

                  <label
                    className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all ${
                      watchedValues.attending === 'no'
                        ? 'border-burgundy bg-burgundy/10 text-burgundy font-semibold'
                        : 'border-blush/60 bg-ivory/40 text-graphite'
                    }`}
                  >
                    <span className="text-sm">Não poderei comparecer</span>
                    <input
                      type="radio"
                      value="no"
                      {...register('attending')}
                      className="sr-only"
                    />
                    {watchedValues.attending === 'no' && <Check className="w-4 h-4" />}
                  </label>
                </div>
              </fieldset>

              {/* Campos condicionais para acompanhantes quando "Sim, estarei presente" */}
              {isAttending && (
                <div className="p-5 rounded-2xl bg-ivory/75 border border-blush/45 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-olive" aria-hidden="true" />
                      <label
                        htmlFor="rsvp-companions-select"
                        className="text-xs uppercase tracking-[0.14em] text-graphite font-medium"
                      >
                        Quantidade de acompanhantes (além de você)
                      </label>
                    </div>
                    <select
                      id="rsvp-companions-select"
                      value={watchedValues.companionsCount}
                      onChange={(e) => handleCompanionsCountChange(Number(e.target.value))}
                      className="px-4 py-2 rounded-full border border-blush/60 bg-warmwhite text-sm text-graphite"
                    >
                      {Array.from(
                        { length: weddingConfig.rsvp.maxCompanions + 1 },
                        (_, idx) => idx
                      ).map((num) => (
                        <option key={num} value={num}>
                          {num === 0
                            ? 'Irei desacompanhado(a)'
                            : `${num} ${num === 1 ? 'acompanhante' : 'acompanhantes'}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {fields.length > 0 && (
                    <div className="space-y-3 pt-2 border-t border-blush/35">
                      <p className="text-xs text-graphite-muted">
                        Informe o nome completo de cada acompanhante para a lista da recepção:
                      </p>
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start"
                        >
                          <div className="sm:col-span-7">
                            <label
                              htmlFor={`companion-name-${index}`}
                              className="sr-only"
                            >
                              Nome do acompanhante {index + 1}
                            </label>
                            <input
                              id={`companion-name-${index}`}
                              type="text"
                              {...register(`companions.${index}.name`)}
                              placeholder={`Nome completo do acompanhante ${index + 1} *`}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-blush/60 bg-warmwhite text-sm text-graphite"
                            />
                            {errors.companions?.[index]?.name && (
                              <p className="mt-1 text-xs text-burgundy">
                                {errors.companions[index]?.name?.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-5">
                            <label
                              htmlFor={`companion-diet-${index}`}
                              className="sr-only"
                            >
                              Restrição alimentar do acompanhante {index + 1}
                            </label>
                            <input
                              id={`companion-diet-${index}`}
                              type="text"
                              {...register(`companions.${index}.dietaryRestrictions`)}
                              placeholder="Restrição alimentar (opcional)"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-blush/60 bg-warmwhite text-sm text-graphite"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Restrições alimentares e Observações */}
              {isAttending && (
                <div>
                  <label
                    htmlFor="rsvp-dietary"
                    className="block text-xs uppercase tracking-[0.14em] text-graphite font-medium mb-1.5"
                  >
                    Suas restrições alimentares ou alergias (opcional)
                  </label>
                  <input
                    id="rsvp-dietary"
                    type="text"
                    {...register('dietaryRestrictions')}
                    placeholder="Ex: Vegetariano, intolerância a lactose, alergia a camarão..."
                    className="w-full px-4 py-3 rounded-xl border border-blush/60 bg-ivory/40 text-sm text-graphite"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="rsvp-notes"
                  className="block text-xs uppercase tracking-[0.14em] text-graphite font-medium mb-1.5"
                >
                  Observações ou recado para os noivos (opcional)
                </label>
                <textarea
                  id="rsvp-notes"
                  rows={3}
                  {...register('notes')}
                  placeholder="Vai precisar de estacionamento valet? Quer sugerir um samba para a roda? Conta pra gente!"
                  className="w-full px-4 py-3 rounded-xl border border-blush/60 bg-ivory/40 text-sm text-graphite"
                />
              </div>

              {/* Consentimento claro LGPD */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('consentAccepted')}
                    className="mt-1 w-4 h-4 rounded border-blush text-burgundy focus:ring-burgundy"
                  />
                  <span className="text-xs text-graphite-muted leading-relaxed">
                    Concordo com o uso dos dados informados exclusivamente para a organização, recepção e comunicação do casamento de Daniel &amp; Yohana. *
                  </span>
                </label>
                {errors.consentAccepted && (
                  <p className="mt-1.5 text-xs text-burgundy font-medium">
                    {errors.consentAccepted.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.18em] font-semibold hover:bg-burgundy-dark transition-all flex items-center justify-center gap-2"
            >
              <span>Revisar confirmação antes de enviar</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        )}

        {/* ETAPA 2: RESUMO ANTES DO ENVIO */}
        {step === 'review' && (
          <div className="p-6 sm:p-10 rounded-organic bg-warmwhite border border-blush/55 space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-blush/35 pb-4">
              <div>
                <span className="text-xs uppercase tracking-[0.18em] text-olive font-semibold">
                  Quase lá!
                </span>
                <h2 className="font-serif text-3xl text-graphite">
                  Confira o resumo da sua resposta
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setStep('form')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-burgundy hover:underline"
              >
                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Editar dados</span>
              </button>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-ivory/70 p-5 rounded-2xl border border-blush/40">
              <div>
                <dt className="text-xs text-graphite-muted uppercase tracking-wider">Nome</dt>
                <dd className="font-medium text-graphite mt-0.5">{watchedValues.fullName}</dd>
              </div>
              <div>
                <dt className="text-xs text-graphite-muted uppercase tracking-wider">Presença</dt>
                <dd className="font-medium text-burgundy mt-0.5">
                  {isAttending ? 'Sim, estarei presente!' : 'Não poderei comparecer'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-graphite-muted uppercase tracking-wider">E-mail</dt>
                <dd className="text-graphite mt-0.5">{watchedValues.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-graphite-muted uppercase tracking-wider">
                  WhatsApp
                </dt>
                <dd className="text-graphite mt-0.5">{watchedValues.phone}</dd>
              </div>
              {isAttending && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-graphite-muted uppercase tracking-wider">
                    Acompanhantes ({watchedValues.companionsCount})
                  </dt>
                  <dd className="text-graphite mt-1">
                    {watchedValues.companionsCount === 0
                      ? 'Sem acompanhantes adicionais'
                      : watchedValues.companions
                          .map((c) =>
                            c.dietaryRestrictions
                              ? `${c.name} (${c.dietaryRestrictions})`
                              : c.name
                          )
                          .join(', ')}
                  </dd>
                </div>
              )}
              {watchedValues.dietaryRestrictions && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-graphite-muted uppercase tracking-wider">
                    Restrições Alimentares
                  </dt>
                  <dd className="text-graphite mt-0.5">{watchedValues.dietaryRestrictions}</dd>
                </div>
              )}
              {watchedValues.notes && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-graphite-muted uppercase tracking-wider">
                    Observações
                  </dt>
                  <dd className="text-graphite mt-0.5">{watchedValues.notes}</dd>
                </div>
              )}
            </dl>

            {submitError && (
              <div className="p-4 rounded-xl bg-burgundy/10 border border-burgundy/30 text-xs text-burgundy flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{submitError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="py-3.5 px-6 rounded-full border border-blush/60 text-xs uppercase tracking-[0.15em] font-semibold text-graphite"
              >
                Voltar e ajustar
              </button>
              <button
                type="button"
                onClick={handleFinalConfirm}
                disabled={submitting}
                className="flex-1 py-3.5 px-6 rounded-full bg-burgundy text-warmwhite text-xs uppercase tracking-[0.16em] font-semibold hover:bg-burgundy-dark transition-all"
              >
                {submitting ? 'Enviando confirmação...' : 'Confirmar e Enviar Resposta'}
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 3: MENSAGEM DE SUCESSO */}
        {step === 'success' && savedSubmission && (
          <div className="p-8 sm:p-12 rounded-organic bg-warmwhite border border-olive/50 text-center space-y-6 animate-fade-in-up">
            <div className="w-16 h-16 rounded-full bg-olive/15 text-olive mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.2em] text-olive font-semibold">
                Resposta Confirmada!
              </span>
              <h2 className="font-serif text-4xl text-burgundy">
                {savedSubmission.attending === 'yes'
                  ? 'Que alegria ter você na nossa roda!'
                  : 'Sentiremos sua falta, obrigado por avisar!'}
              </h2>
              <p className="text-sm text-graphite-muted max-w-lg mx-auto leading-relaxed">
                Guarde o seu código de confirmação abaixo caso precise editar acompanhantes ou restrições alimentares posteriormente:
              </p>
            </div>

            <div className="inline-block px-6 py-3 rounded-2xl bg-ivory border border-blush/50">
              <span className="text-[11px] uppercase tracking-[0.18em] text-graphite-muted block">
                Código da sua Confirmação
              </span>
              <strong className="font-serif text-3xl text-burgundy tracking-wider">
                {savedSubmission.token}
              </strong>
            </div>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="px-6 py-3 rounded-full border border-burgundy/40 text-burgundy text-xs uppercase tracking-[0.15em] font-semibold hover:bg-burgundy/10 transition-colors"
              >
                Editar minha resposta agora
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
