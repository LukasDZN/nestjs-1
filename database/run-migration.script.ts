import postgres from 'postgres'
import { configs } from 'src/configs/configs'
import { runMigration } from './run-migration'

const MIGRATION_FILE_NAME = '001_create_users_table.up.sql'

const runMigrationScript = async () => {
    console.log('Starting database migration script...')

    const sql = postgres(configs.databases.postgresqlDb1)

    await runMigration({ sql, migrationFileName: MIGRATION_FILE_NAME })

    console.log('Database migration script complete!')
}

runMigrationScript()
