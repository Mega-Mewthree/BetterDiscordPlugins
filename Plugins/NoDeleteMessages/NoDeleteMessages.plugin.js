//META{"name":"NoDeleteMessages","website":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Plugins/NoDeleteMessages","source":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Plugins/NoDeleteMessages/NoDeleteMessages.plugin.js"}*//

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

// Updated May 15th, 2018.

class NoDeleteMessages {
  getName() {
    return "NoDeleteMessages";
  }
  getShortName() {
    return "NoDeleteMessages";
  }
  getDescription() {
    return 'Prevents the client from removing deleted messages (until restart).\nUse ".message.NoDeleteMessages-deleted-message .markup" to edit the CSS of deleted messages.\n\nMy Discord server: https://join-nebula.surge.sh\nDM me @Lucario 🌌 V5.0.0#7902 or create an issue at https://github.com/Mega-Mewthree/BetterDiscordPlugins for support.';
  }
  getVersion() {
    return "0.0.2";
  }
  getAuthor() {
    return "Mega_Mewthree"; //Current Discord account: @Lucario 🌌 V5.0.0#7902 (438469378418409483) Wonder how long this one will last...
  }
  constructor() {
    this.deletedMessages = {};
  }
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
  initialize() {
    window.updateDeletedMessages = () => this.updateDeletedMessages;
    PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
    BdApi.injectCSS("NoDeleteMessages-CSS", ".message.NoDeleteMessages-deleted-message .markup {color: #F00!important;}");
    InternalUtilities.WebpackModules.find(m => m.dispatch).setInterceptor(evt => this.filter(evt));
    PluginUtilities.showToast("NoDeleteMessages has started!");
  }
  stop() {
    this.deletedMessages = {};
    this.filter = function () {return false;};
    BdApi.clearCSS("NoDeleteMessages-CSS");
    PluginUtilities.showToast("Please restart Discord for the plugin to be fully unloaded.", {type: "warn"});
  }
  filter(evt) {
    if (evt.type === "MESSAGE_DELETE") {
      if (Array.isArray(this.deletedMessages[evt.channelId])){
        if (this.deletedMessages[evt.channelId].length > 149) this.deletedMessages[evt.channelId].shift(); // 150 because only 150 messages are stored per channel.
        this.deletedMessages[evt.channelId].push(evt.id);
      } else {
        this.deletedMessages[evt.channelId] = [evt.id];
      }
      if (evt.channelId === this.getCurrentChannelID()) this.updateDeletedMessages();
      return true;
    } else if (evt.type === "MESSAGE_DELETE_BULK") {
      if (Array.isArray(this.deletedMessages[evt.channelId])){
        if (this.deletedMessages[evt.channelId].length + evt.ids.length > 149) this.deletedMessages[evt.channelId].splice(0, this.deletedMessages[evt.channelId].length + evt.ids.length - 150);
        this.deletedMessages[evt.channelId].push(...evt.ids);
      } else {
        this.deletedMessages[evt.channelId] = [...evt.ids];
      }
      if (evt.channelId === this.getCurrentChannelID()) this.updateDeletedMessages();
      return true;
    }
    return false;
  }
  observer({addedNodes}) {
    let len = addedNodes.length;
    let change;
    while (len--){
      change = addedNodes[len];
      if (change.classList && change.classList.contains("messages-wrapper")) {
        this.updateDeletedMessages();
        break;
      }
    }
  }
  updateDeletedMessages() {
    const currentChannel = this.getCurrentChannelID();
    const channelDeletedMessages = this.deletedMessages[this.getCurrentChannelID()];
    if (!channelDeletedMessages) return;
    $(".message").each((index, elem) => {
      if (channelDeletedMessages.includes(elem[Object.keys(elem).find(k => k.startsWith("__reactInternalInstance"))].return.key)) {
        elem.classList.add("NoDeleteMessages-deleted-message");
      }
    });
  }
  getCurrentChannelID() {
    return DiscordModules.SelectedChannelStore.getChannelId();
  }
}

/*
-----BEGIN PGP SIGNATURE-----

iQEzBAEBCAAdFiEEGTGecftnrhRz9oomf4qgY6FcSQsFAlr7o7gACgkQf4qgY6Fc
SQsJ1gf9HQjy1muWKNTO+VEAVwAaSA03Z8yzoBLLTOmmqImSn/c9SFxHxeItXsWe
SbG0dxpOZCdAPM982vIMIteEc7MQT6Q71HlnbpyuZpZ7l15b3Tr9eQBMsOyEQGw1
rDCwsgR93ojxGyqzK2ZOG/2GOSyQA8Sq5lHxzLLQVmqvDag8ES6cGEmhcV/pvBdo
YG8iqGFBZAC4bOKPHyCJhQMFkJn0M4EdXeFRhNuBGSz6qIHQMt0Ebt5UXTQAsHRK
/cohmqcprCGbmb8gGpfDYF3aV251L+wADemr+Z1DGERygKTSnEr75ofLUzBaMETs
1xRSWpvtj+qJdEaLYumP4KRUoIQlpg==
=mQW3
-----END PGP SIGNATURE-----
*/
