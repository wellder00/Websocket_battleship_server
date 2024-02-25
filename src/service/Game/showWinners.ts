import { users } from "../../db/player";
import { Winners } from "../../utils/type/interface";

export const showWinners = () => {
  let winners: Winners[] = [];
  users.forEach((user) => {
    if (user.winner !== undefined && user.winner > 0) {
      winners.push({ name: user.name || "Unknown", wins: user.winner });
    }
  });
  return winners;
};
