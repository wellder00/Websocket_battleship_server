import { WebSocketServer } from "ws";
import { users } from "../db/player";
import { createJsonMessage, parseJsonSafely } from "../utils/utils";
import { createPlayer } from "../service/Player/createPlayer";
import { createRoom } from "../service/Rooms/createRooms";
import { rooms } from "../db/rooms";
import { Player } from "../utils/type/interface";
import { addUserToRoom } from "../service/Rooms/addUserToRoom";

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
          // ws.send(createJsonMessage("update_winners", rooms));
          ws.send(createJsonMessage("update_room", rooms));
          break;
        case "create_room":
          const creator = Array.from(users.values()).find((player) => player.ws === ws);
          if (creator) {
            createRoom(creator);
          }
          break;
        case "add_user_to_room":
          console.log(msg);
          let userName = currentUser.name;
          const indexRoom = userParseData.indexRoom;

          addUserToRoom(indexRoom, userName);

          break;
        case "add_ships":
          console.log(msg);
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
