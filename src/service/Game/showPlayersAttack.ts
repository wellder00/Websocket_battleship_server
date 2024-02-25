import { consoleColors } from "../../utils/constants/const";
import { games } from "../../db/game";
import { users } from "../../db/player";
import { createJsonMessage } from "../../utils/utils";

export const showPlayersAttack = (gameId: string, type: string, data: object) => {
  const game = games.find((g) => g.roomId === gameId);
  if (!game) {
    console.log(consoleColors.red, `Game not found for attack broadcasting: ${gameId}`);
    return;
  }

  game.roomUsers.forEach((roomUser) => {
    const player = users.get(roomUser.name);
    if (player && player.ws) {
      player.ws.send(createJsonMessage(type, data));
    }
  });
};
