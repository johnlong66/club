import { connect, Person } from '../../utils/db'

export default defineEventHandler(async (event) => {
  await connect()
  const id = getRouterParam(event, 'id')
  await Person.findByIdAndDelete(id)
  setResponseStatus(event, 204)
  return null
})
