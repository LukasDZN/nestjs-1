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
            // genReqId() {
            // This project does not utilize request IDs, so we return an empty string
            //     const emptyValue = ''
            //     return emptyValue
            // },
        }),
        {
            bufferLogs: true,
        }
    )

    // Configure NestJS logger to use the Pino logger as the underlying logger
    const logger = app.get(Logger)
    app.useLogger(logger)

    // app.getHttpAdapter().getInstance().register(helmet, { global: true })
    // app.register(helmet, { global: true })

    app.enableCors({
        origin: (origin, callback) => {
            const allowedOrigins = ['https://api.example.com']
            callback(null, allowedOrigins.includes(origin))
        },
        // Additional CORS configuration options
        credentials: true, // If your client needs to send cookies
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
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
