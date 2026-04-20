import { connect, Person } from '../../utils/db'

export default defineEventHandler(async (event) => {
  await connect()
  const body = await readBody(event)
  const doc = await Person.create(body)
  setResponseStatus(event, 201)
  return doc.toJSON()
})
