import { Application } from "express";
import drops from "./def/drops";

export default function initRoutes(app: Application) {
  app.get("/item-drop", (req, res) => {
    res.json(drops);
  });
}
