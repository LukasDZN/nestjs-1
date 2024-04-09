import postgres from 'postgres'
import { usersSeed } from './users.seed'

export const seedUsers = async ({ sql }: { sql: postgres.Sql }) => {
    console.log('🌱 Seeding users...')

    try {
        for (const user of usersSeed) {
            await sql`
                    INSERT INTO users (name, email, password, created_at, updated_at, role)
                    VALUES (${user.name}, ${user.email}, ${user.password}, ${user.createdAt}, ${user.updatedAt}, ${user.role})
                `

            console.log(`🌱 Seeded user: ${user.name}`)
        }

        console.log('✅ Users seeded successfully!')
    } catch (error) {
        console.error(`❌ Error seeding users: ${error instanceof Error ? error.message : error}`)
    }
}
