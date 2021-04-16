export type OrderSide = "buy" | "sell";

export interface Input {
  id: string;
  profit: number;
  trade: number;
  amount: number;
  profitError?: string;
  tradeError?: string;
}
