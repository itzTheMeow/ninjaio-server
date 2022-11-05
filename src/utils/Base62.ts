const Base62Charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const Base62Encode = function (a) {
  if (0 === a) return Base62Charset[0];
  let b = "";
  for (; 0 < a; ) (b = Base62Charset[a % 62] + b), (a = Math.floor((a / 62) >>> 0));
  return b;
};
export const Base62Decode = function (a) {
  var b = 0,
    c = a.length,
    d;
  for (d = 0; d < c; d++) {
    var e = a.charCodeAt(d);
    e = 58 > e ? e - 48 : 91 > e ? e - 29 : e - 87;
    b += e * Math.pow(62, c - d - 1);
  }
  return b;
};
