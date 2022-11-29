import HttpApiBuilder, {EndpointBuilder} from "../HttpApiBuilder";
import userService from "../../domain/user/UserService";
import AuthToken from "../../domain/auth/AuthToken";

EndpointBuilder
  .POST("/auth", async (req, res) => {
    let authToken: AuthToken | undefined = await userService.auth(req.body);
    res.json(authToken)
  }).build();

EndpointBuilder
  .GET("/auth/test", async (req, res) => {
    let userId = req.userId;
    res.json({userId});
  })
  .authenticated()
  .build();
