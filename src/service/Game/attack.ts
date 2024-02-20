import { users } from "../../db/player";
import { Attack, Player } from "../../utils/type/interface";
import { turnPlayer } from "./turnPlayer";

export const attack = (user: Player, dataAttack: Attack) => {
  const { x, y, gameId, indexPlayer } = dataAttack;
  console.log(indexPlayer)
  const userName = user.name;
  const player = users.get(userName);

  turnPlayer(player, +indexPlayer, gameId);
};
