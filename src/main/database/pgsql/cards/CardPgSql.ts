import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import CardDifficultType from "../../../domain/cards/CardDifficultType";

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

  @Column({type: "integer", name: "difficult"})
  public difficult?: CardDifficultType;

  constructor(id?: number, folderId?: number | null, userId?: number, frontSide?: string, backSide?: string, difficult?: CardDifficultType) {
    super();
    this.id = id;
    this.folderId = folderId;
    this.userId = userId;
    this.frontSide = frontSide;
    this.backSide = backSide;
    this.difficult = difficult;
  }
}
