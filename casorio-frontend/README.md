# Daniel & Yohana — Site de Casamento

Frontend autoral, responsivo e acessível do casamento de **Daniel & Yohana**, construído com **React 18 + TypeScript + Vite + Tailwind CSS + React Hook Form + Zod**, com arquitetura de serviços desacoplada pronta para integração com **Supabase (PostgreSQL)** e **Mercado Pago Bricks**.

---

## Sumário

1. [Como Instalar e Executar o Frontend](#1-como-instalar-e-executar-o-frontend)
2. [Onde Editar os Dados e Presentes](#2-onde-editar-os-dados-e-presentes)
3. [Arquitetura Recomendada para Produção](#3-arquitetura-recomendada-para-produção)
4. [Passo 1: Criar o Banco de Dados no Supabase (SQL Completo)](#4-passo-1-criar-o-banco-de-dados-no-supabase-sql-completo)
5. [Passo 2: Credenciais do Mercado Pago](#5-passo-2-credenciais-do-mercado-pago)
6. [Passo 3: Implementação do Backend Mínimo (Node.js + Express)](#6-passo-3-implementação-do-backend-mínimo-nodejs--express)
7. [Passo 4: Conectar o Frontend ao Backend e Ativar o Payment Brick](#7-passo-4-conectar-o-frontend-ao-backend-e-ativar-o-payment-brick)
8. [Passo 5: Checklist de Segurança Obrigatório](#8-passo-5-checklist-de-segurança-obrigatório)
9. [Passo 6: Publicação (Deploy) e Domínio Próprio](#9-passo-6-publicação-deploy-e-domínio-próprio)

---

## 1. Como Instalar e Executar o Frontend

Certifique-se de ter o **Node.js (v18+)** instalado.

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor de desenvolvimento (http://localhost:5173)
npm run dev

# 3. Gerar build de produção na pasta dist/
npm run build
```

---

## 2. Onde Editar os Dados e Presentes

* **`src/config/weddingConfig.ts`**: Centraliza nomes, monograma, data ISO (`weddingConfig.date.iso` usada pelo countdown), horários, endereço completo (`Canto do Alto — Alto da Boa Vista`), coordenadas, links do Google Maps e Waze, limite de acompanhantes no RSVP e textos principais.
* **`src/data/mockGifts.ts`**: Lista de experiências da lua de mel em reais (BRL), valores de cotas sugeridas e ilustrações vetoriais personalizadas do casal.

---

## 3. Arquitetura Recomendada para Produção

Para colocar o site no ar com custo mínimo/gratuito, alta disponibilidade e segurança:

* **Frontend:** **Vercel** (Plano *Hobby* gratuito, deploy contínuo via GitHub e HTTPS automático).
* **Banco de Dados:** **Supabase** (PostgreSQL gratuito com painel visual estilo planilha para acompanhar confirmações de presença e pedidos de presentes em tempo real).
* **Backend (API):** **Render.com** ou **Railway** (rodando um servidor enxuto Node.js + Express).
* **Gateway de Pagamento:** **Mercado Pago** (Pix instantâneo, cartão de crédito e boleto via Payment Brick + Webhook).

---

## 4. Passo 1: Criar o Banco de Dados no Supabase (SQL Completo)

1. Crie uma conta gratuita em [supabase.com](https://supabase.com) e crie um novo projeto.
2. No menu lateral, clique em **SQL Editor** -> **New Query**, cole o script abaixo e clique em **Run**:

```sql
-- 1. Tabela de Presentes (Experiências da Lua de Mel)
create table gifts (
  id text primary key,
  name text not null,
  description text not null,
  long_description text,
  category text not null default 'Lua de mel',
  image text not null,
  price numeric(10,2) not null,
  available_quantity integer not null default 1,
  allow_partial_contribution boolean not null default false,
  suggested_contributions numeric[] default '{}',
  active boolean not null default true,
  badge text,
  musical_note text,
  created_at timestamptz default now()
);

-- 2. Tabela de Confirmação de Presença (RSVP)
create table rsvps (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  full_name text not null,
  email text not null,
  phone text not null,
  invite_code text,
  attending text not null check (attending in ('yes', 'no')),
  companions_count integer not null default 0,
  companions jsonb not null default '[]'::jsonb,
  dietary_restrictions text,
  notes text,
  consent_accepted boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Tabela de Pedidos de Presentes
create table orders (
  id text primary key,
  items jsonb not null,
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text not null,
  message text,
  subtotal numeric(10,2) not null,
  total numeric(10,2) not null,
  status text not null default 'awaiting_payment',
  created_at timestamptz default now()
);

-- 4. Tabela de Pagamentos (Mercado Pago)
create table payments (
  payment_id text primary key,
  order_id text references orders(id) on delete cascade,
  status text not null,
  status_detail text,
  amount numeric(10,2) not null,
  payment_method text,
  verified_by_backend boolean not null default false,
  created_at timestamptz default now()
);
```

3. Em **Project Settings** -> **API**, copie:
   * `Project URL` (`SUPABASE_URL`)
   * `service_role secret` (`SUPABASE_SERVICE_ROLE_KEY` — **uso exclusivo no backend**).

---

## 5. Passo 2: Credenciais do Mercado Pago

1. Acesse o painel [Mercado Pago Developers](https://www.mercadopago.com.br/developers/panel/app) e crie uma aplicação.
2. Copie as chaves (primeiro de **Teste** para homologar, depois de **Produção**):
   * **Public Key** -> será configurada no frontend (`VITE_MERCADO_PAGO_PUBLIC_KEY`).
   * **Access Token** -> será configurado **exclusivamente** no backend (`MP_ACCESS_TOKEN`). Nunca coloque o Access Token no frontend.

---

## 6. Passo 3: Implementação do Backend Mínimo (Node.js + Express)

Crie uma pasta separada para o servidor (ex: `casorio-backend/`):

```bash
mkdir casorio-backend && cd casorio-backend
npm init -y
npm install express cors dotenv express-rate-limit @supabase/supabase-js mercadopago
```

No `package.json` do backend, adicione `"type": "module"`.

### Variáveis de Ambiente do Backend (`casorio-backend/.env`)

```env
PORT=3333
FRONTEND_URL=http://localhost:5173
BACKEND_PUBLIC_URL=https://sua-api.onrender.com
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-secreta
MP_ACCESS_TOKEN=APP_USR-seu-access-token-secreto
```

### Código Completo do Servidor (`casorio-backend/server.js`)

Este arquivo implementa todos os endpoints esperados por `src/services/`:

```javascript
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));

// Rate limit para proteger o formulário de RSVP contra spam/bots
const rsvpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 15,
  message: { message: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' },
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// 1. LISTAR PRESENTES (GET /api/gifts)
app.get('/api/gifts', async (req, res) => {
  const { data, error } = await supabase
    .from('gifts')
    .select('*')
    .eq('active', true);

  if (error) return res.status(500).json({ message: error.message });

  const formatted = data.map((g) => ({
    id: g.id,
    name: g.name,
    description: g.description,
    longDescription: g.long_description,
    category: g.category,
    image: g.image,
    price: Number(g.price),
    availableQuantity: g.available_quantity,
    allowPartialContribution: g.allow_partial_contribution,
    suggestedContributions: g.suggested_contributions,
    active: g.active,
    badge: g.badge,
    musicalNote: g.musical_note,
  }));

  return res.json(formatted);
});

// 2. DETALHE DE UM PRESENTE (GET /api/gifts/:id)
app.get('/api/gifts/:id', async (req, res) => {
  const { data: g, error } = await supabase
    .from('gifts')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();

  if (error || !g) return res.status(404).json({ message: 'Presente não encontrado.' });

  return res.json({
    id: g.id,
    name: g.name,
    description: g.description,
    longDescription: g.long_description,
    category: g.category,
    image: g.image,
    price: Number(g.price),
    availableQuantity: g.available_quantity,
    allowPartialContribution: g.allow_partial_contribution,
    suggestedContributions: g.suggested_contributions,
    active: g.active,
    badge: g.badge,
    musicalNote: g.musical_note,
  });
});

// 3. CRIAR RSVP (POST /api/rsvp)
app.post('/api/rsvp', rsvpLimiter, async (req, res) => {
  const token = 'DY-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const payload = {
    token,
    full_name: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    invite_code: req.body.inviteCode,
    attending: req.body.attending,
    companions_count: req.body.companionsCount,
    companions: req.body.companions,
    dietary_restrictions: req.body.dietaryRestrictions,
    notes: req.body.notes,
    consent_accepted: req.body.consentAccepted,
  };

  const { data, error } = await supabase.from('rsvps').insert(payload).select().single();
  if (error) return res.status(400).json({ message: error.message });

  return res.status(201).json({
    ...req.body,
    id: data.id,
    token: data.token,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  });
});

// 4. BUSCAR RSVP POR TOKEN OU E-MAIL (GET /api/rsvp/:token)
app.get('/api/rsvp/:token', async (req, res) => {
  const param = req.params.token.trim();
  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .or(`token.eq.${param.toUpperCase()},email.ilike.${param}`)
    .maybeSingle();

  if (error || !data) {
    return res.status(404).json({ message: 'Confirmação não encontrada.' });
  }

  return res.json({
    id: data.id,
    token: data.token,
    fullName: data.full_name,
    email: data.email,
    phone: data.phone,
    inviteCode: data.invite_code,
    attending: data.attending,
    companionsCount: data.companions_count,
    companions: data.companions,
    dietaryRestrictions: data.dietary_restrictions,
    notes: data.notes,
    consentAccepted: data.consent_accepted,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  });
});

// 5. ATUALIZAR RSVP EXISTENTE (PUT /api/rsvp/:token)
app.put('/api/rsvp/:token', rsvpLimiter, async (req, res) => {
  const { data, error } = await supabase
    .from('rsvps')
    .update({
      full_name: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      invite_code: req.body.inviteCode,
      attending: req.body.attending,
      companions_count: req.body.companionsCount,
      companions: req.body.companions,
      dietary_restrictions: req.body.dietaryRestrictions,
      notes: req.body.notes,
      updated_at: new Date().toISOString(),
    })
    .eq('token', req.params.token.toUpperCase())
    .select()
    .single();

  if (error) return res.status(400).json({ message: error.message });

  return res.json({
    ...req.body,
    id: data.id,
    token: data.token,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  });
});

// 6. CRIAR PEDIDO DE PRESENTE (POST /api/orders)
app.post('/api/orders', async (req, res) => {
  const orderId = `PED-${Date.now().toString().slice(-6)}`;
  const { items, buyerName, buyerEmail, buyerPhone, message } = req.body;

  const safeTotal = items.reduce((acc, item) => acc + Number(item.totalItemPrice), 0);

  const { data, error } = await supabase
    .from('orders')
    .insert({
      id: orderId,
      items,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      buyer_phone: buyerPhone,
      message,
      subtotal: safeTotal,
      total: safeTotal,
      status: 'awaiting_payment',
    })
    .select()
    .single();

  if (error) return res.status(400).json({ message: error.message });

  return res.status(201).json({
    id: data.id,
    items: data.items,
    buyerName: data.buyer_name,
    buyerEmail: data.buyer_email,
    buyerPhone: data.buyer_phone,
    message: data.message,
    subtotal: Number(data.subtotal),
    total: Number(data.total),
    status: data.status,
    createdAt: data.created_at,
  });
});

// 7. CRIAR SESSÃO BRICK OU PROCESSAR PAGAMENTO (POST /api/payments/create)
app.post('/api/payments/create', async (req, res) => {
  const { orderId, amount, action, formData } = req.body;

  if (action === 'init_brick') {
    const preference = new Preference(mpClient);
    const result = await preference.create({
      body: {
        items: [
          {
            id: orderId,
            title: `Presente Lua de Mel Daniel & Yohana (${orderId})`,
            quantity: 1,
            unit_price: Number(amount),
          },
        ],
        external_reference: orderId,
      },
    });
    return res.json({
      preferenceId: result.id,
      publicKeyConfigured: true,
      publicKeyPreview: 'Configurada',
      brickReadyToMount: true,
      backendNote: 'Sessão Mercado Pago iniciada pelo backend.',
    });
  }

  const payment = new Payment(mpClient);
  const mpRes = await payment.create({
    body: {
      ...formData,
      external_reference: orderId,
      notification_url: `${process.env.BACKEND_PUBLIC_URL}/api/webhooks/mercadopago`,
    },
  });

  await supabase.from('payments').upsert({
    payment_id: String(mpRes.id),
    order_id: orderId,
    status: mpRes.status,
    status_detail: mpRes.status_detail,
    amount: Number(amount),
    payment_method: mpRes.payment_method_id,
    verified_by_backend: mpRes.status === 'approved',
  });

  return res.json({
    orderId,
    paymentId: String(mpRes.id),
    status: mpRes.status,
    statusDetail: mpRes.status_detail,
    amount: Number(amount),
    paymentMethod: 'mercado_pago_brick',
    createdAt: new Date().toISOString(),
    verifiedByBackend: mpRes.status === 'approved',
  });
});

// 8. WEBHOOK OFICIAL DO MERCADO PAGO (POST /api/webhooks/mercadopago)
app.post('/api/webhooks/mercadopago', async (req, res) => {
  const paymentId = req.body?.data?.id || req.query?.['data.id'];
  if (!paymentId) return res.sendStatus(200);

  try {
    const payment = new Payment(mpClient);
    const mpData = await payment.get({ id: paymentId });
    const orderId = mpData.external_reference;

    await supabase.from('payments').upsert({
      payment_id: String(mpData.id),
      order_id: orderId,
      status: mpData.status,
      status_detail: mpData.status_detail,
      amount: mpData.transaction_amount,
      payment_method: mpData.payment_method_id,
      verified_by_backend: mpData.status === 'approved',
    });

    if (mpData.status === 'approved' && orderId) {
      await supabase
        .from('orders')
        .update({ status: 'paid_confirmed_by_backend' })
        .eq('id', orderId);
    }
  } catch (err) {
    console.error('Erro ao validar webhook Mercado Pago:', err);
  }
  return res.sendStatus(200);
});

// 9. CONSULTAR STATUS CONFIRMADO DO PAGAMENTO (GET /api/payments/:id/status)
app.get('/api/payments/:id/status', async (req, res) => {
  const { data } = await supabase
    .from('payments')
    .select('*')
    .eq('payment_id', req.params.id)
    .maybeSingle();

  if (!data) return res.status(404).json({ message: 'Pagamento não encontrado.' });

  return res.json({
    orderId: data.order_id,
    paymentId: data.payment_id,
    status: data.status,
    statusDetail: data.status_detail,
    amount: Number(data.amount),
    paymentMethod: data.payment_method,
    createdAt: data.created_at,
    verifiedByBackend: data.verified_by_backend,
  });
});

app.listen(process.env.PORT || 3333, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT || 3333}`);
});
```

---

## 7. Passo 4: Conectar o Frontend ao Backend e Ativar o Payment Brick

1. No diretório do frontend, instale o SDK oficial do Mercado Pago para React:
   ```bash
   npm install @mercadopago/sdk-react
   ```
2. Atualize o arquivo `.env` do frontend:
   ```env
   VITE_USE_MOCK_API=false
   VITE_API_BASE_URL=https://sua-api.onrender.com
   VITE_MERCADO_PAGO_PUBLIC_KEY=APP_USR-sua-public-key-aqui
   ```
3. Em `src/pages/CheckoutPage.tsx`, dentro de `#paymentBrick_container`, inicialize o SDK com `initMercadoPago(envConfig.mercadoPagoPublicKey, { locale: 'pt-BR' })` e renderize o componente `<Payment />` passando `brickSession.preferenceId`.

---

## 8. Passo 5: Checklist de Segurança Obrigatório

- [ ] **Segredos Fora do Frontend:** Nunca adicione `MP_ACCESS_TOKEN` ou `SUPABASE_SERVICE_ROLE_KEY` no `.env` do frontend (nada com prefixo `VITE_` é secreto).
- [ ] **Gitignore Ativo:** Certifique-se de que o arquivo `.env` está listado no `.gitignore` antes de fazer `git push`.
- [ ] **Validação Server-side de Preços:** O backend deve conferir o preço do item na tabela `gifts` antes de gerar a preferência do Mercado Pago (ou exigir valor mínimo de R$ 50 em cotas parciais).
- [ ] **Confirmação Somente via Servidor/Webhook:** Nunca considere um presente pago apenas pelo redirecionamento do navegador; confie sempre na consulta `payment.get()` do Mercado Pago no backend.
- [ ] **CORS Restrito:** No backend de produção, defina `FRONTEND_URL=https://seu-dominio.com.br` para que apenas o site do casamento possa chamar a API.

---

## 9. Passo 6: Publicação (Deploy) e Domínio Próprio

1. **Subir para o GitHub:** Crie um repositório privado no GitHub e envie o projeto.
2. **Deploy do Frontend na Vercel:**
   * Acesse [vercel.com](https://vercel.com), clique em **Add New Project** e importe o repositório.
   * O arquivo `vercel.json` já incluído na raiz do projeto garante que rotas diretas como `/presentes`, `/local` e `/confirmar-presenca` funcionem perfeitamente ao recarregar a página.
   * Configure as variáveis de ambiente (`VITE_USE_MOCK_API`, `VITE_API_BASE_URL` e `VITE_MERCADO_PAGO_PUBLIC_KEY`) no painel da Vercel.
3. **Deploy do Backend no Render.com:**
   * Acesse [render.com](https://render.com), clique em **New Web Service**, conecte o repositório do backend e preencha as variáveis privadas (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `MP_ACCESS_TOKEN`, `FRONTEND_URL`).
4. **Domínio Personalizado (ex: `danieleyohana.com.br`):**
   * Registre o domínio no [registro.br](https://registro.br).
   * Na Vercel, abra **Settings -> Domains**, adicione o domínio e configure os apontamentos DNS (`Tipo A` e `CNAME`) exibidos pela Vercel no painel do Registro.br. O certificado SSL/HTTPS é emitido automaticamente.
