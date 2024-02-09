import { prisma } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'
import z from 'zod'

export async function voteOnPoll(request: FastifyRequest, reply: FastifyReply) {
  const voteOnPollSchema = z.object({
    pollId: z.string().uuid(),
  })

  const voteOnPollBodySchema = z.object({
    pollOptionId: z.string().uuid(),
  })

  const { pollId } = voteOnPollSchema.parse(request.params)
  const { pollOptionId } = voteOnPollBodySchema.parse(request.body)

  let { sessionId } = request.cookies

  if (sessionId) {
    const userPreviousVoteOnPoll = await prisma.vote.findUnique({
      where: {
        sessionId_pollId: {
          pollId,
          sessionId,
        },
      },
    })

    if (
      userPreviousVoteOnPoll &&
      userPreviousVoteOnPoll.pollOptionId === pollOptionId
    ) {
      return reply
        .status(400)
        .send({ message: 'You already voted on this poll.' })
    }

    if (
      userPreviousVoteOnPoll &&
      userPreviousVoteOnPoll.pollOptionId !== pollOptionId
    ) {
      await prisma.vote.delete({
        where: {
          id: userPreviousVoteOnPoll.id,
        },
      })

      await redis.zincrby(pollId, -1, userPreviousVoteOnPoll.pollOptionId)
    }
  }

  if (!sessionId) {
    sessionId = randomUUID()

    reply.setCookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      signed: true,
      httpOnly: true,
    })
  }

  await prisma.vote.create({
    data: {
      sessionId,
      pollId,
      pollOptionId,
    },
  })

  await redis.zincrby(pollId, 1, pollOptionId)

  return reply.status(201).send()
}
