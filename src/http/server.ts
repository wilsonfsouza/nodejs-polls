import { env } from '@/env'
import fastifyCookie from '@fastify/cookie'
import fastifyWebsocket from '@fastify/websocket'
import fastify from 'fastify'
import { appRoutes } from './routes'

const app = fastify()

app.register(fastifyCookie, {
  secret: env['COOKIES-SECRET'],
  hook: 'onRequest',
})

app.register(fastifyWebsocket)

app.register(appRoutes)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})
