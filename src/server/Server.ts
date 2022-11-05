import { GameMode, Regions } from "../types/servers";
import Game from "./Game";

let SID = 0;

export default class Server {
  public games: Game[] = [];
  public name = "Custom Servers";
  public region: Regions = Regions.NAEast;
  public id: number;

  constructor(public port: number) {
    this.id = SID += 1;
    this.createGame(GameMode.Deathmatch);
  }
  public createGame(type: GameMode) {
    const game = new Game(this, type);
    this.games.push(game);
  }
}
