import HttpApiBuilder, {EndpointBuilder} from "../../HttpApiBuilder";
import userService from "../../../domain/user/UserService";
import AuthToken from "../../../domain/auth/AuthToken";

EndpointBuilder
  .POST("/auth", async (req, res) => {
    let authToken: AuthToken | undefined | null = await userService.auth(req.body);
    res.json(authToken)
  }).build();
