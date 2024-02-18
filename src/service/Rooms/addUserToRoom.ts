import { rooms } from "src/db/rooms";
import { Player } from "../../utils/type/interface";
import { users } from "../../db/player";
import { showRoomsAnotherUsers } from "./showRoomsAnotherUsers";

export const addUserToRoom = (roomId: string, playerName: string) => {
  const currentPlayer = users.get(playerName);
  const roomToAdd = rooms.find(room => room.roomId === roomId);

  if (!currentPlayer || !roomToAdd) {
    console.log("Player or room not found. Add user to room now.");
    return;
  }

  if (roomToAdd.roomUsers.some(user => user.name === currentPlayer.data.name)) {
    console.log("Player in the room now.");
    return;
  }

  rooms.forEach(room => {
    if (room.roomUsers.some(user => user.name === currentPlayer.data.name)) {
      room.roomUsers = room.roomUsers.filter(user => user.name !== currentPlayer.data.name);
    }
  });

  const userData = {
    name: currentPlayer.data.name,
    index: currentPlayer.data.index,
  };
  roomToAdd.roomUsers.push(userData);
  showRoomsAnotherUsers();
};
