import Game from "./Game";
import ws from "ws";
import ClientCompression from "./compression";
import Protocol from "./Protocol";
import { GameMode } from "../types/servers";
import Server from "./Server";
import GameStatus from "./GameStatus";
import PlayerController from "./PlayerController";
import { Base62Decode } from "../utils/Base62";
import { MAP, MAP2 } from "./MAP";

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
      t: Protocol.Game.STATUS,
      d: {
        t: GameStatus.Player.JOIN,
        s: {
          sid: this.sid,
          name: "Ninja930 (guest)",
          clan_id: -1,
          clan_name: "",
          guest: true,
          title: "Guest",
          level: 1,
          skill: 0,
          premium: true,
          customization: {},
          type: "guest",
          local: true,
          team: 0,
        },
      },
    });
    this.send({
      t: Protocol.Game.INFO,
      msg: "OwO",
    });
    this.send({
      t: Protocol.Game.UPDATE,
      d: MAP.filter((m) => !m.player),
    });
    this.send({
      t: Protocol.Game.UPDATE,
      d: MAP2.filter((m) => !m.player),
    });
    this.send({
      t: Protocol.Game.UPDATE,
      d: [
        {
          "": 1,
          id: "rk",
          p: {
            x: -62.35766666666667,
            y: -20.172333333333334,
            vx: 0,
            vy: 0,
            j: 0,
            fx: 0,
            fy: 0,
            type: 2,
            r: 1.5707963267948966,
            gi: -1694,
            prefab: 4,
            continuous: true,
            id: "rk",
            ragdoll: {
              id: {
                head: "rk_head",
                armrightlower: "rk_armrightlower",
                armrightupper: "rk_armrightupper",
                torsoupper: "rk_torsoupper",
                torsolower: "rk_torsolower",
                armleftlower: "rk_armleftlower",
                armleftupper: "rk_armleftupper",
                legrightlower: "rk_legrightlower",
                legrightupper: "rk_legrightupper",
                legleftlower: "rk_legleftlower",
                legleftupper: "rk_legleftupper",
              },
            },
            z: 16.314181684249878,
            a: {
              "0": 0,
              "22": 0,
              _: false,
            },
          },
          sharedState: [
            {
              id: "rk",
              s: 103,
              t: "i39",
              "": 1,
            },
            {
              id: "rk",
              s: 104,
              t: "i20",
              "": 1,
            },
          ],
          player: 1,
          team: 1,
          sid: this.sid,
          name: "Ninja47 (guest)",
          z: 16.314181684249878,
          a: {
            "0": 0,
            "22": 0,
            _: false,
          },
        },
      ],
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
