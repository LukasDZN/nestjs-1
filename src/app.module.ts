import { Module, RequestMethod } from '@nestjs/common'
import { ClsModule } from 'nestjs-cls'
import { LoggerModule } from 'nestjs-pino'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './modules/users/users.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { LoggingInterceptor } from './interceptors/logging.interceptor'

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
            pinoHttp:
                // [
                {
                    // Optional: Adds a name to every JSON log line // TODO - use env var
                    name: 'SERVER-INSTANCE-1',
                    level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
                    // level: process.env.LOG_LEVEL ?? 'trace',

                    // Use pino-pretty for non-production environments
                    // transport:
                    //     process.env.NODE_ENV !== 'production'
                    //         ? { target: 'pino-pretty' }
                    //         : undefined,
                    quietReqLogger: true,
                    timestamp: true,
                    redact: [
                        'req.headers.authorization',
                        'req.headers.cookie',
                        'req.body.password',
                        'password',
                        'user.password',
                        'body.password',
                        'body.user.password',
                        'reqBody.password',
                        'reqBody.user.password',
                    ],
                    // Set log ID to be same as correlation ID from res (res correlation ID is set
                    // from header or by ClsModule middleware)
                    // serializers: {
                    //     // Req does not include body by default. You can add it here.
                    //     req: (req) => {
                    //         return req
                    //     },
                    //     res: (res) => {
                    //         return {
                    //             ...res,
                    //             // Since the res body is not directly accessible here,
                    //             // you might need to implement a custom mechanism to capture it before logging.
                    //         }
                    //     },
                    // },
                    // genReqId: (req, res) => {
                    //     console.log(res.getHeader('correlation-id'))
                    //     // generate req id
                    //     const id = crypto.randomUUID()
                    //     req.id = id
                    //     res.setHeader('X-Request-Id', id)
                    //     return id

                    //     // // const existingID = req.id ?? req.headers["x-request-id"]
                    //     // // const correlationId = res.headers['correlation-id']
                    //     // const correlationId = res.getHeader('correlation-id')
                    //     // console.log('bbbbbb')
                    //     // if (typeof correlationId === 'string') {
                    //     //     console.log('aaaaaaa')
                    //     //     return correlationId
                    //     // }

                    //     // const cls = ClsServiceManager.getClsService();

                    //     // const existingID = req.id ?? req.headers["x-request-id"]
                    //     // if (existingID) return existingID
                    //     // const id = 12345
                    //     // res.setHeader('X-Request-Id', id)
                    //     // return id

                    //     // throw new Error(
                    //     //     'Correlation ID not found. This should not happen. Check setup.'
                    //     // )
                    //     // return correlationId
                    //     // const id = randomUUID()
                    //     // res.setHeader('X-Request-Id', id)
                    //     // return id
                    //     // return crypto.randomUUID()
                    // },
                    transport: {
                        targets: [
                            // Console transport configuration
                            {
                                target: 'pino-pretty',
                                options: { colorize: true },
                                level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
                            },
                            // MongoDB transport configuration
                            // Ensure your MongoDB URL and the collection name are correct
                            // {
                            //     target: 'pino-mongodb',
                            //     level: 'info',
                            //     options: {
                            //         uri: 'mongodb+srv://lukasdzn:lukasdzn123@ld-cluster-1.vx2fmb7.mongodb.net/ld-development-db-1?retryWrites=true&w=majority',
                            //         collection: 'log',
                            //     },
                            // },
                            // PostgreSQL transport configuration
                            // Ensure your PostgreSQL URL and the table name are correct

                            // node my-app.js | pino-pg --connectionUrl <your connection string> --table <your logs table> --column <your column table>
                            // {
                            //     target: 'pino-pg',
                            //     level: 'info',
                            //     options: {
                            //         connectionUrl: 'postgresql://root:root@localhost:5432/dev-db-1',
                            //         tableName: 'log',
                            //     },
                            // },
                        ],
                    },
                },
            // ],
            // forRoutes: [],
            exclude: [{ method: RequestMethod.GET, path: 'health' }],
            // Optional: Rename "context" property in logs
            renameContext: 'service',
            // ],
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
