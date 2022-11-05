import { compressToUint8Array, decompressFromUint8Array } from "lz-string";
import Protocol from "./Protocol";

// not gonna unminify this honestly
const ClientCompression = {
  SendBuffer: new Uint8Array(2048),
  compress: function (a, reconstruct = true) {
    a = JSON.parse(JSON.stringify(a));
    if (reconstruct && !a.t) {
      a.data = JSON.parse(JSON.stringify(a));
      a.type = Object.values(Protocol.Session).includes(a.type) ? Protocol.SESSION : Protocol.GAME;
    }
    const isBin = a.t == Protocol.Game.UPDATE;
    let b = JSON.stringify(a),
      c = ClientCompression.SendBuffer.subarray(0, b.length + 1);
    c[0] = a.t ? 1 : 0;
    if (isBin) {
      return new Uint8Array([128, ...compressToUint8Array(JSON.stringify(a.d))]);
    } else {
      for (let d = 1, e = b.length; d < e + 1; d++) c[d] = b.charCodeAt(d - 1);
    }
    return c;
  },
  decompress: function (a) {
    try {
      return JSON.parse(a.toString().substring(1));
    } catch {}
    a = new Uint8Array(a);
    let b;
    if (128 === a[0]) {
      b = Protocol.GAME_BIN;
      var c: any = ClientCompression.unpackGameData(a);
    } else {
      let d;
      switch (a[0]) {
        case 0:
          c = a.length - 1;
          for (d = Array(c); 0 < c--; ) d[c] = String.fromCharCode(a[c + 1]);
          c = JSON.parse(d.join(""));
          b = c.type;
          c = c.data;
          break;
        case 1:
          b = Protocol.GAME;
          c = a.length - 1;
          for (d = Array(c); 0 < c--; ) d[c] = String.fromCharCode(a[c + 1]);
          c = JSON.parse(d.join(""));
      }
    }
    return { data: c, type: b };
  },
  unpackGameData: function (a) {
    return {
      t: Protocol.Game.UPDATE,
      d: JSON.parse(decompressFromUint8Array(a.subarray(1))),
    };
  },
};

export default ClientCompression;
