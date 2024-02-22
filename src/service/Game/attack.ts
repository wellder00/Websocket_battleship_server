import { games } from "../../db/game";
import { Attack, Player } from "../../utils/type/interface";
import { turnPlayer } from "./turnPlayer";

export const attack = (user: Player, dataAttack: Attack) => {
  const { x: y, y: x, gameId, indexPlayer } = dataAttack;

  const game = games.find((game) => game.roomId === gameId);
  if (!game) {
    console.log(`Game not found: ${gameId}`);
    return;
  }

  const currentPlayer = game.roomUsers.find((roomUser) => roomUser.index === +indexPlayer);
  if (!currentPlayer) {
    console.log(`Current player not found: ${indexPlayer}`);
    return;
  }

  const opponentPlayer = game.roomUsers.find((roomUser) => roomUser.index !== +indexPlayer);
  if (!opponentPlayer) {
    console.log(`Opponent player not found`);
    return;
  }

  const opponentField =
    +indexPlayer === game.roomUsers[0].index
      ? opponentPlayer.usersFields?.secondUserField
      : opponentPlayer.usersFields?.firstUserField;

  if (!opponentField) {
    console.log(`Field of opponent player is not found`);
    return;
  }

  const cell = opponentField[x][y];
  if (cell.isAttacked) {
    console.log(`Cell [${x}][${y}] was already attacked`);
    return;
  }
  cell.isAttacked = true;
  const isHit = !cell.empty;
  console.log(`Attack at [${x}][${y}]: ${isHit ? "Hit" : "Miss"}`);

  const nextPlayerIndex = game.roomUsers.find((ru) => ru.index === +indexPlayer)?.index;
  if (nextPlayerIndex !== undefined) {
    turnPlayer(nextPlayerIndex, gameId);
  }
};
