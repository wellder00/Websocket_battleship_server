import { Room } from "../utils/type/interface";
import { games } from "./game";

export let rooms: Room[] = [];

export const removeRoom = (roomId: string) => {
  rooms = rooms.filter((room) => {
    if (room.roomId === roomId) {
      games.push(room);
      room.roomId !== roomId;
    }
  });
};
