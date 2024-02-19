import { WebSocketServer } from "ws";
import { users } from "../db/player";
import { createJsonMessage, parseJsonSafely } from "../utils/utils";
import { createPlayer } from "../service/Player/createPlayer";
import { createRoom } from "../service/Rooms/createRooms";
import { rooms } from "../db/rooms";
import { Player } from "../utils/type/interface";
import { addUserToRoom } from "../service/Rooms/addUserToRoom";
import { addShips } from "../service/Game/addShips";

const webSocketServer = new WebSocketServer({
  port: 3000,
  perMessageDeflate: false,
});

webSocketServer.on("connection", (ws: WebSocket) => {
  let currentUser: Player | undefined;
  let userName: string;
  ws.onmessage = (event: MessageEvent) => {
    try {
      const msg = JSON.parse(event.data);
      const { type, data } = msg;
      const userParseData = parseJsonSafely(data);

      switch (type) {
        case "reg":
          currentUser = createPlayer(userParseData.name, userParseData.password, ws);
          userName = currentUser?.name;
          ws.send(createJsonMessage("reg", currentUser));
          // ws.send(createJsonMessage("update_winners", rooms));
          ws.send(createJsonMessage("update_room", rooms));
          break;
        case "create_room":
          createRoom();
          break;
        case "add_user_to_room":
          const { indexRoom } = userParseData;
          addUserToRoom(indexRoom, userName);

          break;
        case "add_ships":
          const { ships } = userParseData;
          addShips(userName, ships);
          break;
        case "attack":
          console.log(msg);
          break;
        case "randomAttack":
          console.log(msg);
          break;
        case "single_play":
          console.log(msg);
          break;
      }
    } catch (error) {
      console.error("Oops, error:", error);
    }
  };

  ws.onclose = () => {
    console.log("Good buyer!");
  };
});

webSocketServer.on("listening", () => {
  console.log("WebSocket works on port 3000");
});
