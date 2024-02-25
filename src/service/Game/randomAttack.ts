import { games } from "../../db/game";
import { Player } from "../../utils/type/interface";
import { consoleColors } from "../../utils/constants/const";
import { attack } from "../../service/Game/attack";


export const randomAttack = (player: Player, gameId: string) => {
  const game = games.find(game => game.roomId === gameId);
  if (!game) {
    console.log(consoleColors.red, `Game not found: ${gameId}`);
    return;
  }

  const opponentPlayer = game.roomUsers.find(user => user.index !== player.index);
  if (!opponentPlayer) {
    console.log(consoleColors.red, `Opponent player not found`);
    return;
  }

  const opponentField = player.index === game.roomUsers[0].index
    ? opponentPlayer.usersFields?.secondUserField
    : opponentPlayer.usersFields?.firstUserField;

  if (!opponentField) {
    console.log(consoleColors.red, `Field of opponent player is not found`);
    return;
  }

  const destroyedShipsAroundCells = [];
  opponentField.forEach(row => {
    row.forEach(cell => {
      if (!cell.empty && cell.leftSide === 0) {
        destroyedShipsAroundCells.push(...cell.overCells);
      }
    });
  });

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = opponentField[y][x];
      if (!cell.empty && cell.leftSide > 0 && cell.isAttacked) {
        attack(player, { gameId, x, y, indexPlayer: player.index });
        return;
      }
    }
  }

  let unattachedCells = [];
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = opponentField[y][x];
      if (!cell.isAttacked) {
        unattachedCells.push({ x, y });
      }
    }
  }

  unattachedCells = unattachedCells.filter(cell => 
    !destroyedShipsAroundCells.some(ac => ac[0] === cell.x && ac[1] === cell.y)
  );

  if (unattachedCells.length > 0) {
    const randomCell = unattachedCells[Math.floor(Math.random() * unattachedCells.length)];
    attack(player, { gameId, x: randomCell.x, y: randomCell.y, indexPlayer: player.index });
  }
};

