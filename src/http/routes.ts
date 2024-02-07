import { FastifyInstance } from 'fastify'
import { createPoll } from './controllers/create-poll'
import { getPoll } from './controllers/get-poll'

export async function appRoutes(app: FastifyInstance) {
  app.post('/polls', createPoll)
  app.get('/polls/:pollId', getPoll)
}
