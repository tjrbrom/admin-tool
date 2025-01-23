export type PlayerQuery = {
  userId: string | null;
  playerId: string | null;
  name: string | null;
  gender: string | null;
  country: string | null;
  premium: boolean | null;
  banned: boolean | null;
  createdAt: number | null;
  limit: number | null;
  isPreviousPage: boolean | null;
  isRowNumberChanged: boolean | null;
  // needed for typescript to loop through the keys and get them
  [key: string]: string | number | boolean | null;
}
