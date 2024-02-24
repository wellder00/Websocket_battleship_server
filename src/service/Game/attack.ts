import { consoleColors } from "../../utils/constants/const";
import { games } from "../../db/game";
import { Attack, Field, Player } from "../../utils/type/interface";
import { turnPlayer } from "./turnPlayer";
import { showPlayersAttack } from "./showPlayersAttack";
import { announceWinner } from "./announceWinner";

export const attack = (user: Player, dataAttack: Attack) => {
  const { x, y, gameId, indexPlayer } = dataAttack;

  const game = games.find((game) => game.roomId === gameId);
  if (!game) {
    console.log(consoleColors.red, `Game not found: ${gameId}`);
    return;
  }

  const currentPlayer = game.roomUsers.find((roomUser) => roomUser.index === +indexPlayer);
  if (!currentPlayer) {
    console.log(consoleColors.red, `Current player not found: ${indexPlayer}`);
    return;
  }

  const opponentPlayer = game.roomUsers.find((roomUser) => roomUser.index !== +indexPlayer);
  if (!opponentPlayer) {
    console.log(consoleColors.red, `Opponent player not found`);
    return;
  }

  const opponentField =
    +indexPlayer === game.roomUsers[0].index
      ? opponentPlayer.usersFields?.secondUserField
      : opponentPlayer.usersFields?.firstUserField;

  if (!opponentField) {
    console.log(consoleColors.red, `Field of opponent player is not found`);
    return;
  }

  const cell = opponentField[y][x];

  cell.isAttacked = true;
  const isHit = !cell.empty;

  if (isHit) {
    cell.leftSide--;
    if (cell.leftSide === 0) {
      // Уничтожение корабля
      --opponentPlayer.shipsLeft; // Правильное уменьшение количества кораблей
      processDestroyedShip(cell, gameId, currentPlayer.index);

      if (opponentPlayer.shipsLeft === 0) {
        // Объявление победителя, если это был последний корабль
        announceWinner(gameId, currentPlayer.index);
        return;
      }

      const nextPlayerIndex = game.roomUsers.find((ru) => ru.index !== +indexPlayer)?.index;
      if (nextPlayerIndex !== undefined) {
        turnPlayer(nextPlayerIndex, gameId);
      }
    } else {
      // Попадание, но корабль ещё не уничтожен
      showPlayersAttack(gameId, "attack", {
        position: { y, x },
        currentPlayer: currentPlayer.index,
        status: "shot",
      });
    }
  } else {
    // Обработка промаха
    showPlayersAttack(gameId, "attack", {
      position: { y, x },
      currentPlayer: currentPlayer.index,
      status: "missed",
    });
    const nextPlayerIndex = game.roomUsers.find((ru) => ru.index === +indexPlayer)?.index;
    if (nextPlayerIndex !== undefined) {
      turnPlayer(nextPlayerIndex, gameId);
    }
  }
};

function processDestroyedShip(cell: Field, gameId: string, currentPlayerIndex: number) {
  cell.shipTheCells.forEach((shipCell) => {
    showPlayersAttack(gameId, "attack", {
      position: { x: shipCell[0], y: shipCell[1] },
      currentPlayer: currentPlayerIndex,
      status: "killed",
    });
  });

  cell.overCells.forEach((aroundCell) => {
    const [x, y] = aroundCell;
    showPlayersAttack(gameId, "attack", {
      position: { x, y },
      currentPlayer: currentPlayerIndex,
      status: "missed",
    });
  });
}
