import { randomUUID } from "crypto";
import { Player, Room } from "../../utils/type/interface";
import { rooms } from "../../db/rooms";
import { showRoomsAnotherUsers } from "./showRoomsAnotherUsers";

export function createRoom(): Room {
  const roomId = randomUUID();
  const newRoom: Room = {
    roomId: roomId,
    roomUsers: [],
    gameState: false,
  };
  rooms.push(newRoom);
  showRoomsAnotherUsers();
  return newRoom;
}
