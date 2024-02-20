import { users } from "../../db/player";
import { createJsonMessage } from "../../utils/utils";

export const createGame = (nameUser: string, idRoom: string) => {
  const player = users.get(nameUser);
  if (player && player.ws) {
    const userData = {
      idGame: idRoom,
      idPlayer: player.index,
    };    
    player.ws.send(createJsonMessage("create_game", userData));
  }
};
