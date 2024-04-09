import postgres from 'postgres'
import { configs } from 'src/configs/configs'
import { seedDatabase } from './seed-database'

const seedDatabaseScript = async () => {
    console.log('Starting database seed script...')

    const sql = postgres(configs.databases.postgresqlDb1)

    await seedDatabase({ sql })

    console.log('Database seed script complete!')
}

seedDatabaseScript()
