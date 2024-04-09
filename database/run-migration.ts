import { readFileSync } from 'fs'
import postgres from 'postgres'
import { getCurrentDirectoryPath } from 'src/libs/getCurrentDirectoryPath.util'
import { serializeError } from 'src/libs/serializeError.util'

export const runMigration = async ({
    sql,
    migrationFileName,
}: {
    sql: postgres.Sql
    migrationFileName: string
}) => {
    console.log(`🚀 Running database migration from file: ${migrationFileName}...`)

    // TODO: this util should be imported from shared utils
    const migrationFilePath = getCurrentDirectoryPath({
        // @ts-expect-error ! TEMP VS Code bug. import.meta.url is valid
        importMetaUrl: import.meta.url,
        fileNameWithExtension: `migrations/${migrationFileName}`,
    })

    const sqlMigrationQueriesString = readFileSync(migrationFilePath, 'utf-8')

    // Split the SQL migration string by semicolon to get individual SQL queries
    let sqlMigrationQueries = sqlMigrationQueriesString.split(';')
    // Remove the last empty string element from the split
    sqlMigrationQueries = sqlMigrationQueries.slice(0, sqlMigrationQueries.length - 1)
    // Add the ";" back to the query because it was removed by the split
    sqlMigrationQueries = sqlMigrationQueries.map(
        (sqlMigrationQuery) => sqlMigrationQuery.trim() + ';'
    )

    console.log(`🚀 Found ${sqlMigrationQueries.length} SQL queries in migration file.`)

    try {
        await sql.begin(async (sql) => {
            for (const sqlMigrationQuery of sqlMigrationQueries) {
                console.log(`🚀 Running migration query:\n${sqlMigrationQuery}`)

                // Run the raw SQL query
                await sql.unsafe(`${sqlMigrationQuery}`)
            }
        })

        console.log('✅ Database migration complete!')
    } catch (error) {
        console.error(`❌ Error during database migration: ${serializeError(error)}`)
    } finally {
        await sql.end()
    }
}
