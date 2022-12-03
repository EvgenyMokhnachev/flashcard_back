import HttpApiBuilder, {EndpointBuilder} from "../HttpApiBuilder";
import userService from "../../domain/user/UserService";
import AuthToken from "../../domain/auth/AuthToken";

EndpointBuilder
  .POST("/auth", async (req, res) => {
    console.log(req.body);
    let authToken: AuthToken | undefined = await userService.auth(req.body);
    res.json(authToken)
  }).build();
