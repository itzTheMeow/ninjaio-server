// ==UserScript==
// @name         Ninja Custom
// @namespace    https://itsmeow.cat/
// @version      0.1
// @description  Connects to custom ninja server and packet sniffer.
// @author       Meow
// @match        https://*.ninja.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ninja.io
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const i = setInterval(() => {
    try {
      // comment this line to turn it off while keeping packet sniffer
      ServiceBase.API_URL = "http://localhost:5000/";
      Client._compress = Client.compress;
      Client.compress = (d) => {
        console.log("=> ", d);
        return Client._compress(d);
      };
      Client._decompress = Client.decompress;
      Client.decompress = (d) => {
        d = Client._decompress(d);
        console.log("<= ", d);
        return d;
      };
      clearInterval(i);
    } catch {}
  });
})();
