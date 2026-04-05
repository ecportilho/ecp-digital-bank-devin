import 'dotenv/config'
import { getDatabase, closeDatabase } from '../connection.js'
import { up } from './001_initial.js'

function runMigrations(): void {
  const db = getDatabase()
  console.log('Running migrations...')

  try {
    up(db)
    console.log('Migrations completed successfully.')
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    closeDatabase()
  }
}

runMigrations()
