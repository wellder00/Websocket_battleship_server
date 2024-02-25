import { consoleColors } from "../../utils/constants/const";
import { games } from "../../db/game";
import { Attack, Field, Player } from "../../utils/type/interface";
import { turnPlayer } from "./turnPlayer";
import { showPlayersAttack } from "./showPlayersAttack";
// import { announceWinner } from "./announceWinner";

import { showWinners } from "./showWinners";
import { rooms } from "../../db/rooms";
import { createJsonMessage } from "../../utils/utils";
import { users } from "../../db/player";
import { removeGame } from "../../db/game";
import { randomAttack } from "./randomAttack";

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
      --opponentPlayer.shipsLeft;
      processDestroyedShip(cell, gameId, currentPlayer.index);

      if (opponentPlayer.shipsLeft === 0) {
        announceWinner(gameId, currentPlayer.index);
        return;
      }

      const nextPlayerIndex = game.roomUsers.find((ru) => ru.index !== +indexPlayer)?.index;
      if (nextPlayerIndex !== undefined) {
        turnPlayer(nextPlayerIndex, gameId);
      }
    } else {
      showPlayersAttack(gameId, "attack", {
        position: { y, x },
        currentPlayer: currentPlayer.index,
        status: "shot",
      });
      
      if (user.isBot) {
        randomAttack(user, gameId);
        console.log('123')
      }
      const nextPlayerIndex = game.roomUsers.find((ru) => ru.index !== +indexPlayer)?.index;
      if (nextPlayerIndex !== undefined) {
        turnPlayer(nextPlayerIndex, gameId);
      }
    }
  } else {
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

const processDestroyedShip = (cell: Field, gameId: string, currentPlayerIndex: number) => {
  cell.overCells.forEach((aroundCell) => {
    const [x, y] = aroundCell;
    showPlayersAttack(gameId, "attack", {
      position: { x, y },
      currentPlayer: currentPlayerIndex,
      status: "missed",
    });
  });

  cell.shipTheCells.forEach((shipCell) => {
    showPlayersAttack(gameId, "attack", {
      position: { x: shipCell[0], y: shipCell[1] },
      currentPlayer: currentPlayerIndex,
      status: "killed",
    });
  });
};

export const announceWinner = (gameId: string, winnerIndex: number) => {
  const game = games.find((g) => g.roomId === gameId);
  if (!game) {
    console.error(`Game not found: ${gameId}`);
    return;
  }

  game.roomUsers.forEach((roomUser) => {
    const player = users.get(roomUser.name);
    if (player) {
      if (player.index === winnerIndex) {
        player.winner = (player.winner || 0) + 1;
      }

      if (player.ws) {
        player.ws.send(createJsonMessage("finish", { winPlayer: winnerIndex }));
      }
    }
  });

  users.forEach((player) => {
    if (player.ws) {
      player.ws.send(createJsonMessage("update_winners", showWinners()));
    }
  });
  removeGame(gameId);

  games.forEach((game) => {
    if (game.roomUsers.some((user) => user.index === winnerIndex)) {
      console.log(winnerIndex);
      game.roomUsers = game.roomUsers.filter((user) => user.index !== winnerIndex);
    }
  });
  rooms.forEach((room) => {
    if (room.roomUsers.some((user) => user.index === winnerIndex)) {
      console.log(winnerIndex);
      room.roomUsers = room.roomUsers.filter((user) => user.index !== winnerIndex);
    }
  });
};
