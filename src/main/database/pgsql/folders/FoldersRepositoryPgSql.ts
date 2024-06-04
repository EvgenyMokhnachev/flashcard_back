import {Repository, SelectQueryBuilder} from "typeorm";
import dataSource from "../PgSqlDataSource";
import FolderRepository from "../../../domain/folders/FolderRepository";
import FolderPgSql from "./FolderPgSql";
import Folder from "../../../domain/folders/Folder";
import folderPgSqlMapper from "./FolderPgSqlMapper";
import FoldersFilter from "../../../domain/folders/FoldersFilter";

export default class implements FolderRepository {

  private repository: Repository<FolderPgSql>;

  private async getRepository(): Promise<Repository<FolderPgSql>> {
    return this.repository =
      this.repository
      || (await dataSource).getRepository(FolderPgSql);
  }

  public async save(card: Folder): Promise<Folder> {
    return folderPgSqlMapper.toDto(
      await (await this.getRepository())
        .save(folderPgSqlMapper.toDb(card))
    );
  }

  async delete(id: number): Promise<boolean> {
    try {
      let deleteResult = await (await this.getRepository()).delete({id});
      return true;
    } catch (e) {
      console.error(e);
      return false
    }
  }

  async findById(id: number): Promise<Folder | null> {
    let folders = await this.find(FoldersFilter.create().byId(id));
    if (!folders || !folders.length) return null;
    return folders[0];
  }

  public async find(filter: FoldersFilter): Promise<Folder[]> {
    let repository = await this.getRepository();
    let query: SelectQueryBuilder<FolderPgSql> = repository.createQueryBuilder("f");

    this.addFilterByUserIds(filter.userIds, query);
    this.addFilterByParentIds(filter.parentIds, query);
    this.addFilterByIds(filter.ids, query);
    this.addFilterOnlyRoot(filter.onlyRoot, query);

    let CardPgSqlItems = await query.getMany();

    return CardPgSqlItems.map(CardPgSqlItem => folderPgSqlMapper.toDto(CardPgSqlItem));
  }

  private addFilterByUserIds(userIds: number[] | undefined, query: SelectQueryBuilder<FolderPgSql>): void {
    if (!userIds || !userIds.length) return;
    query.andWhere("f.userId IN (:...userIds)", {userIds});
  }

  private addFilterByParentIds(parentIds: number[] | undefined, query: SelectQueryBuilder<FolderPgSql>): void {
    if (!parentIds || !parentIds.length) return;
    query.andWhere("f.parentId IN (:...parentIds)", {parentIds});
  }

  private addFilterByIds(ids: number[] | undefined, query: SelectQueryBuilder<FolderPgSql>): void {
    if (!ids || !ids.length) return;
    query.andWhere("f.id IN (:...ids)", {ids});
  }

  private addFilterOnlyRoot(onlyRoot: boolean | undefined, query: SelectQueryBuilder<FolderPgSql>): void {
    if (!onlyRoot) return;
    query.andWhere("f.parentId IS NULL");
  }

}
