class CardFolderEmptyError extends Error {
  private static message: string = "Card folder should be filled";
  private static code: number = 201;

  constructor() {
    super(CardFolderEmptyError.message);
  }
}

export default CardFolderEmptyError;
