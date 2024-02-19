export interface Player {
  name?: string;
  index?: number;
  error?: boolean;
  errorText?: string;
  password?: string;
  id?: 0;
  ws?: WebSocket;
  winner?: number;
  ready?: boolean;
  ships?: IShip[];
}

export interface IShip {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
}

export interface Room {
  roomId: string;
  roomUsers: RoomUsers[];
  gameState: boolean;
}

export interface RoomUsers {
  name: string;
  index: number;
}

type GameWithoutGameState = Omit<Room, "gameState">;

export interface Games extends GameWithoutGameState {
  userReady?: number;
}
