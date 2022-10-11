export interface ICurrencyRateValue {
  [key: string]: number;
}

export type CurrencyApiResponseType = ICurrencyRateValue & {
  date: string;
};
