export interface Player {
  type: "reg";
  data: dataPlayer;
  id: 0;
  ws: WebSocket;
}

export interface dataPlayer {
  name?: string;
  index?: number;
  error?: boolean;
  errorText?: string;
  password?: string;
}

export interface Room {
  roomId: string;
  roomUsers: Player[];
  gameState: 0 | 1;
  players: Player[];
}

export interface roomData {
  rooms: {
    roomId: string;
    roomUsers: {
      name: string;
      index: number;
    }[];
  }[];
}
