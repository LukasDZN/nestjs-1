import helmet from '@fastify/helmet'
import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { Logger } from 'nestjs-pino'
import { join } from 'path'
import { AppModule } from './app.module'

const bootstrap = async () => {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            keepAliveTimeout: 30_000, // Default: 5_000
            trustProxy: true, // Default: false
            genReqId() {
                // This project does not utilize request IDs, so we return an empty string
                const emptyValue = ''
                return emptyValue
            },
        }),
        {
            bufferLogs: true,
        }
    )

    // Configure NestJS logger to use the Pino logger as the underlying logger
    const logger = app.get(Logger)
    app.useLogger(logger)

    // Overwrite default req/reply logging to include req/reply body and correlation ID
    // app.getHttpAdapter()
    //     .getInstance()
    //     .addHook('onRequest', (req, reply, done) => {
    //         // reply.startTime = now()
    //         req.log.info({ id: req.id, url: req.raw.url }, 'received request')
    //         done()
    //     })
    app.getHttpAdapter()
        .getInstance()
        .addHook('preHandler', (request, reply, done) => {
            if (request.body) {
                console.log('BBBBBBBBBBBBBBBBBBBBBBBB')
                console.log('This should be the body')
                // console.log({ body: request.body })
                logger.log({ body: request.body })
                console.log('BBBBBBBBBBBBBBBBBBBBBBBB')
            }
            done()
        })
    app.getHttpAdapter()
        .getInstance()
        .addHook('onResponse', (req, reply, done) => {
            console.log('CCCCCCCCCCCCCCCCCCCCCCCC')
            console.log('This should be the response')
            console.log(reply.raw)
            // req.log.info({
            //     ...reply.raw,
            //     // url: req.raw.url, // add url to response as well for simple correlating
            //     // statusCode: reply.raw.statusCode,
            //     // body: { ...reply },
            //     // durationMs: now() - res.startTime, // recreate duration in ms - use process.hrtime() - https://nodejs.org/api/process.html#process_process_hrtime_bigint for most accuracy
            // })
            console.log('CCCCCCCCCCCCCCCCCCCCCCCC')
            done()
        })

    await app.register(helmet)

    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigins = ['https://api.example.com']
            callback(null, allowedOrigins.includes(origin))
        },
        // Additional CORS configuration options
        // credentials: true, // If your client needs to send cookies
        // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
        // allowedHeaders: 'Content-Type, Accept', // Allowed custom headers
    })

    app.useStaticAssets({
        root: join(__dirname, '..', 'public'),
        prefix: '/public/',
    })

    // app.setViewEngine({
    //     engine: {
    //         handlebars: require('handlebars'),
    //     },
    //     templates: join(__dirname, '..', 'views'),
    // })

    app.setGlobalPrefix('api')

    app.enableVersioning({
        defaultVersion: '1',
        type: VersioningType.URI,
    })

    await app.listen(3000)
}

bootstrap()
