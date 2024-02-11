import { voting } from '@/utils/voting-pub-sub'
import { SocketStream } from '@fastify/websocket'
import { FastifyRequest } from 'fastify'
import z from 'zod'

export async function pollResults(
  connection: SocketStream,
  request: FastifyRequest,
) {
  const getPollParamsSchema = z.object({
    pollId: z.string().uuid(),
  })

  const { pollId } = getPollParamsSchema.parse(request.params)

  voting.subscribe(pollId, (message) => {
    connection.socket.send(JSON.stringify(message))
  })
}
