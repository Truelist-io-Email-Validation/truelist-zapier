# Truelist Integrations

Automation platform integrations for the [Truelist](https://truelist.io) email validation API. Includes configurations for **Zapier**, **n8n**, and **Make.com**.

## Supported Platforms

| Platform | Type | Status |
|----------|------|--------|
| Zapier | Full CLI app (TypeScript) | Ready |
| n8n | Community node config | Configuration Reference |
| Make.com | Module config | Ready |

## Truelist API

All integrations use the [Truelist API](https://truelist.io):

- **POST** `/api/v1/verify` -- Validate an email address
- **GET** `/api/v1/account` -- Get account info (plan, credits)

### Response States

| State | Description |
|-------|-------------|
| `valid` | Email is deliverable |
| `invalid` | Email is not deliverable |
| `risky` | Email may be deliverable but has risk factors |
| `unknown` | Could not determine deliverability |

### Response Sub-States

`ok`, `accept_all`, `disposable_address`, `role_address`, `failed_mx_check`, `failed_spam_trap`, `failed_no_mailbox`, `failed_greylisted`, `failed_syntax_check`, `unknown`

---

## Zapier

The primary integration, built with the Zapier CLI framework (`zapier-platform-core`).

### Available Actions

- **Validate Email** -- Validate an email address and get deliverability state, sub-state, and metadata (free email, role address, disposable, suggestion).

### Setup

```bash
npm install
npm run build
```

### Development

```bash
# Typecheck
npm run lint

# Build
npm run build

# Run tests (requires TRUELIST_API_KEY env var for live tests)
TRUELIST_API_KEY=your_key npm test
```

### Deploy to Zapier

```bash
# Login to Zapier
npx zapier login

# Register the app (first time only)
npx zapier register "Truelist"

# Push a new version
npm run build
npx zapier push

# Invite testers
npx zapier users:add user@example.com 0.1.0
```

### Using in a Zap

1. Search for **Truelist** when adding an action step.
2. Connect your Truelist account with your API key (from [truelist.io/dashboard](https://truelist.io/dashboard)).
3. Choose the **Validate Email** action.
4. Map an email field from a previous step.
5. Use the output fields (`state`, `is_valid`, `is_deliverable`, etc.) in subsequent steps.

**Example Zap:** Google Sheets new row -> Truelist Validate Email -> Filter (is_valid = true) -> Mailchimp Add Subscriber

---

## n8n

> **Status: Configuration Reference** -- The `n8n/truelist-node.json` file is a field/metadata reference only. It does not contain executable logic and cannot run as-is. To build a working n8n community node, you must create a proper npm package with TypeScript execution logic (see the [n8n node creation docs](https://docs.n8n.io/integrations/creating-nodes/)).

### What's Included

The `n8n/truelist-node.json` file documents the node fields, credential schema, and API endpoints needed to build a full n8n community node. Use it as a starting point for the following structure:

```
n8n-nodes-truelist/
├── package.json            # with "n8n" field pointing to nodes/credentials
├── nodes/
│   └── Truelist/
│       └── Truelist.node.ts   # execute() logic with HTTP requests
├── credentials/
│   └── TruelistApi.credentials.ts
└── tsconfig.json
```

### Reference Fields

- **Validate Email** -- POST `/api/v1/verify` with `{ email }` body
- **Get Account** -- GET `/api/v1/account`
- **Credential** -- Bearer token via `Authorization` header

---

## Make.com

Module configuration for Make.com (formerly Integromat).

### Installation

The `make/truelist-module.json` file defines the Truelist connection and modules. To use with Make.com:

1. In Make.com, go to **Apps** > **Create a new app**.
2. Import the module configuration from `make/truelist-module.json`.
3. Configure the connection with your Truelist API key.

### Available Modules

- **Validate Email** -- Validate a single email address.
- **Get Account Info** -- Retrieve account plan and credit balance.

### Usage in Make.com

1. Add the **Truelist** app to your scenario.
2. Configure the connection with your API key.
3. Select **Validate Email** and map the email field.
4. Use output fields in subsequent modules for filtering or routing.

---

## Project Structure

```
truelist-zapier/
├── src/
│   ├── index.ts                # Zapier app definition
│   ├── authentication.ts       # API key auth
│   ├── actions/
│   │   └── validateEmail.ts    # Validate email action
│   ├── triggers/
│   │   └── newValidation.ts    # Placeholder trigger (Zapier requirement)
│   └── test/
│       ├── authentication.test.ts
│       └── validateEmail.test.ts
├── n8n/
│   └── truelist-node.json      # n8n community node config
├── make/
│   └── truelist-module.json    # Make.com module config
├── package.json
├── tsconfig.json
└── jest.config.ts
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TRUELIST_API_KEY` | For tests | Your Truelist API key |

## License

MIT
