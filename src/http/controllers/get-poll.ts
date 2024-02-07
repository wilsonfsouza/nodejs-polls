import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function getPoll(request: FastifyRequest, reply: FastifyReply) {
  const getPollParamsSchema = z.object({
    pollId: z.string().uuid(),
  })

  const { pollId } = getPollParamsSchema.parse(request.params)

  const poll = await prisma.poll.findUnique({
    where: {
      id: pollId,
    },
    include: {
      options: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  })

  return reply.status(200).send({ poll })
}
