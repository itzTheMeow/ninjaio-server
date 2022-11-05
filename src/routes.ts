import { Application } from "express";
import { servers } from ".";
import drops from "./def/drops";
import maps from "./def/maps";

export default function initRoutes(app: Application) {
  app.get("/item-drop", (req, res) => {
    res.json(drops);
  });
  app.get("/map", (req, res) => {
    res.json(maps);
  });
  app.get("/server", (req, res) => {
    res.json({
      servers: servers.map((s) => ({
        id: String(s.id),
        uid: "abcdefgh",
        name: "NJ1",
        domain: "localhost",
        title: s.name,
        address: "localhost",
        port: String(s.port),
        secure: "0",
        region: s.region,
        status: "online",
        players: String(s.games.reduce((num, g) => num + g.players.length, 0)),
        games: String(s.games.length),
        modes: { training: "0", teamDeathmatch: "0", captureTheFlag: "0", deathmatch: "0" },
      })),
      status: { updating: true, message: "There are probably bugs... beware." },
      headline: {
        title: "sup",
        description: "custom ninja server",
      },
    });
  });
  app.get("/game", (req, res) => {
    res.json(
      servers
        .map((s) => s.games)
        .flat(1)
        .map((g) => ({
          region: g.server.region,
          server_id: String(g.server.id),
          name: g.name,
          mode: g.type,
          players: String(g.players.length),
          private: "0",
          ranked: "1",
          custom: "0",
          agi: "-1",
        }))
    );
  });
}
