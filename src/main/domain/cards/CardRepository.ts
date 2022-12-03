import CardFilter from "./CardFilter";
import Card from "./Card";

export default interface CardRepository {
  save(card: Card): Promise<Card>
  find(filter: CardFilter): Promise<Card[]>;
  findFirst(filter: CardFilter): Promise<Card|undefined>;
  delete(id: number): Promise<boolean>;
}
