import { Database } from 'bun:sqlite'
import mongoose from 'mongoose'

const MONGODB_URI = 'mongodb+srv://Krolock:MxzPKgR0DBXxRO1U@pizza.gll2x1j.mongodb.net/club'

const PersonSchema = new mongoose.Schema(
  {
    prename: { type: String, default: null },
    prenameUnknown: { type: Boolean, default: false },
    nickname: { type: String, default: null },
    nicknameUnsure: { type: Boolean, default: false },
    meetingDay: { type: String, required: true },
    comment: { type: String, default: null },
    country: { type: String, default: null },
  },
  {
    toJSON: { virtuals: true, versionKey: false, transform: (_, r) => { delete r._id; return r } },
    toObject: { virtuals: true },
  }
)

const Person = mongoose.models.Person ?? mongoose.model('Person', PersonSchema)

const db = new Database('people.db', { readonly: true })
const rows = db.query('SELECT * FROM people').all() as any[]
db.close()

console.log(`Found ${rows.length} records in SQLite`)

await mongoose.connect(MONGODB_URI)
console.log('Connected to MongoDB')

const existing = await Person.countDocuments()
if (existing > 0) {
  console.log(`MongoDB already has ${existing} documents. Skipping migration to avoid duplicates.`)
  console.log('Drop the collection first if you want to re-migrate.')
  await mongoose.disconnect()
  process.exit(1)
}

const docs = rows.map(row => ({
  prename: row.prename ?? null,
  prenameUnknown: !!row.prenameUnknown,
  nickname: row.nickname ?? null,
  nicknameUnsure: !!row.nicknameUnsure,
  meetingDay: row.meetingDay,
  comment: row.comment ?? null,
  country: row.country ?? null,
}))

const result = await Person.insertMany(docs)
console.log(`Migrated ${result.length} records to MongoDB`)

await mongoose.disconnect()
