import { FastifyInstance } from 'fastify'
import { createPoll } from './controllers/create-poll'
import { getPoll } from './controllers/get-poll'
import { voteOnPoll } from './controllers/vote-on-poll'
import { pollResults } from './ws/poll-results'

export async function appRoutes(app: FastifyInstance) {
  app.post('/polls', createPoll)
  app.get('/polls/:pollId', getPoll)
  app.post('/polls/:pollId/votes', voteOnPoll)
  app.get('/polls/:pollId/results', { websocket: true }, pollResults)
}
