class CardUserEmptyError extends Error {
  private static message: string = "Card user should be filled";
  private static code: number = 202;

  constructor() {
    super(CardUserEmptyError.message);
  }
}

export default CardUserEmptyError;
