import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "users"})
export default class UserPgSql extends BaseEntity {

  @PrimaryGeneratedColumn({type: "bigint", name: "id"})
  public id?: number;

  @Column({type: "varchar", name: "email"})
  public email?: string;

  @Column({type: "varchar", name: "pass"})
  public pass?: string;

  constructor(id?: number, email?: string, pass?: string) {
    super();
    this.id = id || undefined;
    this.email = email || undefined;
    this.pass = pass || undefined;
  }

}
