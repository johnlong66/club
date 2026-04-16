import Database from 'better-sqlite3'
import { join } from 'path'

const db = new Database(join(process.cwd(), 'people.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS people (
    id TEXT PRIMARY KEY,
    prename TEXT,
    prenameUnknown INTEGER NOT NULL DEFAULT 0,
    nickname TEXT,
    nicknameUnsure INTEGER NOT NULL DEFAULT 0,
    meetingDay TEXT NOT NULL,
    comment TEXT
  )
`)

// migrate existing tables
try { db.exec(`ALTER TABLE people ADD COLUMN prenameUnknown INTEGER NOT NULL DEFAULT 0`) } catch {}
try { db.exec(`ALTER TABLE people ADD COLUMN comment TEXT`) } catch {}
try { db.exec(`ALTER TABLE people ADD COLUMN nicknameUnsure INTEGER NOT NULL DEFAULT 0`) } catch {}
try { db.exec(`UPDATE people SET nicknameUnsure = nicknameUnknown WHERE nicknameUnknown IS NOT NULL`) } catch {}
try { db.exec(`ALTER TABLE people DROP COLUMN nicknameUnknown`) } catch {}

export default db
