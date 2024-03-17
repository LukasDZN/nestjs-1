import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { join } from 'path'
import { AppModule } from './app.module'
import { CorrelationIdMiddleware } from './middlewares/correlation-id.middleware'

const bootstrap = async () => {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

    // Apply CorrelationIdMiddleware globally
    app.use(new CorrelationIdMiddleware().use)

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
