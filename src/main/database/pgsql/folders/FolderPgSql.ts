import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "folders"})
export default class FolderPgSql extends BaseEntity {

  @PrimaryGeneratedColumn({type: "bigint", name: "id"})
  public id?: number;

  @Column({type: "varchar", name: "name"})
  public name?: string;

  @Column({type: "bigint", name: "parent_id", nullable: true})
  public parentId?: number | null;

  @Column({type: "varchar", name: "user_id"})
  public userId?: number;

  constructor(id?: number, name?: string, parentId?: number | null, userId?: number) {
    super();
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.userId = userId;
  }
}
