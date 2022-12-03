export default class CardManageForbiddenError extends Error {
  private static message: string = "Card management forbidden";
  private static code: number = 204;

  constructor(actorId?: number) {
    super(CardManageForbiddenError.message + (actorId ? ' Actor User ID: ' + actorId : ''));
  }
}
