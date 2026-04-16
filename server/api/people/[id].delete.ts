import db from '../../utils/db'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  db.prepare('DELETE FROM people WHERE id=?').run(id)
  setResponseStatus(event, 204)
  return null
})
