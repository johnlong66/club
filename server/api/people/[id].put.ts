import { connect, Person } from '../../utils/db'

export default defineEventHandler(async (event) => {
  await connect()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const doc = await Person.findByIdAndUpdate(id, body, { new: true })
  if (!doc) throw createError({ statusCode: 404, message: 'Not found' })
  return doc.toJSON()
})
