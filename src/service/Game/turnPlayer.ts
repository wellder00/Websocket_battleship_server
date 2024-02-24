import { users } from "../../db/player";
import { addTurnIndex, games } from "../../db/game";
import { createJsonMessage } from "../../utils/utils";

export const turnPlayer = (currentPlayerIndex: number, gameId: string) => {
  const game = games.find((game) => game.roomId === gameId);
  if (game) {
    game.roomUsers.forEach((roomUser) => {
      const userPlayer = users.get(roomUser.name);
      if (userPlayer && userPlayer.ws) {
        const turnData = {
          currentPlayer: addTurnIndex(currentPlayerIndex, gameId),
        };
        userPlayer.ws.send(createJsonMessage("turn", turnData));
      }
    });
  }
};
