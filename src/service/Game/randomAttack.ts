import { games } from "../../db/game";
import { Player } from "../../utils/type/interface";
import { consoleColors } from "../../utils/constants/const";
import { attack } from "../../service/Game/attack";

export const randomAttack = (player: Player, gameId: string) => {
  const indexPlayer = player.index;
  const game = games.find((game) => game.roomId === gameId);

  if (!game) {
    console.log(consoleColors.red, `Game not found: ${gameId}`);
    return;
  }

  const currentPlayer = game.roomUsers.find((roomUser) => roomUser.index === indexPlayer);
  if (!currentPlayer) {
    console.log(consoleColors.red, `Current player not found: ${indexPlayer}`);
    return;
  }

  const opponentPlayer = game.roomUsers.find((roomUser) => roomUser.index !== indexPlayer);
  if (!opponentPlayer) {
    console.log(consoleColors.red, `Opponent player not found`);
    return;
  }

  const opponentField =
    indexPlayer === game.roomUsers[0].index
      ? opponentPlayer.usersFields?.secondUserField
      : opponentPlayer.usersFields?.firstUserField;

  if (!opponentField) {
    console.log(consoleColors.red, `Field of opponent player is not found`);
    return;
  }

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = opponentField[y][x];
      if (!cell.empty && cell.leftSide > 0 && !cell.isAttacked) {
        attack(player, { gameId: gameId, x: x, y: y, indexPlayer: "" + player.index });
        return;
      }

      if (cell.empty && !cell.isAttacked) {
        attack(player, { gameId: gameId, x: x, y: y, indexPlayer: "" + player.index });
        return;
      }
    }
  }
};
