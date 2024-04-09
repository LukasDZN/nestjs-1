import { Module, RequestMethod } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ClsModule } from 'nestjs-cls'
import { LoggerModule } from 'nestjs-pino'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { configs } from './configs/configs'
import { LoggingInterceptor } from './interceptors/logging.interceptor'
import { UsersModule } from './modules/users/users.module'

@Module({
    imports: [
        ClsModule.forRoot({
            middleware: {
                // Automatically mount the ClsMiddleware for all routes
                mount: true,
                // Use the setup method to provide default store values.
                setup: (cls, req, res) => {
                    const correlationId = req.headers['correlation-id'] || crypto.randomUUID()
                    res.setHeader('correlation-id', correlationId)
                    cls.set('correlationId', correlationId)
                },
            },
        }),
        LoggerModule.forRoot({
            pinoHttp: {
                // Optional: Adds a name to every JSON log line
                name: configs.env.server.INSTANCE_NAME,
                level: configs.env.system.NODE_ENV !== 'production' ? 'debug' : 'info',
                transport:
                    configs.env.system.NODE_ENV !== 'production' // 'development' // !TEMP
                        ? { targets: [{ target: 'pino-pretty' }] }
                        : // : undefined,
                          {
                              targets: [
                                  {
                                      target: 'pino-loki',
                                      options: {
                                          batching: true,
                                          interval: 5,
                                          host: configs.env.vendors.grafana.HOST,
                                          basicAuth: {
                                              username: configs.env.vendors.grafana.USER,
                                              password: configs.env.vendors.grafana.API_TOKEN,
                                          },
                                          labels: {
                                              // Add labels to all emitted logs
                                              serverInstanceName: configs.env.server.INSTANCE_NAME,
                                          },
                                          propsToLabels: [
                                              'correlationId',

                                              'req.method',
                                              'req.originalUrl',
                                              'res.statusCode',
                                          ],
                                      },
                                      level: 'info',
                                  },
                              ],
                          },
                quietReqLogger: true,
                timestamp: true,
                // customProps: (req, res) => {
                //     return {
                //   customProp: req
                //     }
                // },
                redact: [
                    'req.headers.authorization',
                    'req.headers.cookie',
                    'req.body.password',
                    '*.*.*.password',
                ],
            },
            // forRoutes: [],
            exclude: [{ method: RequestMethod.GET, path: 'health' }],
            // Optional: Rename "context" property in logs
            renameContext: 'service',
        }),
        UsersModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AppModule {}
