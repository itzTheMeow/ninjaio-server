import express from "express";
import config from "./config";
import initRoutes from "./routes";

const app = express();

app.get("/", (req, res) => {
  res.json({ product: "Custom Ninja.io API", version: "0.0.1" });
});

initRoutes(app);

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}.`);
});
