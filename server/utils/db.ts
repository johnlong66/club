import Database from 'better-sqlite3'
import { join } from 'path'

const db = new Database('people.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS people (
    id TEXT PRIMARY KEY,
    prename TEXT,
    prenameUnknown INTEGER NOT NULL DEFAULT 0,
    nickname TEXT,
    nicknameUnsure INTEGER NOT NULL DEFAULT 0,
    meetingDay TEXT NOT NULL,
    comment TEXT,
    country TEXT
  )
`)

// migrate existing tables
try { db.exec(`ALTER TABLE people ADD COLUMN prenameUnknown INTEGER NOT NULL DEFAULT 0`) } catch {}
try { db.exec(`ALTER TABLE people ADD COLUMN comment TEXT`) } catch {}
try { db.exec(`ALTER TABLE people ADD COLUMN country TEXT`) } catch {}
try { db.exec(`ALTER TABLE people ADD COLUMN nicknameUnsure INTEGER NOT NULL DEFAULT 0`) } catch {}
try { db.exec(`UPDATE people SET nicknameUnsure = nicknameUnknown WHERE nicknameUnknown IS NOT NULL`) } catch {}
try { db.exec(`ALTER TABLE people DROP COLUMN nicknameUnknown`) } catch {}

// remove NOT NULL constraints from prename and nickname by recreating the table
const hasBadConstraints = (db.prepare(`SELECT "notnull" FROM pragma_table_info('people') WHERE name='nickname'`).get() as any)?.notnull === 1
if (hasBadConstraints) {
  db.exec(`
    BEGIN;
    ALTER TABLE people RENAME TO _people_old;
    CREATE TABLE people (
      id TEXT PRIMARY KEY,
      prename TEXT,
      prenameUnknown INTEGER NOT NULL DEFAULT 0,
      nickname TEXT,
      nicknameUnsure INTEGER NOT NULL DEFAULT 0,
      meetingDay TEXT NOT NULL,
      comment TEXT
    );
    INSERT INTO people SELECT id, prename, prenameUnknown, nickname, nicknameUnsure, meetingDay, comment FROM _people_old;
    DROP TABLE _people_old;
    COMMIT;
  `)
}

export default db
