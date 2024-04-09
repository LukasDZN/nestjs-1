import { databases } from './databases/databases.config'
import { env } from './env.config'

export const configs = {
    env,
    databases,
} as const
