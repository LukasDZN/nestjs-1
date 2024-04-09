import { Injectable } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { PinoLogger } from 'nestjs-pino'
import { configs } from './configs/configs'

@Injectable()
export class AppService {
    constructor(
        private readonly logger: PinoLogger,
        private readonly clsService: ClsService
    ) {
        this.logger.setContext(AppService.name)
    }

    // constructor(private configService: ConfigService) {
    // }

    async getHello(): Promise<string> {
        // const x = configService.get<boolean>('ARE_CRON_JOBS_ENABLED')

        console.log(configs.env.server.PORT)

        await new Promise((resolve) => setTimeout(resolve, 1))

        // console.log('Correlation ID:', this.clsService.get('correlationId'))

        // Loki-compatible log format (pino-loki)
        this.logger.info({
            zeppelin: 'chair',
            message: 'Hello World!',
            correlationId: this.clsService.get('correlationId'),
        })

        // ! TODO
        // try {
        //     throw new Error('This is an error')
        // } catch ((error as Error)) {
        //     this.logger.error({
        //         message: error.message,
        //         stack: error.stack,
        //     })
        // }

        return 'Hello World!'
    }
}
