import CardDifficultType from "../CardDifficultType";

export default class CardDifficultTypeNotFoundError extends Error {
  private static message: string = "Card Difficult type not found";
  private static code: number = 205;

  constructor(type?: CardDifficultType) {
    super(CardDifficultTypeNotFoundError.message + (type ? ' TYPE: ' + type : ''));
  }
}
