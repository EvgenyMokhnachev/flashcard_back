import {Repository, SelectQueryBuilder} from "typeorm";
import dataSource from "../PgSqlDataSource";
import CardPgSql from "./CardPgSql";
import CardPgSqlMapper from "./CardPgSqlMapper";
import Card from "../../../domain/cards/Card";
import CardFilter from "../../../domain/cards/CardFilter";
import CardRepository from "../../../domain/cards/CardRepository";
import CardDifficultType from "../../../domain/cards/CardDifficultType";

export default class CardRepositoryPgSql implements CardRepository {

  private CardPgSqlRepository: Repository<CardPgSql>;

  private async getCardRepository(): Promise<Repository<CardPgSql>> {
    return this.CardPgSqlRepository =
      this.CardPgSqlRepository
      || (await dataSource).getRepository(CardPgSql);
  }

  async delete(id: number): Promise<boolean> {
    try {
      let deleteResult = await (await this.getCardRepository()).delete({id});
      return true;
    } catch (e) {
      console.error(e);
      return false
    }
  }

  public async save(card: Card): Promise<Card> {
    if (!card.createdAt) {
      card.createdAt = new Date();
    }

    return CardPgSqlMapper.toDto(
      await (await this.getCardRepository())
        .save(CardPgSqlMapper.toDb(card))
    );
  }

  public async findById(id: number): Promise<Card|null> {
    let result = null;
    let cards = await this.find(CardFilter.create().byId(id));
    if (cards && cards.length) {
      result = cards[0];
    }
    return result;
  }

  public async find(filter: CardFilter): Promise<Card[]> {
    let CardPgSqlRepository = await this.getCardRepository();
    let query: SelectQueryBuilder<CardPgSql> = CardPgSqlRepository.createQueryBuilder("c");

    this.addFilterByUserIds(filter.userIds, query);
    this.addFilterByFolderIds(filter.folderIds, query);
    this.addFilterByIds(filter.ids, query);
    this.addFilterByDifficultTypes(filter.difficultTypes, query);
    this.addFilterByBookmarked(filter.bookmarked, query);
    this.addFilterByCreatedFrom(filter.createdAtFrom, query);
    this.addFilterByCreatedTo(filter.createdAtTo, query);

    query.addOrderBy('id', 'DESC');

    let CardPgSqlItems = await query.getMany();

    return CardPgSqlItems.map(CardPgSqlItem => CardPgSqlMapper.toDto(CardPgSqlItem));
  }

  private addFilterByCreatedFrom(createdFrom: Date | undefined, query: SelectQueryBuilder<CardPgSql>): void {
    if (createdFrom === undefined) return;
    query.andWhere(`c.createdAt >= ${createdFrom}`);
  }

  private addFilterByCreatedTo(createdTo: Date | undefined, query: SelectQueryBuilder<CardPgSql>): void {
    if (createdTo === undefined) return;
    query.andWhere(`c.createdAt <= ${createdTo}`);
  }

  private addFilterByBookmarked(bookmarked: boolean | undefined, query: SelectQueryBuilder<CardPgSql>): void {
    if (bookmarked === undefined) return;
    query.andWhere(`c.bookmarked = ${bookmarked}`);
  }

  private addFilterByDifficultTypes(difficultTypes: CardDifficultType[] | undefined, query: SelectQueryBuilder<CardPgSql>): void {
    if (!difficultTypes || !difficultTypes.length) return;
    query.andWhere("c.difficult IN (:...difficultTypes)", {difficultTypes});
  }

  private addFilterByUserIds(userIds: number[] | undefined, query: SelectQueryBuilder<CardPgSql>): void {
    if (!userIds || !userIds.length) return;
    query.andWhere("c.userId IN (:...userIds)", {userIds});
  }

  private addFilterByFolderIds(folderIds: number[] | undefined, query: SelectQueryBuilder<CardPgSql>): void {
    if (!folderIds || !folderIds.length) return;
    query.andWhere("c.folderId IN (:...folderIds)", {folderIds});
  }

  private addFilterByIds(ids: number[] | undefined, query: SelectQueryBuilder<CardPgSql>): void {
    if (!ids || !ids.length) return;
    query.andWhere("c.id IN (:...ids)", {ids});
  }

}
