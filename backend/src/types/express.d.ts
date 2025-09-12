import { Request } from "express";
import {IUserJWT} from "./user";

declare module "express-serve-static-core" {
    interface Request {
        user?: IUserJWT;
    }
}
