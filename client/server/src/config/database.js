// Prisma client accessor.
// - Workers/D1: src/index.js creates PrismaClient with PrismaD1 adapter and calls setPrisma().
// - Node/local: lazy-creates PrismaClient from env (postgres or sqlite url) on first use.
import { PrismaClient } from './generated/prisma/client';
let _prisma = null

export function setPrisma(client) {
  _prisma = client
}

export function getPrisma() {
  if (!_prisma) {
    _prisma = new PrismaClient({ log: ['error', 'warn'] })
  }
  return _prisma
}

// Back-compat named export via proxy (most services do `import { prisma } from ...`)
export const prisma = new Proxy(
  {},
  {
    get(_target, prop) {
      return getPrisma()[prop]
    },
  },
)
