import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { z } from 'zod'

const envVariablesSchema = z.object({
    NODE_ENV: z.enum(['production', 'development']),
    APP_ENV: z.enum(['production', 'staging', 'test', 'development']),
    PORT: z.string(),
})

@Module({
    imports: [
        ConfigModule.forRoot({
            // Define the env file path dynamically based on the APP_ENV
            envFilePath: `./.env.${process.env.APP_ENV || 'development'}`, // ? .local
            // Validate the env variables using the schema
            validate: (config) => {
                return envVariablesSchema.parse(config)
            },
            isGlobal: true, // Optional: Make the config globally available
        }),
    ],
})
export class EnvVariables {}
