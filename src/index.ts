import axios from "axios";
import express from "express";
import config from "./config";
import initRoutes from "./routes";
import cors from "cors";
import Server from "./server/Server";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.json({ product: "Custom Ninja.io API", version: "0.0.1" });
});

initRoutes(app);

app.get("*", async (req, res) => {
  try {
    delete req.headers.host;
    const ax = await axios.get(`https://api.ninja.io${req.originalUrl}`, { headers: req.headers });
    res.status(ax.status).json(ax.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});
app.post("*", express.json(), async (req, res) => {
  try {
    const ax = await axios.post(`https://api.ninja.io${req.originalUrl}`, req.body, {
      headers: req.headers,
    });
    res.status(ax.status).json(ax.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export const servers = [new Server(5001)];

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}.`);
});
