import dotenv from 'dotenv'
import path from 'path'
import { z } from 'zod'

let envFileName

if (process.env.SYSTEM_APP_ENV === 'production') {
    envFileName = '.env.production'
} else if (process.env.SYSTEM_APP_ENV === 'staging') {
    envFileName = '.env.staging'
} else if (process.env.SYSTEM_APP_ENV === 'test') {
    envFileName = '.env.test'
} else if (process.env.SYSTEM_APP_ENV === 'development') {
    envFileName = '.env.development'
} else {
    throw new Error(
        `Invalid SYSTEM_APP_ENV: ${process.env.SYSTEM_APP_ENV}. Must be one of: production, staging, test, development`
    )
}

const fullEnvPath = path.resolve(process.cwd(), envFileName)

dotenv.config({ path: fullEnvPath })

const envVariablesSchema = z.object({
    // Note: specify SYSTEM_APP_ENV in start script in package.json, it determines which .env file to use
    SYSTEM_APP_ENV: z.enum(['production', 'staging', 'test', 'development']),

    SYSTEM_NODE_ENV: z.enum(['production', 'development']),

    SERVER_PORT: z.coerce.number().int().positive().min(1).max(65535),
    SERVER_INSTANCE_NAME: z.string().min(1),

    POSTGRESQL_DB1_HOST: z.string().min(1),
    POSTGRESQL_DB1_PORT: z.coerce.number().int().positive().min(1).max(65535),
    POSTGRESQL_DB1_DATABASE: z.string().min(1),
    POSTGRESQL_DB1_USER: z.string().min(1),
    POSTGRESQL_DB1_PASSWORD: z.string().min(1),

    VENDOR_GRAFANA_HOST: z.string().min(1),
    VENDOR_GRAFANA_USER: z.string().min(1),
    VENDOR_GRAFANA_API_TOKEN: z.string().min(1),

    // ARE_CRON_JOBS_ENABLED: z.enum(['true', 'false']).transform((value) => {
    //     if (value === 'true') {
    //         return true
    //     }
    //     return false
    // }),

    // REDIS_URL: z.string().url(),
})

const envVariables = envVariablesSchema.parse(process.env)

export const env = {
    system: {
        NODE_ENV: envVariables.SYSTEM_NODE_ENV,
        APP_ENV: envVariables.SYSTEM_APP_ENV,
    },
    server: {
        PORT: envVariables.SERVER_PORT,
        INSTANCE_NAME: envVariables.SERVER_INSTANCE_NAME,
    },
    databases: {
        postgresqlDb1: {
            HOST: envVariables.POSTGRESQL_DB1_HOST,
            PORT: envVariables.POSTGRESQL_DB1_PORT,
            DATABASE: envVariables.POSTGRESQL_DB1_DATABASE,
            USER: envVariables.POSTGRESQL_DB1_USER,
            PASSWORD: envVariables.POSTGRESQL_DB1_PASSWORD,
        },
    },
    vendors: {
        grafana: {
            HOST: envVariables.VENDOR_GRAFANA_HOST,
            USER: envVariables.VENDOR_GRAFANA_USER,
            API_TOKEN: envVariables.VENDOR_GRAFANA_API_TOKEN,
        },
    },
    // redis: {
    //     REDIS_URL: parsedEnvVariables.REDIS_URL,
    // },
    // cronJobs: {
    //     ARE_CRON_JOBS_ENABLED: parsedEnvVariables.ARE_CRON_JOBS_ENABLED,
    // },
}
