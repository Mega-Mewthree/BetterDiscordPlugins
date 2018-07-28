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
    return "0.0.1";
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
      if (change.classList && change.classList.contains("messages-wrapper")) {
        const scroller = document.querySelector(".messages.scroller");
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

iQEzBAEBCAAdFiEEGTGecftnrhRz9oomf4qgY6FcSQsFAltc08AACgkQf4qgY6Fc
SQundwgAykBnyNU2cyrk1sPAhEDgcu2vyHtbrdhT7cPj2ZykCpx+ImGWrUTawiVK
0XpHmNKPEEU5F9JnI4vidjuPBskMFXv3HYNSUb+aD7sZ76lzC3/azZiyCFkAAyH0
Ufo//Rt83TQvfmKowURPVYNH1sE7mPm49R/4JybOajyZCjmPaapXsCT4+x1+ChIU
bojBtzsOW7vIlSAk4480yEcxmnZo8nln29gm29ukUC4Aw9a7KK7M/ozGu6i8/Mmh
I4Wi0ngM03xbpCmqFuy8eQ42CeQUrkjrcwzTWiK8fmDNBq6c7A9Qm4GTzKmLLRA5
ifIlTUKvjnM9sMR7/31B9FI2VI68hQ==
=04OM
-----END PGP SIGNATURE-----
*/
