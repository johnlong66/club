import { connect, Person } from '../../utils/db'

export default defineEventHandler(async () => {
  await connect()
  return Person.find().sort({ meetingDay: -1, prename: 1 }).lean({ virtuals: true })
})
