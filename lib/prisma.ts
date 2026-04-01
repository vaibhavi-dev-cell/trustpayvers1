/* eslint-disable @typescript-eslint/no-namespace */

// Prisma singleton — safe for Next.js hot reload
// In demo mode, prisma is not used (demo-data.ts serves everything)

import { isDemoMode } from './demo-mode'

function createPrismaClient() {
  if (isDemoMode()) {
    // Return a stub that warns on use
    return new Proxy({} as Record<string, unknown>, {
      get(_target, prop) {
        if (prop === 'then') return undefined
        console.warn(`[AEGIS] Prisma accessed in demo mode (property: ${String(prop)}). Using demo data instead.`)
        return new Proxy(() => Promise.resolve(null), {
          get() { return () => Promise.resolve([]) },
          apply() { return Promise.resolve(null) }
        })
      }
    })
  }

  // Dynamic import to avoid crash if @prisma/client isn't generated
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require('@prisma/client')
    return new PrismaClient()
  } catch {
    console.warn('[AEGIS] Prisma client not available — run `npx prisma generate` first.')
    return null
  }
}

declare namespace globalThis {
  let prisma: ReturnType<typeof createPrismaClient> | undefined
}

const prisma = globalThis.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export { prisma }
