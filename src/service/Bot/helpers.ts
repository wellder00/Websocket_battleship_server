import { games } from "../../db/game";
import { randomBytes } from "crypto";

export const isBotInGame = (gameId: string, botName: string) => {
  const game = games.find((g) => g.roomId === gameId);
  return game && game.roomUsers.some((user) => user.name === botName);
};

export const generateRandomName = () => {
  const randomName = randomBytes(3).toString("hex");
  return `Player_${randomName}`;
};

export const generateRandomShips = () => {
  const fieldSize = 10;
  const shipTypes = [
    { type: "huge", length: 4, count: 1 },
    { type: "large", length: 3, count: 2 },
    { type: "medium", length: 2, count: 3 },
    { type: "small", length: 1, count: 4 },
  ];

  const field = Array.from({ length: fieldSize }, () => Array(fieldSize).fill(false));
  const ships = [];

  for (const shipType of shipTypes) {
    for (let i = 0; i < shipType.count; i++) {
      let placed = false;
      while (!placed) {
        const direction = Math.random() < 0.5;
        const x = Math.floor(Math.random() * fieldSize);
        const y = Math.floor(Math.random() * fieldSize);

        if (canPlaceShip(x, y, shipType.length, direction, field)) {
          placeShip(x, y, shipType.length, direction, field);
          ships.push({
            position: { x, y },
            direction,
            type: shipType.type,
            length: shipType.length,
          });
          placed = true;
        }
      }
    }
  }

  return ships;
};

const canPlaceShip = (
  x: number,
  y: number,
  length: number,
  direction: boolean,
  field: boolean[][],
) => {
  for (let i = 0; i < length; i++) {
    const dx = x + (direction ? 0 : i);
    const dy = y + (direction ? i : 0);

    if (dx < 0 || dy < 0 || dx >= field.length || dy >= field.length) {
      return false;
    }

    if (field[dy][dx]) {
      return false;
    }

    for (let offsetX = -1; offsetX <= 1; offsetX++) {
      for (let offsetY = -1; offsetY <= 1; offsetY++) {
        const checkX = dx + offsetX;
        const checkY = dy + offsetY;
        if (checkX >= 0 && checkX < field.length && checkY >= 0 && checkY < field.length) {
          if (field[checkY][checkX]) {
            return false;
          }
        }
      }
    }
  }

  return true;
};

const placeShip = (
  x: number,
  y: number,
  length: number,
  direction: boolean,
  field: boolean[][],
) => {
  for (let i = 0; i < length; i++) {
    const dx = x + (direction ? 0 : i);
    const dy = y + (direction ? i : 0);
    field[dy][dx] = true;
  }
};
