import { showWinners } from "./showWinners";
import { rooms } from "../../db/rooms";
import { createJsonMessage } from "../../utils/utils";
import { users } from "../../db/player";
import { games, removeGame } from "../../db/game";

export const announceWinner = (gameId: string, winnerIndex: number) => {
  const game = games.find((g) => g.roomId === gameId);
  if (!game) {
    console.error(`Game not found: ${gameId}`);
    return;
  }

  game.roomUsers.forEach((roomUser) => {
    const player = users.get(roomUser.name);
    if (player) {
      if (player.index === winnerIndex) {
        player.winner = (player.winner || 0) + 1;
      }

      if (player.ws) {
        player.ws.send(createJsonMessage("finish", { winPlayer: winnerIndex }));
      }
    }
  });

  users.forEach((player) => {
    if (player.ws) {
      player.ws.send(createJsonMessage("update_winners", showWinners()));
    }
  });
  games.forEach((game) => {
    game.roomId === gameId;
    rooms.push(game);
  });
  removeGame(gameId);
};
