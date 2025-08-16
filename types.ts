
export enum Screen {
  Game = 'GAME',
  Withdrawal = 'WITHDRAWAL',
}

export interface PlayerData {
  level: number;
  balance: number;
}

export enum PaymentMethod {
  None = 'NONE',
  DANA = 'DANA',
  OVO = 'OVO',
}
