import Game from "./Game";
import ws from "ws";
import ClientCompression from "./compression";
import Protocol from "./Protocol";
import { GameMode } from "../types/servers";
import Server from "./Server";
import GameStatus from "./GameStatus";
import PlayerController from "./PlayerController";
import { Base62Decode } from "../utils/Base62";
import StateChange from "./StateChange";

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
      d: [
        {
          "": 1,
          s: StateChange.Model.ENVIRONMENT,
          env: {
            weather: {
              precipitation: {
                type: "stars",
                intensity: "0.5",
              },
            },
            gravity: {
              x: "0",
              y: "25",
            },
            gradient: {
              topColor: "ffffff",
              bottomColor: "ff0000",
              topY: "-2000",
              bottomY: "2000",
            },
            settings: {
              energy: "100",
            },
            groups: [
              33, 29, 41, 31, 58, 24, 32, 55, 18, 48, 12, 22, 127, 50, 17, 57, 33, 114, 14, 66, 33,
              25, 28, 17, 15, 29, 33, 12, 74, 10, 10, 19, 21, 34, 40,
            ],
            meshes: [
              "m016",
              "m015",
              "m014",
              "m013",
              "m012",
              "m011",
              "m017",
              "m018",
              "m019",
              "m020",
              "m025",
              "m021",
              "m004",
              "m022",
              "m027",
              "m023",
              "m024",
              "m003",
              "m010",
              "m005",
              "m006",
              "m001",
              "m040",
              "m042",
              "m026",
              "m028",
              "m036",
              "m038",
              "m002",
              "m052",
              "50",
              "m030",
              "m033",
              "m031",
              "m032",
            ],
            textures: [
              "stone1",
              "ground1",
              "asphalt_2",
              "soil1",
              "chain",
              "asphalt_1",
              "wood1",
              "woodbox1",
              "oil_drum",
              "camo1",
              "sandbag1",
              "sandbag2",
            ],
            colors: [
              "fffafafa",
              "ffb7b7b7",
              "ff846c2d",
              "ff433d21",
              "ffc5be88",
              "ff8c8c8c",
              "ffd3d3d3",
              "ffb6a26f",
              "ff5f5b4f",
              "ff8e8e8e",
              "ffd6d6d6",
              "ff858483",
              "ff9f9fa1",
              "ff706852",
              "ff85837f",
              "838373",
              "ff979797",
              "ff99c588",
              "ff4b4b4b",
              "ff767676",
              "ffd6cf76",
              "ff6e8665",
              "ffa1a1a1",
              "ff434b40",
              "ffd1ca77",
              "ff528744",
              "ff535a53",
              "ff6e7b67",
              "ff4e4e4e",
              "ff6e7b68",
              "ff627758",
              "ff6f7b69",
              "ff637859",
              "ff21311b",
              "ff2d312d",
              "ff3b463c",
              "ff8b8769",
              "ff595e46",
              "ff495c42",
              "ff989f82",
              "ff3f3f3f",
              "ff606060",
              "ffcac9c6",
              "ff999577",
              "ff868687",
              "ff878788",
              "ff818183",
              "ff838385",
              "ff7a7a7a",
              "ffd2d7c3",
              "ff363636",
              "ffefe9c3",
              "ff626262",
              "ff90977b",
              "ff605d49",
              "ff222220",
              "ff3b3b3b",
              "ff424242",
              "ff333333",
              "ff969153",
              "ff5d5d5e",
              "ff5d5d5d",
              "6b6b87",
              "ff5f5f60",
              "ff59595a",
              "ff4d4d4d",
              "ffe5e5e5",
              "ff9494ff",
              "ffadadff",
              "ff666666",
              "ffa1a1ff",
              "ff686868",
              "9d8f89",
              "ff5a5a5a",
              "ff5c5c5c",
              "ff58585a",
              "ff8f8f8f",
              "ff747474",
              "ffafafff",
              "ff737373",
              "ff585858",
              "ffa5a5a6",
              "dcdcdc",
              "ffa6a6a7",
              "888888",
              "ff484848",
              "ff5b5b5b",
              "ff494949",
              "ff353535",
              "ffd9d9d9",
              "ffd7d7d7",
              "ff454545",
              "ffd0d0d0",
              "ff565656",
              "7e808080",
              "4cffffff",
              "bababa",
              "ff47a635",
              "ff727372",
              "ff535353",
              "838383",
              "ff848581",
              "ff858584",
              "ff848483",
              "ff818181",
              "ffeeffb9",
              "616161",
              "ff737472",
              "ff6f706e",
              "ff777877",
              "ff616161",
              "ff787978",
              "ff7b7b7b",
              "ff71746f",
              "ff6d6d6d",
              "ff797b78",
              "ff60615f",
              "ff646464",
              "ff797e76",
              "ff6c6d6c",
              "ff6e6e6e",
              "ff6c6c6c",
              "ff686967",
              "ff696a68",
              "ff6a6c69",
              "ff6f716e",
              "ff727471",
              "ff717171",
              "ff787878",
              "ff848482",
              "ffa0a0a0",
              "ff646466",
              "ff575758",
              "ffacacae",
              "ffacacad",
              "ff5a5a5b",
              "ff9c9c9e",
              "ff5e5e60",
              "ffa1a1a3",
              "ff9e9e9f",
              "ffa4a4a5",
              "ffa7a7aa",
              "ff5b5b5c",
              "ff575757",
              "ff545456",
              "ffa2a2a2",
              "ff57513d",
              "838374",
              "ffdfdfdf",
              "00000000",
              "3f000000",
              "ff646455",
              "ffcfd5c8",
              "464636",
              "ffcfd6c7",
              "ffced5c6",
              "ffcfd5c9",
              "ffd2d8cb",
              "ffd3d9cd",
              "47483e",
              "ffc7c3a4",
              "ffcbc7ac",
              "ffcdc9aa",
              "ffcac6a9",
              "ffcac6ac",
              "ffcbc7aa",
              "ffcdc9ad",
              "585858",
              "8e8e8e",
              "ff888985",
              "fffbfbff",
              "7f4d4d4d",
              "7fffffff",
              "b1b1ac",
              "ff6a685a",
              "ff8a8773",
              "ff33332f",
              "ff646256",
            ],
          },
        },
        {
          "": 1,
          id: "2b",
          p: {
            x: 1134.96,
            y: -654.9599999999999,
            type: 0,
            c: 1,
            sh: [
              {
                v: [
                  {
                    x: 85.01,
                    y: -15.025,
                  },
                  {
                    x: 25,
                    y: -35,
                  },
                  {
                    x: 25.07,
                    y: 35.115,
                  },
                ],
                o: {
                  x: 45.03,
                  y: 4.97,
                },
                c: 1,
                t: 2,
              },
            ],
            r: 0,
            id: "2b",
          },
          g: {
            t: 2,
            v: [
              0,
              0,
              {
                c: 77,
              },
            ],
            g: 7,
            tx: "ground1",
            uv: [1.747, -6.444, 1.869, -6.077, 1.441, -6.077, 1.686, -6.199],
            z: 650,
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
