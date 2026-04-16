import db from '../../utils/db'

export default defineEventHandler(() => {
  const rows = db.prepare('SELECT * FROM people ORDER BY meetingDay DESC, prename').all() as any[]
  return rows.map((r) => ({ ...r, prenameUnknown: r.prenameUnknown === 1, nicknameUnsure: r.nicknameUnsure === 1 }))
})
