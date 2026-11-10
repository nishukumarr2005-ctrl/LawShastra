# LawShastra Server

This is the backend for the LawShastra legal learning platform.

## Stack

- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT auth
- Zod validation
- Swagger docs
- Jest + Supertest

## Getting started

1. Install PostgreSQL locally.
2. Create a database named `lawshastra`.
3. Copy `.env.example` to `.env` and update the values.
4. Run:

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Database

Use PostgreSQL with `DATABASE_URL` configured in `.env`.

## API base URL

```txt
http://localhost:5000/api/v1
```

## Security note

Never commit real secrets or production credentials.
