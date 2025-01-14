export type Player = {
  id: string
  userId: string
  name: string
  photoUrl: string
  gender: string
  country: string
  premium: boolean
  banned: boolean
  lastLoginAt: number // timestamp in millis or epoch second
  createdAt: number // >> >>
}
