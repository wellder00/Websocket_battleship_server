import { rooms, removeRoom } from "src/db/rooms";
import { createGame } from "../Game/createGame";
import { users } from "../../db/player";
import { showRoomsAnotherUsers } from "./showRoomsAnotherUsers";

export const addUserToRoom = (roomId: string, playerName: string) => {
  const currentPlayer = users.get(playerName);
  const roomToAdd = rooms.find((room) => room.roomId === roomId);

  if (!currentPlayer || !roomToAdd) {
    console.log("Player or room not found. Add user to room now.");
    return;
  }

  if (roomToAdd.roomUsers.some((user) => user.name === currentPlayer.name)) {
    console.log("Player in the room now.");
    return;
  }

  rooms.forEach((room) => {
    if (room.roomUsers.some((user) => user.name === currentPlayer.name)) {
      room.roomUsers = room.roomUsers.filter((user) => user.name !== currentPlayer.name);
    }
  });

  const userData = {
    name: currentPlayer.name,
    index: currentPlayer.index,
  };
  roomToAdd.roomUsers.push(userData);

  if (roomToAdd.roomUsers.length === 2) {
    roomToAdd.gameState = true;
    console.log("Room is now full. Starting game.");
    roomToAdd.roomUsers.forEach((user) => {
      createGame(user.name, roomToAdd.roomId);
    });
    removeRoom(roomId);
  }

  showRoomsAnotherUsers();
};
