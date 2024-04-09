import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'

export const runScript = async ({
    serviceName,
    // ...options
}: {
    serviceName: string
    // [key: string]: unknown
}) => {
    const app = await NestFactory.createApplicationContext(AppModule)

    // const tasksService = app.select(TasksModule).get(TasksService, { strict: true });

    try {
        const scriptService = app.get(serviceName, { strict: true })

        await scriptService.run()

        console.log('✅ Script completed successfully.')
    } catch (error) {
        console.error(`❌ Script failed: ${error instanceof Error ? error.message : error}`)
    } finally {
        await app.close()
    }
}
