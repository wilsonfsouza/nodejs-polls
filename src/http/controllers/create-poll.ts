import { prisma } from '@/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function createPoll(request: FastifyRequest, reply: FastifyReply) {
  const createPollBodySchema = z.object({
    title: z.string(),
  })

  const { title } = createPollBodySchema.parse(request.body)

  const poll = await prisma.poll.create({
    data: {
      title,
    },
  })

  return reply.status(201).send({ pollId: poll.id })
}
