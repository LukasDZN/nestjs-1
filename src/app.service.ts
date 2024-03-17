import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
    async getHello(): Promise<string> {
        // Sleep for 3 seconds
        await new Promise((resolve) => setTimeout(resolve, 3000))
        console.log('hi5')

        return 'Hello World!'
    }
}
