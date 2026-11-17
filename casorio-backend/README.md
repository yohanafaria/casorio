# Daniel & Yohana — Casório Backend API

Backend seguro em **Node.js (ES Modules) + Express + Supabase (PostgreSQL) + Mercado Pago** que atende integralmente aos contratos esperados por `casorio-frontend/src/services/`.

---

## 1. Estrutura do Projeto

```text
casorio-backend/
├── scripts/
│   └── seedGifts.js              # Popula a tabela `gifts` no Supabase com os 12 presentes da lua de mel
├── src/
│   ├── config/
│   │   ├── env.js                # Leitura e validação de variáveis de ambiente
│   │   ├── mercadopago.js        # Inicialização segura do SDK Mercado Pago (Access Token)
│   │   └── supabase.js           # Inicialização segura do Supabase (Service Role Key)
│   ├── controllers/
│   │   ├── giftController.js     # GET /api/gifts e GET /api/gifts/:id
│   │   ├── orderController.js    # POST /api/orders (cálculo autoritativo de preços e validação de estoque)
│   │   ├── paymentController.js  # POST /api/payments/create e GET /api/payments/:id/status
│   │   ├── rsvpController.js     # POST /api/rsvp, GET /api/rsvp/:token e PUT /api/rsvp/:token
│   │   └── webhookController.js  # POST /api/webhooks/mercadopago (validação HMAC + idempotência)
│   ├── middlewares/
│   │   ├── errorHandler.js       # Tratamento centralizado de erros ({ message })
│   │   └── rateLimiters.js       # Proteção contra abuso/spam no RSVP, Checkout e rotas gerais
│   ├── routes/
│   │   └── apiRoutes.js          # Definição das rotas sob /api
│   ├── utils/
│   │   ├── httpError.js          # Classe HttpError padronizada
│   │   ├── mappers.js            # Conversão snake_case (PostgreSQL) -> camelCase (Frontend DTOs)
│   │   └── validators.js         # Sanitização e validação de payloads de entrada
│   └── app.js                    # Configuração Express, CORS, JSON limit e middlewares
├── supabase/
│   └── schema.sql                # Script SQL completo para criar as tabelas no Supabase
├── .env.example                  # Exemplo de variáveis de ambiente
├── .gitignore
├── package.json                  # Configurado com "type": "module"
├── render.yaml                   # Blueprint para deploy no Render.com
└── server.js                     # Entrypoint HTTP (0.0.0.0:PORT)
```

---

## 2. Configuração e Execução Local

1. Copie o arquivo `.env.example` para `.env` na pasta `casorio-backend`:
   ```bash
   cp .env.example .env
   ```
2. Preencha `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `MP_ACCESS_TOKEN` no arquivo `.env`.
3. No painel do **Supabase** (`SQL Editor`), execute o conteúdo de `supabase/schema.sql`.
4. (Opcional) Popule os 12 presentes iniciais da Lua de Mel no Supabase:
   ```bash
   npm run seed
   ```
5. Inicie o servidor:
   ```bash
   # Modo desenvolvimento (com watch):
   npm run dev

   # Modo produção:
   npm start
   ```

---

## 3. Endpoints Implementados

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Status do servidor e verificação de credenciais configuradas |
| `GET` | `/api/gifts` | Lista todos os presentes ativos formatados em camelCase |
| `GET` | `/api/gifts/:id` | Detalhes de um presente específico |
| `POST` | `/api/rsvp` | Cria uma confirmação de presença com código único `DY-XXXXXX` |
| `GET` | `/api/rsvp/:token` | Busca confirmação por código `DY-XXXXXX`, e-mail ou código do convite |
| `PUT` | `/api/rsvp/:token` | Atualiza confirmação existente |
| `POST` | `/api/orders` | Valida estoque, recalcula preços pelo banco e cria pedido `awaiting_payment` |
| `POST` | `/api/payments/create` | Inicializa sessão do Brick (`action: 'init_brick'`) ou registra/processa pagamento |
| `GET` | `/api/payments/:id/status` | Consulta status confirmado pelo backend/Mercado Pago |
| `POST` | `/api/webhooks/mercadopago` | Webhook oficial com validação de assinatura e baixa idempotente de estoque |
