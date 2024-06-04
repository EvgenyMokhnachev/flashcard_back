import CardFilter from "./CardFilter";
import Card from "./Card";

export default interface CardRepository {
  save(card: Card): Promise<Card>
  find(filter: CardFilter): Promise<Card[]>;
  findById(id: number): Promise<Card|null>;
  delete(id: number): Promise<boolean>;
}
