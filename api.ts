import express from 'express'
import cors from 'cors'


// * IMPORT TRPC SERVER
// npm i @trpc/server
import { createExpressMiddleware } from '@trpc/server/adapters/express'

// * IMPORT TRPC ROUTER
import { appRouter } from './router/index'  

// * IMPORT CONTEXT
import { createContext } from './context'

// --------------------------------------------
const trpcApiEndpoint = '/trpc'
const playgroundEndpoint = '/trpc-playground'
const app = express()
app.use(cors({ origin: 'http://localhost:5173' })) // cors for client

// * Add the TRPC middleware to express (express specific)
// http://localhost:3000/trpc
app.use(
  // Create route for trpc
  '/trpc',
  createExpressMiddleware({
    // Pass the router
    router: appRouter,
    // Add context to the server (req.ctx)
    createContext,
  })
)


app.listen(3002, () => console.log('Server started on port 3002'))

// * export types for client
export type AppRouter = typeof appRouter


