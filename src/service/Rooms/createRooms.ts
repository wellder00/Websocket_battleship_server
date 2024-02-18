import { randomUUID } from "crypto";
import { Player, Room } from "../../utils/type/interface";
import { rooms } from "../../db/rooms";
import { createJsonMessage } from "src/utils/utils";
import { users } from "../../db/player";

export function createRoom(creator: Player): Room {
  const roomId = randomUUID();
  const newRoom: Room = {
    roomId: roomId,
    roomUsers: [],
    gameState: 0,
    players: [creator],
  };
  rooms.push(newRoom);
  showRoomsAnotherUsers();
  return newRoom;
}

export function showRoomsAnotherUsers() {
  users.forEach((player) => {
    player.ws.send(createJsonMessage("update_room", rooms));
  });
}
