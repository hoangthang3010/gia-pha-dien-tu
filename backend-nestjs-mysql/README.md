# backend-nestjs-mysql

NestJS backend migrated from the MongoDB version to MySQL using TypeORM.

## Tech Stack

- NestJS 11
- TypeORM
- MySQL (`mysql2`)
- JWT auth + refresh token session table

## Environment Setup

Create `.env` from `.env.example`:

```bash
copy .env.example .env
```

Required variables:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SYNC` (recommended: `false`)
- `CLIENT_URL`
- `NODE_ENV`
- `ACCESS_TOKEN_SECRET`

## Install Dependencies

```bash
npm install
```

## Migration

Generate migration from current entities:

```bash
npm run migration:generate
```

Run pending migrations:

```bash
npm run migration:run
```

Revert last migration:

```bash
npm run migration:revert
```

## Run Project

```bash
# development
npm run start:dev

# production
npm run build
npm run start:prod
```

App starts at `http://localhost:<PORT>` with API prefix `/api`.

## Notes

- `DB_SYNC=true` is only for local quick testing.
- For stable environments, keep `DB_SYNC=false` and use migrations.
