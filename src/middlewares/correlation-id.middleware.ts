// import { Injectable, NestMiddleware } from '@nestjs/common'
// import { FastifyReply, FastifyRequest } from 'fastify'
// import { ClsService } from 'nestjs-cls'

// @Injectable()
// export class CorrelationIdMiddleware implements NestMiddleware {
//     constructor(private readonly clsService: ClsService) {}

//     use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
//         const correlationId = this.clsService.get('correlationId')

//         res.setHeader('correlation-id', correlationId)

//         next()
//     }
// }
