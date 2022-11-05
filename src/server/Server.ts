import { GameMode, Regions } from "../types/servers";
import Game from "./Game";
import http, { createServer } from "http";
import ws from "ws";
import { decompressFromEncodedURIComponent } from "lz-string";
import Player from "./Player";

let SID = 0;

export default class Server {
  public games: Game[] = [];
  public name = "Custom Servers";
  public region: Regions = Regions.NAEast;
  public id: number;
  public http: http.Server;
  public ws: ws.Server;

  constructor(public port: number) {
    this.id = SID += 1;

    this.http = createServer();
    this.http.on("upgrade", (req, sock, head) => {
      try {
        const url = new URL("ws://host" + req.url);

        const auth = url.searchParams.get("auth");
        if (!auth) return sock.destroy();
        const credentials = JSON.parse(decompressFromEncodedURIComponent(auth));

        if (url.pathname == "/ws") {
          console.log(credentials.id);
          this.ws.handleUpgrade(req, sock, head, (c) => this.handleConnection(c));
        } else {
          sock.destroy();
        }
      } catch (err) {
        console.error(err);
        sock.destroy();
      }
    });
    this.ws = new ws.Server({
      noServer: true,
    });
    this.http.listen(this.port, () => {
      console.log(`Server ${this.name} listening on port ${this.port}.`);
    });

    this.createGame(GameMode.Deathmatch);
    this.createGame(GameMode.TeamDeathmatch);
    this.createGame(GameMode.CaptureTheFlag);
    this.createGame(GameMode.Dodgeball);
    this.createGame(GameMode.Training);
  }
  public createGame(type: GameMode) {
    const game = new Game(this, type);
    this.games.push(game);
  }
  public handleConnection(socket: ws.WebSocket) {
    new Player(this, socket);
  }
}
