// @ts-ignore
import express, {Express, Request, RequestHandler, Response} from 'express';
import * as bodyParser from "body-parser";
import {IRouterMatcher} from "express-serve-static-core";
import userService from "../domain/user/UserService";

declare global {
  namespace Express {
    interface Request {
      userId: number
    }
  }
}

const httpApp = express();
const jsonParser = bodyParser.json()

class HttpApiBuilder {
  private httpApp: Express;

  constructor() {
    this.httpApp = httpApp;
  }

  public start(port?: number): void {
    const setupPort = port || 3000;
    this.httpApp.listen(setupPort, () => {
      console.log(`Example app listening on port ${setupPort}`)
    });
  }

}

enum Method {
  POST,
  GET
}

export class EndpointBuilder {
  private method: Method;
  private path: string;
  private handler: RequestHandler;
  private isAuthenticated: boolean = false;

  constructor(method: Method, path: string, handler: RequestHandler) {
    this.method = method;
    this.path = path;
    this.handler = handler;
  }

  public static POST(path: string, handler: RequestHandler): EndpointBuilder {
    return new EndpointBuilder(
      Method.POST,
      path,
      handler
    );
  }

  public static GET(path: string, handler: RequestHandler): EndpointBuilder {
    return new EndpointBuilder(
      Method.GET,
      path,
      handler
    );
  }

  public authenticated(): EndpointBuilder {
    this.isAuthenticated = true;
    return this;
  }

  public build() {
    let method: IRouterMatcher<Express, any>;

    if (this.method === Method.POST) {
      method = httpApp.post.bind(httpApp)
    } else {
      method = httpApp.get.bind(httpApp)
    }

    if (method) {
      method(this.path,
        this.isAuthenticated
          ? EndpointBuilder.authHandler.bind(this)
          : (req: Request, res: Response, next: any) => {
            if (next) next();
          },
        jsonParser,
        this.handler
      );
    }
  }

  private static authHandler(req: Request, res: Response, next: any) {
    let token = req.get("Authorization");

    try {
      req.userId = userService.checkToken(token);
      if (next) {
        next();
      }
    } catch (e) {
      res.status(403);
      res.sendStatus(403);
    }
  }

}

let httpApiBuilder = new HttpApiBuilder();

export default httpApiBuilder;

