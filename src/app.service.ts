import { Injectable } from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { PinoLogger } from 'nestjs-pino'

@Injectable()
export class AppService {
    constructor(
        private readonly logger: PinoLogger,
        private readonly clsService: ClsService
    ) {
        this.logger.setContext(AppService.name)
    }

    async getHello(): Promise<string> {
        await new Promise((resolve) => setTimeout(resolve, 1))

        // console.log('Correlation ID:', this.clsService.get('correlationId'))

        // this.logger.debug('AAAAAAAAAAAAAAAAAAAAAAAAaa', '')

        // this.logger.debug('hello world')

        return 'Hello World!'
    }
}
