import { Injectable, NestMiddleware } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
    use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
        let correlationId = req.headers['correlation-id']

        if (!correlationId) {
            correlationId = crypto.randomUUID()
        }

        res.setHeader('correlation-id', correlationId)

        next()
    }
}
