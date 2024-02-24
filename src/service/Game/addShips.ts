import { users } from "../../db/player";
import { createJsonMessage } from "../../utils/utils";
import { Ship } from "../../utils/type/interface";
import { games } from "../../db/game";
import { turnPlayer } from "./turnPlayer";
import { initializeBattlefield } from "./initializeBattlefield";
import { consoleColors } from "../../utils/constants/const";

export const addShips = (userName: string, ships: Ship[]) => {
  const player = users.get(userName);
  if (!player) {
    console.log(consoleColors.red, "Player not found");
    return;
  }

  player.ships = ships;
  player.ready = true;

  const game = games.find(
    (game) => game.roomUsers && game.roomUsers.some((user) => user.name === userName),
  );

  if (!game) {
    console.log(consoleColors.red, "Game not found for the player");
    return;
  }

  const allPlayersReady = game.roomUsers.every((user) => {
    const userPlayer = users.get(user.name);
    return userPlayer ? userPlayer.ready : false;
  });

  if (allPlayersReady) {
    game.userReady = game.roomUsers.length;
    console.log(consoleColors.green, "All players are ready. Game can start.");

    const firstPlayerIndex = game.roomUsers[0].index;
    game.roomUsers.forEach((roomUser, index) => {
      const userPlayer = users.get(roomUser.name);
      if (userPlayer && userPlayer.ws) {
        const playerField = initializeBattlefield(userPlayer.ships);

        if (!roomUser.usersFields) {
          roomUser.usersFields = {
            firstUserField: index === 0 ? playerField : [],
            secondUserField: index === 1 ? playerField : [],
          };
        } else {
          if (index === 0) {
            roomUser.usersFields.firstUserField = playerField;
          } else if (index === 1) {
            roomUser.usersFields.secondUserField = playerField;
          }
        }
        const startGameData = { ships: userPlayer.ships, currentPlayerIndex: userPlayer.index };
        userPlayer.ws.send(createJsonMessage("start_game", startGameData));
        turnPlayer(firstPlayerIndex, game.roomId);
      }
    });
  }
};
