import { CreateExpressContextOptions } from '@trpc/server/adapters/express'

// --------------------------------------------

// * Create context for the server (req.ctx), (express specific adapters)
export function createContext({ req, res }: CreateExpressContextOptions) {
  return {
    req, 
    res,

  }
}

// ? Remember to import this in server/api.ts and trpc.ts
