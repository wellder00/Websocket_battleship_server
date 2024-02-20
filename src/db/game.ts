import { Games } from "../utils/type/interface";

export let games: Games[] = [];

export const removeGame = (roomId: string) => {
  games = games.filter((room) => room.roomId !== roomId);
};

export const addTurnIndex = (indexPlayer: number, gameId: string) => {
  const game = games.find((game) => game.roomId === gameId);
  if (game) {
    const currentPlayerIndex = game.roomUsers.findIndex((user) => user.index === indexPlayer);
    let nextPlayerIndex = currentPlayerIndex + 1;

    if (nextPlayerIndex >= game.roomUsers.length) {
      nextPlayerIndex = 0;
    }

    const nextPlayer = game.roomUsers[nextPlayerIndex];
    if (nextPlayer) {
      nextPlayer.turnIndex = nextPlayer.index;
      return nextPlayer.turnIndex;
    }
  }
};
