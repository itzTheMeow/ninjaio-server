import Game from "./Game";
import ws from "ws";
import ClientCompression from "./compression";
import Protocol from "./Protocol";
import { GameMode } from "../types/servers";
import Server from "./Server";
import GameStatus from "./GameStatus";
import PlayerController from "./PlayerController";
import { Base62Decode } from "../utils/Base62";
import { MAP } from "./MAP";

interface Packet {
  type?: string;
  t?: string;
  [key: string]: any;
}

export default class Player {
  public sid = String(Date.now()); //TODO: proper SIDs
  public game?: Game | null = null;

  public stats = {
    kills: 0,
    deaths: 0,
    caps: 0,
  };
  public controller: PlayerController;

  constructor(public server: Server, public socket: ws.WebSocket) {
    this.reset();
    this.socket.onmessage = (msg) => this.onPacket(ClientCompression.decompress(msg.data));
  }

  public onJoinGame() {
    if (!this.game) return;
    this.game.players.push(this);
    this.send({ type: Protocol.Session.CLIENT_AUTH, authenticated: true });
    this.send({
      type: Protocol.Session.JOIN_RESP,
      granted: true,
      sid: this.sid,
      info: `You joined ${this.game.name}.`,
    });
    this.send({
      t: Protocol.Game.STATUS,
      d: {
        t: GameStatus.Settings.WORLD,
        s: {
          settings: {
            uid: "WGGaaj4G",
            agId: -1,
            name: this.game.name,
            owner: -2,
            initiator: "YdjLlQ77",
            pub: true,
            password: "",
            persistent: false,
            custom: false,
            ranked: true,
            duration: 21600,
            maxPlayers: 12,
            maxKills: 100,
            maxDmKills: 30,
            maxPoints: 3,
            maxDbMatches: 10,
            num: "0j",
            nextGameCountdown: 24,
            teams: 12,
            roundDuration: 600,
            respawnTime: 5000,
            objectiveTresspassTime: 50,
            objectiveRespawnDistance: 16,
            mode: this.game.type,
            members: [],
            maps: [],
            items: [
              "i1",
              "i9",
              "i2",
              "i3",
              "i4",
              "i5",
              "i6",
              "i7",
              "i30",
              "i40",
              "i8",
              "i10",
              "i11",
              "i31",
              "i12",
              "i32",
              "i33",
              "i34",
              "i35",
              "i36",
              "i37",
              "i38",
              "i39",
              "i41",
            ],
            itemDrops: ["i80", "i81", "i82", "i83", "i84"],
            shuriken: true,
          },
          stats: {
            leaderboard: this.game.players.reduce(
              (d, p) => {
                d.id.push(p.sid);
                d.kills.push(p.stats.kills);
                d.deaths.push(p.stats.deaths);
                d.points.push(p.stats.caps);
                return d;
              },
              {
                id: [],
                kills: [],
                deaths: [],
                points: [],
              }
            ),
            teams: [696969, 69696969], //TODO: flag caps or team kills i guess
          },
          running: 1,
        },
      },
    });
    this.send({
      t: Protocol.Game.INFO,
      msg: "OwO",
    });
    this.send({
      t: Protocol.Game.UPDATE,
      d: MAP,
    });
  }

  public reset() {
    this.stats.kills = this.stats.deaths = this.stats.caps = 0;
    this.controller = new PlayerController(this);
  }
  public send(packet: Packet, reconstruct?: boolean) {
    if (this.socket.readyState === ws.OPEN)
      this.socket.send(ClientCompression.compress(packet, reconstruct));
  }
  public onPacket(packet: Packet) {
    console.log(packet);
    switch (packet.type) {
      case Protocol.Session.JOIN_MODE: {
        const mode: GameMode = packet.mode;
        const matches = this.server.games.filter((s) => s.type == mode);
        const match = matches[Math.floor(matches.length * Math.random())];
        console.log(`found ${match?.name} for ${mode}`);
        if (!match) return; // TODO: fix
        this.game = match;
        this.onJoinGame();
        break;
      }
      case Protocol.ECHO: {
        this.send({ type: Protocol.ECHO_RESP }, false);
        break;
      }
    }
    switch (packet.t) {
      case Protocol.Game.INPUT: {
        const state = Base62Decode(packet.d);
        console.log(state);
        break;
      }
    }
  }
}
