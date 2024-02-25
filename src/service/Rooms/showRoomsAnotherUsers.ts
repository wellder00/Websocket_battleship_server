import { createJsonMessage } from "../../utils/utils";
import { users } from "../../db/player";
import { rooms } from "../../db/rooms";


export function showRoomsAnotherUsers() {
  users.forEach((player) => {
    player.ws.send(createJsonMessage("update_room", rooms));
  });
}