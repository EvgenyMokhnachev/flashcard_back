export default class CardNotFoundError extends Error {
  private static message: string = "Card not found";
  private static code: number = 203;

  constructor(id?: number) {
    super(CardNotFoundError.message + (id ? ' ID: ' + id : ''));
  }
}
