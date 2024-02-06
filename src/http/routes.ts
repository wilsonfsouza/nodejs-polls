import { FastifyInstance } from 'fastify'
import { createPoll } from './controllers/create-poll'

export async function appRoutes(app: FastifyInstance) {
  app.post('/polls', createPoll)
}
