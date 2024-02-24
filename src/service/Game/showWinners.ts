import { users } from "../../db/player";
import { Winners } from "../../utils/type/interface";

export const showWinners = () => {
  let winners: Winners[] = Array.from(users.values())
    .filter((user) => user.winner && user.winner > 0)
    .map((user) => ({ name: user.name || "Unknown", wins: user.winner }));

  return winners;
};
