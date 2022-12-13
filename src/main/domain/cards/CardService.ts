import CardManageDto from "./CardManageDto";
import Card from "./Card";
import {cardRepository, folderRepository, userRepository} from "../../database/DatabaseBeanConfig";
import CardFolderEmptyError from "./errors/CardFolderEmptyError";
import Folder from "../folders/Folder";
import {FolderNotFoundError} from "../folders/exceptions/FolderNotFoundError";
import {FolderManagementForbiddenError} from "../folders/exceptions/FolderManagementForbiddenError";
import CardUserEmptyError from "./errors/CardUserEmptyError";
import CardNotFoundError from "./errors/CardNotFoundError";
import CardFilter from "./CardFilter";
import CardManageForbiddenError from "./errors/CardManageForbiddenError";
import User from "../user/User";
import UserFilter from "../user/UserFilter";
import {UserNotFoundError} from "../user/errors/UserNotFoundError";
import CardDifficultType from "./CardDifficultType";
import CardDifficultTypeNotFoundError from "./errors/CardDifficultTypeNotFoundError";

class CardService {

  public async delete(id?: number, actorUserId?: number): Promise<boolean> {
    if (!id) {
      throw new CardNotFoundError();
    }

    let card: Card|undefined = await cardRepository.findFirst(CardFilter.create().byId(id));
    if (!card) {
      throw new CardNotFoundError(id);
    }

    if (actorUserId) {
      if (card.userId != actorUserId) {
        throw new CardManageForbiddenError(actorUserId);
      }
    }

    return await cardRepository.delete(id);
  }

  public async updateCard(data: CardManageDto, actorUserId?: number) {
    if (!data.id) {
      throw new CardNotFoundError();
    }

    let card: Card|undefined = await cardRepository.findFirst(CardFilter.create().byId(data.id));
    if (!card) {
      throw new CardNotFoundError(data.id);
    }

    if (actorUserId) {
      if (card.userId != actorUserId) {
        throw new CardManageForbiddenError(actorUserId);
      }
    }

    if (data.folderId) {
      let folder: Folder|undefined = await folderRepository.findById(data.folderId);
      if (!folder) {
        throw new FolderNotFoundError(data.folderId);
      }
    }

    if (data.userId && data.userId != card.userId) {
      let user: User|undefined = await userRepository.findFirst(UserFilter.create().byId(data.userId));
      if (!user) {
        throw new UserNotFoundError(data.folderId);
      }
    }

    if (data.frontSide !== undefined) {
      card.frontSide = data.frontSide;
    }

    if (data.backSide !== undefined) {
      card.backSide = data.backSide;
    }

    if (data.userId !== undefined) {
      card.userId = data.userId;
    }

    if (data.folderId !== undefined) {
      card.folderId = data.folderId;
    }

    if (data.difficult !== undefined && card.difficult != data.difficult) {
      const typeExists = CardDifficultType[data.difficult];
      if (!typeExists) {
        throw new CardDifficultTypeNotFoundError(data.difficult);
      }
      card.difficult = data.difficult;
      card.difficultChangeTime = new Date();
    }

    return await cardRepository.save(card);
  }

  public async createCard(data: CardManageDto) {
    if (!data.userId) {
      throw new CardUserEmptyError();
    }

    if (!data.folderId) {
      throw new CardFolderEmptyError();
    }

    const parentFolder: Folder | undefined = await folderRepository.findById(data.folderId);
    if (!parentFolder) {
      throw new FolderNotFoundError(data.folderId);
    }

    if (parentFolder.userId != data.userId) {
      throw new FolderManagementForbiddenError(data.userId);
    }

    let cardToCreate = new Card(
      undefined,
      data.folderId,
      data.userId,
      data.frontSide,
      data.backSide,
      CardDifficultType.DONT_SURE,
      new Date()
    );

    return await cardRepository.save(cardToCreate);
  }

}

export const cardService = new CardService();
export default cardService;
