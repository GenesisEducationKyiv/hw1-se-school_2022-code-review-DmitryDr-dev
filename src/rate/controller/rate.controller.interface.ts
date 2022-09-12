export interface IRateController {
  getExchangeRate: () => Promise<number>;
}
