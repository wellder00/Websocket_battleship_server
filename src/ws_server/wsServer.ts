import { WebSocketServer } from "ws";
import { games } from "../db/game";
import { users } from "../db/player";
import { rooms } from "../db/rooms";
import { addShips } from "../service/Game/addShips";
import { attack } from "../service/Game/attack";
import { findGame } from "../service/Game/findGame";
import { createPlayer } from "../service/Player/createPlayer";
import { addUserToRoom } from "../service/Rooms/addUserToRoom";
import { createRoom } from "../service/Rooms/createRooms";
import { consoleColors, descriptionMessages, errorMessages } from "../utils/constants/const";
import { Player } from "../utils/type/interface";
import { createJsonMessage, parseJsonSafely } from "../utils/utils";
import { randomAttack } from "../service/Game/randomAttack";
import { showWinners } from "../service/Game/showWinners";
import { announceWinner } from "../service/Game/announceWinner";

const webSocketServer = new WebSocketServer({
  port: 3000,
  perMessageDeflate: false,
});

webSocketServer.on("connection", (ws: WebSocket) => {
  let currentUser: Player | undefined;

  ws.onmessage = (event: MessageEvent) => {
    try {
      const msg = JSON.parse(event.data);
      const { type, data } = msg;
      const userParseData = parseJsonSafely(data);

      switch (type) {
        case "reg":
          currentUser = createPlayer(userParseData.name, userParseData.password, ws);

          ws.send(createJsonMessage("reg", currentUser));
          ws.send(createJsonMessage("update_winners", showWinners()));
          ws.send(createJsonMessage("update_room", rooms));
          break;
        case "create_room":
          createRoom(currentUser);
          break;
        case "add_user_to_room":
          const { indexRoom } = userParseData;
          addUserToRoom(indexRoom, currentUser?.name);
          break;
        case "add_ships":
          const { ships } = userParseData;
          addShips(currentUser?.name, ships);
          break;
        case "attack":
          const { gameId, indexPlayer } = userParseData;
          findGame(gameId, indexPlayer)
            ? attack(currentUser, userParseData)
            : console.log(consoleColors.red, descriptionMessages.notTern);
          break;
        case "randomAttack":
          randomAttack(currentUser, userParseData.gameId);
          console.log(msg);
          break;
        case "single_play":
          console.log(msg);
          break;
      }
    } catch (error) {
      console.error(consoleColors.red, errorMessages.errorRouter, error);
    }
  };

  ws.onclose = () => {
    rooms.forEach((room) => {
      if (room.roomUsers.some((user) => user.name === currentUser.name)) {
        room.roomUsers = room.roomUsers.filter((user) => user.name !== currentUser.name);
        console.log(consoleColors.blue, "User removed from room.");
      }
    });

    games.forEach((game) => {
      if (game.roomUsers.some((user) => user.name === currentUser.name)) {
        game.roomUsers = game.roomUsers.filter((user) => user.name !== currentUser.name);
        console.log(consoleColors.red, "User removed from game.");

        if (game.roomUsers.length === 1) {
          const remainingPlayerIndex = game.roomUsers[0].index;
          announceWinner(game.roomId, remainingPlayerIndex);
        }
      }
    });
    console.log(consoleColors.blue, "Good bye!");
  };
});

webSocketServer.on("listening", () => {
  console.log(consoleColors.magenta, descriptionMessages.startWebsocketServer);
});
