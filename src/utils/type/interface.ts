export interface Player {  
  name?: string;
  index?: number;
  error?: boolean;
  errorText?: string;
  password?: string;
  id?: 0;
  ws?: WebSocket;
  winner?: number;
}

export interface Room {
  roomId: string;
  roomUsers: RoomUsers[];
  gameState: boolean;
  players: Player[];
}

export interface RoomUsers {
  name: string;
  index: number;
}

export interface Game {
  roomId: string;  
  gameState: boolean;
  players: Player[];
  board: string[][];
}
