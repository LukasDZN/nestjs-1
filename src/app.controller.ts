import { Controller, Get } from '@nestjs/common'
import { Observable, from, map } from 'rxjs'
import { AppService } from './app.service'

// Root controller
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    // @Get('hi')
    // async getHello() {
    //     const helloResult = await this.appService.getHello()

    //     return {
    //         message: helloResult,
    //     }
    // }

    @Get('hi')
    getHello(): Observable<{ message: string }> {
        // from(this.getHelloAsync());
        return from(this.appService.getHello()).pipe(
            map((helloResult) => ({ message: helloResult }))
        )
    }
}
