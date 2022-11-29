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

  public async find(filter: UserFilter): Promise<User[]> {
    let userPgSqlRepository = await this.getUserRepository();
    let query: SelectQueryBuilder<UserPgSql> = userPgSqlRepository.createQueryBuilder("u");

    this.addFilterByEmails(filter.emails, query);

    let userPgSqlItems = await query.getMany();

    return userPgSqlItems.map(userPgSqlItem => userPgSqlMapper.toDto(userPgSqlItem));
  }

  private addFilterByEmails(emails: string[], query: SelectQueryBuilder<UserPgSql>): void {
    if (!emails || !emails.length) return;
    query.where("u.email IN (:...emails)", {emails: emails});
  }

}
