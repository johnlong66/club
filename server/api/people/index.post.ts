import db from '../../utils/db'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const { prename, prenameUnknown, nickname, nicknameUnsure, meetingDay, comment, country } = await readBody(event)
  const id = randomUUID()
  db.prepare('INSERT INTO people (id, prename, prenameUnknown, nickname, nicknameUnsure, meetingDay, comment, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(id, prename ?? null, prenameUnknown ? 1 : 0, nickname ?? null, nicknameUnsure ? 1 : 0, meetingDay, comment ?? null, country ?? null)
  setResponseStatus(event, 201)
  return { id, prename: prename ?? null, prenameUnknown: !!prenameUnknown, nickname: nickname ?? null, nicknameUnsure: !!nicknameUnsure, meetingDay, comment: comment ?? null, country: country ?? null }
})
