//META{"name":"FixUnreadChatScroller","website":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Plugins/FixUnreadChatScroller","source":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Plugins/DiscordCakeDay/FixUnreadChatScroller.plugin.js"}*//

/*
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

*/

/*
MIT License

Copyright (c) 2018 Mega_Mewthree

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
// Updated August 3rd, 2018.

class FixUnreadChatScroller {
  getName() {
    return "FixUnreadChatScroller";
  }
  getShortName() {
    return "FixUnreadChatScroller";
  }
  getDescription() {
    return 'Fixes channels not getting marked as read upon scrolling to the bottom.\n\nMy Discord server: https://nebula.mooo.info/discord-invite\nDM me @Lucario 🌌 V5.0.0#7902 or create an issue at https://github.com/Mega-Mewthree/BetterDiscordPlugins for support.';
  }
  getVersion() {
    return "0.0.2";
  }
  getAuthor() {
    return "Mega_Mewthree"; //Current Discord account: @Lucario 🌌 V5.0.0#7902 (438469378418409483)
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
    PluginUtilities.checkForUpdate(this.getName(), this.getVersion(), `https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordPlugins/master/Plugins/${this.getName()}/${this.getName()}.plugin.js`);
    this.active = true;
    PluginUtilities.showToast("FixUnreadChatScroller has started!");
  }
  observer({addedNodes}) {
    let len = addedNodes.length;
    let change;
    while (len--){
      change = addedNodes[len];
      if (change.classList && change.classList.contains("messagesWrapper-3lZDfY")) {
        const scroller = document.querySelector(".messages-3amgkR.scroller");
        try {
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

iQEzBAEBCAAdFiEEGTGecftnrhRz9oomf4qgY6FcSQsFAltlLD0ACgkQf4qgY6Fc
SQsXKAf7BAA/lLHwWVlBIhzwz+CQicxt2cM6fiG/q5a7oXCIdqH6vAghmr9keC72
JM9IdJySti8E1GC/cTFc3mzLRghXw+hUW1XjG/f85+UTD4WrH5xT5Vpqd4J6JyKT
VIUB7vlU+vY4/ICkPFn9ki6XQsFwcWYoaD8TVVfoDM8At0PQFBhYcNrihzFx6UkJ
8lphP9uG4YMOoxxYHi3JO3Ot/pk+Vl/7OxEWUMQ9ArUqT7200/lytg3aqJJEmZKd
GG8lpdxscKHWlmL8VLa2g8kRxxf7GkeJr0oQbHuDQP0Q5JxXpwD6ERI1aX4CVT3H
KL9pfDnbYnrl9g4/MgBLj+BeEWTy8A==
=lBDv
-----END PGP SIGNATURE-----
*/
