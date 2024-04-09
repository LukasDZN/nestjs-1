import postgres from 'postgres'
import { serializeError } from 'src/libs/serializeError.util'
import { seeds } from './seeds/seeds'

export const seedDatabase = async ({ sql }: { sql: postgres.Sql }) => {
    console.log('🌱 Seeding database...')

    try {
        await sql.begin(async (sql) => {
            await seeds.seedUsers({ sql })
            // Other seeds can be added here...
        })

        console.log('✅ Database seeded successfully!')
    } catch (error) {
        console.error(`❌ Error seeding database: ${serializeError(error)}`)
    } finally {
        await sql.end()
    }
}
