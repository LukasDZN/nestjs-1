import { Module } from '@nestjs/common'
import { ClsModule } from 'nestjs-cls'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
    imports: [
        // Register the ClsModule,
        ClsModule.forRoot({
            middleware: {
                // automatically mount the
                // ClsMiddleware for all routes
                mount: true,
                // and use the setup method to
                // provide default store values.
                setup: (cls, req) => {
                    const correlationId = req.headers['correlation-id'] || crypto.randomUUID()
                    cls.set('correlationId', correlationId)
                },
            },
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
