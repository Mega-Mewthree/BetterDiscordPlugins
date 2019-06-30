//META{"name":"FixUnreadChatScroller","website":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Plugins/FixUnreadChatScroller","source":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Plugins/DiscordCakeDay/FixUnreadChatScroller.plugin.js"}*//

/*
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

*/

/*
MIT License

Copyright (c) 2018-2019 Mega_Mewthree

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Created July 28th, 2018.
// Updated June 29th, 2019.

class FixUnreadChatScroller {
  getName() {
    return "FixUnreadChatScroller";
  }
  getShortName() {
    return "FixUnreadChatScroller";
  }
  getDescription() {
    return 'MUST ENABLE NORMALIZED CLASSES!\nFixes channels not getting marked as read upon scrolling to the bottom.\n\nMy Discord server: https://nebula.mooo.info/discord-invite\nDM me @Lucario ☉ ∝ x²#7902 or create an issue at https://github.com/Mega-Mewthree/BetterDiscordPlugins for support.';
  }
  getVersion() {
    return "0.0.3";
  }
  getAuthor() {
    return "Mega_Mewthree"; //Current Discord account: @Lucario ☉ ∝ x²#7902 (438469378418409483)
  }
  constructor() {}
  load() {}
  unload() {}
  start() {
    let libraryScript = document.getElementById("zeresLibraryScript");
    if (!window.ZeresLibrary || window.ZeresLibrary.isOutdated) {
      if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
      libraryScript = document.createElement("script");
      libraryScript.setAttribute("type", "text/javascript");
      libraryScript.setAttribute("src", "https://rauenzi.github.io/BetterDiscordAddons/Plugins/PluginLibrary.js");
      libraryScript.setAttribute("id", "zeresLibraryScript");
      document.head.appendChild(libraryScript);
    }
    if (window.ZeresLibrary) this.initialize();
    else libraryScript.addEventListener("load", () => { this.initialize(); });
  }
  stop() {
    this.active = false;
  }
  initialize() {
    try {
      (window.ZeresPluginLibrary && window.ZeresPluginLibrary.PluginUtilities && window.ZeresPluginLibrary.PluginUtilities.checkForUpdate || PluginUtilities && PluginUtilities.checkForUpdate)(this.getName(), this.getVersion(), `https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordPlugins/master/Plugins/${this.getName()}/${this.getName()}.plugin.js`);
    } catch (e) {
      console.error(e);
    }
    this.active = true;
    const scroller = document.querySelector(".da-messagesWrapper .da-scroller");
    if (scroller) {
      try {
        if (Math.abs(scroller.scrollTop - scroller.scrollHeight + scroller.offsetHeight) < 175) {
          scroller.scrollTop = scroller.scrollHeight - scroller.offsetHeight;
        }
        scroller.onscroll = () => {
          if (!this.active) return;
          if (Math.abs(scroller.scrollTop - scroller.scrollHeight + scroller.offsetHeight) < 2) {
            InternalUtilities.WebpackModules.find(m => m.localAck).ack(DiscordModules.SelectedChannelStore.getChannelId());
          }
        };
      } catch (e) {}
    }
    BdApi.showToast("FixUnreadChatScroller has started!");
  }
  observer({addedNodes}) {
    let len = addedNodes.length;
    let change;
    while (len--){
      change = addedNodes[len];
      if (change.classList && change.classList.contains("da-messagesWrapper")) {
        const scroller = document.querySelector(".da-messagesWrapper .da-scroller");
        try {
          if (Math.abs(scroller.scrollTop - scroller.scrollHeight + scroller.offsetHeight) < 175) {
            scroller.scrollTop = scroller.scrollHeight - scroller.offsetHeight;
          }
          scroller.onscroll = () => {
            if (!this.active) return;
            if (Math.abs(scroller.scrollTop - scroller.scrollHeight + scroller.offsetHeight) < 2) {
              InternalUtilities.WebpackModules.find(m => m.localAck).ack(DiscordModules.SelectedChannelStore.getChannelId());
            }
          };
        } catch (e) {}
        break;
      }
    }
  }
}

/*
-----BEGIN PGP SIGNATURE-----

iQEzBAEBCgAdFiEEGTGecftnrhRz9oomf4qgY6FcSQsFAl0YSz0ACgkQf4qgY6Fc
SQtuHggAvU3JoeeX41lJRqahbGsKFN3WSROvCYH+4dr3zk+d/2Re19vLKEkXh5yG
LgJWAppJdqzAHkDZukZBVbsyUqfdq+QY8U2ef4E2IWXOoBCx1jeUG/kkYJUYQGER
6p7iOkVkUUWX3YRcFNghK6hRd9oGt8TZZTYSL85iDt9xCBP6Bv4NKG++5bb27lnp
Xru5LHLcxSPbrcqxkDZu1WURSgjLKHHiKAqOHDwy8KlKApG6SSYhLnpCYafDIimt
371HAAapDAONAgCKdBnE1P64axla82hYG6oqbAhqY+YSnWd/cWVo2Vd9jzAPzpDq
YuFftB+xoPscjEG/ptp6pySKmrW/RA==
=V9+X
-----END PGP SIGNATURE-----
*/
