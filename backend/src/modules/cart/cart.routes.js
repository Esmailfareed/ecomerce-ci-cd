import express  from "express";
import * as cart from "./cart.controller.js";
import { protectRoutes } from "../auth/auth.controller.js";

export const  CartRouter = express.Router();

CartRouter.post("/",protectRoutes,cart.addCart);
CartRouter.get("/",protectRoutes ,cart.getCart);
CartRouter.delete("/",protectRoutes,cart.clearCart);
CartRouter.delete("/delete/:id",protectRoutes,cart.deleteCart);
CartRouter.put("/:id",protectRoutes,cart.UpdateCart);
CartRouter.delete("/:id",protectRoutes,cart.removeCartItem);
