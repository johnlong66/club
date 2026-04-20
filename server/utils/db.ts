import mongoose from 'mongoose'

let connected = false

export async function connect() {
  if (connected) return
  const uri = useRuntimeConfig().mongodbUri as string
  console.log('Connecting to MongoDB with URI:', uri, useRuntimeConfig);
  await mongoose.connect(uri)
  connected = true
}

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

export const Person = mongoose.models.Person ?? mongoose.model('Person', PersonSchema)
