import { GameMode } from "../types/servers";
import Player from "./Player";
import Server from "./Server";

export default class Game {
  public name = "My Game";
  public players: Player[] = [];

  constructor(public server: Server, public type: GameMode) {}
}
