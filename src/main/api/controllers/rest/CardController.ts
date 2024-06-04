import {EndpointBuilder} from "../../HttpApiBuilder";
import cardService from "../../../domain/cards/CardService";
import CardManageDto from "../../../domain/cards/CardManageDto";
import CardsFilterRequest from "../../requests/CardsFilterRequest";
import Card from "../../../domain/cards/Card";
import {cardRepository} from "../../../database/DatabaseBeanConfig";
import PaginationResponse from "../../PaginationResponse";

EndpointBuilder
  .POST("/cards/create", async (req, res) => {
    let createCartDto = new CardManageDto(
      undefined,
      req.userId,
      req.body.folderId,
      req.body.frontSide,
      req.body.backSide,
      req.body.bookmarked,
    );
    let card = await cardService.createCard(createCartDto);
    res.json(card);
  })
  .authenticated()
  .build();

EndpointBuilder
  .POST("/cards/update", async (req, res) => {
    let manageCardDto = new CardManageDto(
      req.body.id,
      req.body.userId,
      req.body.folderId,
      req.body.frontSide,
      req.body.backSide,
      req.body.bookmarked,
      req.body.difficult,
    );
    let card = await cardService.updateCard(manageCardDto, req.userId);
    res.json(card);
  })
  .authenticated()
  .build();

EndpointBuilder
  .POST("/cards/delete", async (req, res) => {
    let cardId = req.body.id;
    let success = await cardService.delete(cardId, req.userId);
    res.json({success});
  })
  .authenticated()
  .build();

EndpointBuilder
  .POST("/cards/get", async (req, res) => {
    let cardFilter = CardsFilterRequest.map(req.body);
    let cards: Card[] = await cardRepository.find(cardFilter);
    res.json(new PaginationResponse<Card>(cards, undefined));
  })
  .authenticated()
  .build();
