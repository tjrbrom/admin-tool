export type PlayerQuery = {
  userId: string | null;
  name: string | null;
  gender: string | null;
  country: string | null;
  premium: boolean | null;
  banned: boolean | null;
  createdAt: number | null;
  limit: number | null;
}
