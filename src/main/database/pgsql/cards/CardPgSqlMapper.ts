import Card from "../../../domain/cards/Card";
import CardPgSql from "./CardPgSql";

class CardPgSqlMapper {

  public toDb(card: Card): CardPgSql {
    return new CardPgSql(
      card.id,
      card.folderId,
      card.userId,
      card.frontSide,
      card.backSide,
      card.difficult,
      card.difficultChangeTime,
      card.createdAt,
      card.bookmarked
    )
  }

  public toDto(card: CardPgSql): Card {
    return new Card(
      card.id,
      card.folderId,
      card.userId,
      card.frontSide,
      card.backSide,
      card.difficult,
      card.difficultChangeTime,
      card.createdAt,
      card.bookmarked
    );
  }

}

export default new CardPgSqlMapper();
