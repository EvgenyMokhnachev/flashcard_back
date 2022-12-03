import UserRepository from "../../../domain/user/UserRepository";
import User from "../../../domain/user/User";
import UserPgSql from "./UserPgSql";
import {Repository, SelectQueryBuilder} from "typeorm";
import dataSource from "../PgSqlDataSource";
import UserFilter from "../../../domain/user/UserFilter";
import userPgSqlMapper from "./UserPgSqlMapper";

export default class implements UserRepository {

  private userPgSqlRepository: Repository<UserPgSql>;

  private async getUserRepository(): Promise<Repository<UserPgSql>> {
    return this.userPgSqlRepository =
      this.userPgSqlRepository
      || (await dataSource).getRepository(UserPgSql);
  }

  public async save(user: User): Promise<User> {
    return userPgSqlMapper.toDto(
      await (await this.getUserRepository())
        .save(userPgSqlMapper.toDb(user))
    );
  }

  async findFirst(filter: UserFilter): Promise<User | undefined> {
    let result = undefined;
    let users = await this.find(filter);
    if (users && users.length) {
      result = users[0];
    }
    return result;
  }

  public async find(filter: UserFilter): Promise<User[]> {
    let userPgSqlRepository = await this.getUserRepository();
    let query: SelectQueryBuilder<UserPgSql> = userPgSqlRepository.createQueryBuilder("u");

    this.addFilterByEmails(filter.emails, query);
    this.addFilterByIds(filter.ids, query);

    let userPgSqlItems = await query.getMany();

    return userPgSqlItems.map(userPgSqlItem => userPgSqlMapper.toDto(userPgSqlItem));
  }

  private addFilterByEmails(emails: string[] | undefined, query: SelectQueryBuilder<UserPgSql>): void {
    if (!emails || !emails.length) return;
    query.andWhere("u.email IN (:...emails)", {emails: emails});
  }

  private addFilterByIds(ids: number[] | undefined, query: SelectQueryBuilder<UserPgSql>): void {
    if (!ids || !ids.length) return;
    query.andWhere("u.id IN (:...ids)", {ids: ids});
  }

}
