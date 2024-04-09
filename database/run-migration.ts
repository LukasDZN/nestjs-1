import { readFileSync } from 'fs'
import postgres from 'postgres'
import { getCurrentDirectoryPath } from 'src/libs/getCurrentDirectoryPath.util'

export const runMigration = async ({
    sql,
    migrationFileName,
}: {
    sql: postgres.Sql
    migrationFileName: string
}) => {
    console.log(`🚀 Running database migration from file: ${migrationFileName}...`)

    // TODO: this should come from shared utils
    const migrationFilePath = getCurrentDirectoryPath({
        importMetaUrl: import.meta.url,
        fileNameWithExtension: `migrations/${migrationFileName}`,
    })

    const sqlMigrationQueriesString = readFileSync(migrationFilePath, 'utf-8')

    // Split the SQL migration string by semicolon to get individual SQL queries
    const sqlMigrationQueries = sqlMigrationQueriesString.split(';')

    try {
        await sql.begin(async (sql) => {
            for (const sqlMigrationQuery of sqlMigrationQueries) {
                console.log(`🚀 Running migration query: ${sqlMigrationQuery.slice(0, 50)} <...>`)

                await sql`${sqlMigrationQuery}`
            }
        })

        console.log('✅ Database migration complete!')
    } catch (error) {
        console.error(
            `❌ Error during database migration: ${error instanceof Error ? error.message : error}`
        )
    } finally {
        await sql.end()
    }
}
