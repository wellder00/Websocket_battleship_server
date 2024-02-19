import { users } from "../../db/player";
import { createJsonMessage } from "../../utils/utils";
import { IShip } from "../../utils/type/interface";
import { games } from "../../db/game";

export const addShips = (userName: string, ships: IShip[]) => {
  const player = users.get(userName);
  if (!player) {
    console.log("Player not found");
    return;
  }

  player.ships = ships;
  player.ready = true;

  const game = games.find((game) => game.roomUsers.some((user) => user.name === userName));

  if (!game) {
    console.log("Game not found for the player");
    return;
  }

  const allPlayersReady = game.roomUsers.every((user) => {
    const userPlayer = users.get(user.name);
    return userPlayer ? userPlayer.ready : false;
  });

  if (allPlayersReady) {
    game.userReady = game.roomUsers.length;
    console.log("All players are ready. Game can start.");

    game.roomUsers.forEach((roomUser) => {
      const userPlayer = users.get(roomUser.name);
      if (userPlayer && userPlayer.ws) {
        const startGameData = { ships: userPlayer.ships, currentPlayerIndex: userPlayer.index };
        userPlayer.ws.send(createJsonMessage("start_game", startGameData));
      }
    });
  }
};
