export interface Player {
  type: "reg";
  data: dataPlayer;
  id: 0;
}

export interface dataPlayer {
  name?: string;
  index?: number;
  error?: boolean;
  errorText?: string;
}
