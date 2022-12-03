import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "cards"})
export default class CardPgSql extends BaseEntity {

  @PrimaryGeneratedColumn({type: "bigint", name: "id"})
  public id?: number;

  @Column({type: "bigint", name: "folder_id", nullable: true})
  public folderId?: number | null;

  @Column({type: "bigint", name: "user_id"})
  public userId?: number;

  @Column({type: "varchar", name: "front_side"})
  public frontSide?: string;

  @Column({type: "varchar", name: "back_side"})
  public backSide?: string;

  constructor(id?: number, folderId?: number | null, userId?: number, frontSide?: string, backSide?: string) {
    super();
    this.id = id;
    this.folderId = folderId;
    this.userId = userId;
    this.frontSide = frontSide;
    this.backSide = backSide;
  }
}
