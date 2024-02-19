import { Room } from "../utils/type/interface";

export let rooms: Room[] = [];

export const removeRoom = (roomId: string) => {
  rooms = rooms.filter(room => room.roomId !== roomId);
};