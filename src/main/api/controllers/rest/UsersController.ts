import {EndpointBuilder} from "../../HttpApiBuilder";
import UsersFilterRequest from "../../requests/UsersFilterRequest";
import {userRepository} from "../../../database/DatabaseBeanConfig";
import User from "../../../domain/user/User";
import PaginationResponse from "../../PaginationResponse";
import userResponseMapper from "../../responses/UserResponseMapper";
import { UserResponse } from "../../responses/UserResponse";

EndpointBuilder
  .POST("/users/get", async (req, res) => {
    let filter = UsersFilterRequest.map(req.body);
    const users: User[] = await userRepository.find(filter);
    res.json(new PaginationResponse<UserResponse>(userResponseMapper.maps(users)));
  })
  .authenticated()
  .build();
