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
      card.difficult
    )
  }

  public toDto(card: CardPgSql): Card {
    return new Card(
      card.id,
      card.folderId,
      card.userId,
      card.frontSide,
      card.backSide,
      card.difficult
    );
  }

}

export default new CardPgSqlMapper();
