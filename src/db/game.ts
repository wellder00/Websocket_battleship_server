import { Games } from "../utils/type/interface";

export let games: Games[] = [];

export const removeGame = (roomId: string) => {
  games = games.filter(room => room.roomId !== roomId);
};