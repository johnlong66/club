import db from '../../utils/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { prename, prenameUnknown, nickname, nicknameUnsure, meetingDay, comment } = await readBody(event)
  const { changes } = db.prepare('UPDATE people SET prename=?, prenameUnknown=?, nickname=?, nicknameUnsure=?, meetingDay=?, comment=? WHERE id=?')
    .run(prename ?? null, prenameUnknown ? 1 : 0, nickname ?? null, nicknameUnsure ? 1 : 0, meetingDay, comment ?? null, id) as { changes: number }
  if (changes === 0) throw createError({ statusCode: 404, message: 'Not found' })
  return { id, prename: prename ?? null, prenameUnknown: !!prenameUnknown, nickname: nickname ?? null, nicknameUnsure: !!nicknameUnsure, meetingDay, comment: comment ?? null }
})
