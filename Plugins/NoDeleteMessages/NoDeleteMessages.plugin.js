//META{"name":"NoDeleteMessages","website":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Plugins/NoDeleteMessages","source":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Plugins/NoDeleteMessages/NoDeleteMessages.plugin.js"}*//

/*
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

*/

/*
MIT License

Copyright (c) 2018-2019 Mega-Mewthree

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

// Updated March 22nd, 2019.

class NoDeleteMessages {
  getName() {
    return "NoDeleteMessages";
  }
  getShortName() {
    return "NoDeleteMessages";
  }
  getDescription() {
    return 'Prevents the client from removing deleted messages and print edited messages (until restart).\nUse ".NoDeleteMessages-deleted-message .da-markup" to edit the CSS of deleted messages.\n\nMy Discord server: https://join-nebula.surge.sh\nDM me @Lucario 🌌 V5.0.0#7902 or create an issue at https://github.com/Mega-Mewthree/BetterDiscordPlugins for support.';
  }
  getVersion() {
    return "0.0.9";
  }
  getAuthor() {
    return "Mega_Mewthree (original), ShiiroSan (edit logging)";
  }
  constructor() {
    this.deletedMessages = {};
    this.editedMessages = [];
    //this.savedMessages = [];
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
    else libraryScript.addEventListener("load", () => {
      this.initialize();
    });
  }
  initialize() {
    window.updateDeletedMessages = () => this.updateDeletedMessages;
    PluginUtilities.checkForUpdate(this.getName(), this.getVersion(), `https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordPlugins/master/Plugins/${this.getName()}/${this.getName()}.plugin.js`);

    BdApi.injectCSS("NoDeleteMessages-CSS", `
      .NoDeleteMessages-deleted-message .da-markup{
          color: #F00 !important;
      }
      .NoDeleteMessages-deleted-message:not(:hover) img, .NoDeleteMessages-deleted-message:not(:hover) .mention, .NoDeleteMessages-deleted-message:not(:hover) .reactions, .NoDeleteMessages-deleted-message:not(:hover) a {
            filter: grayscale(100%) !important;
      }
      .NoDeleteMessages-deleted-message img, .NoDeleteMessages-deleted-message .mention, .NoDeleteMessages-deleted-message .reactions, .NoDeleteMessages-deleted-message a {
            transition: filter 0.3s !important;
      }
      .NoDeleteMessages-edited-message > .NoDeleteMessages-edited-message:not(:last-child) > .NoDeleteMessages-edited-message, :not(.NoDeleteMessages-edited-message) > .NoDeleteMessages-edited-message {
        color: rgba(255, 255, 255, 0.5) !important;
      }
      .NoDeleteMessages-deleted-message :not(.NoDeleteMessages-edited-message) > .NoDeleteMessages-edited-message, .NoDeleteMessages-deleted-message .NoDeleteMessages-edited-message > .NoDeleteMessages-edited-message:not(:last-child) > .NoDeleteMessages-edited-message {
        color: rgba(240, 71, 71, 0.5) !important;
      }
      .NoDeleteMessages-deleted-message .NoDeleteMessages-edited-message > .NoDeleteMessages-edited-message:last-child > .NoDeleteMessages-edited-message {
        color: #F00 !important;
      }
    `)

    Patcher.instead(this.getName(), InternalUtilities.WebpackModules.find(m => m.dispatch), "dispatch", (thisObject, args, originalFunction) => {
      let shouldFilter = this.filter(args[0]);
      if (!shouldFilter) return originalFunction(...args);
    });
    Patcher.instead(this.getName(), InternalUtilities.WebpackModules.find(m => m.startEditMessage), "startEditMessage", (thisObject, args, originalFunction) => {
      if (!this.editedMessages[args[0]] || !this.editedMessages[args[0]][args[1]]) return originalFunction(...args);
      const edits = this.editedMessages[args[0]][args[1]];
      args[2] = edits[edits.length - 1].message;
      return originalFunction(...args);
    });
    console.log("NoDeleteMessages has started!");
    BdApi.showToast("NoDeleteMessages has started!");
  }
  stop() {
    this.deletedMessages = {};
    this.editedMessages = [];
    BdApi.clearCSS("NoDeleteMessages-CSS");
    Patcher.unpatchAll(this.getName());
  }
  filter(evt) {
    if (evt.type === "MESSAGE_DELETE") {
      if (Array.isArray(this.deletedMessages[evt.channelId])) {
        if (this.deletedMessages[evt.channelId].length > 149) this.deletedMessages[evt.channelId].shift(); // 150 because only 150 messages are stored per channel.
        this.deletedMessages[evt.channelId].push(evt.id);
      } else {
        this.deletedMessages[evt.channelId] = [evt.id];
      }
      if (evt.channelId === this.getCurrentChannelID()) this.updateDeletedMessages();
      return true;
    } else if (evt.type === "MESSAGE_DELETE_BULK") {
      if (Array.isArray(this.deletedMessages[evt.channelId])) {
        if (this.deletedMessages[evt.channelId].length + evt.ids.length > 149) this.deletedMessages[evt.channelId].splice(0, this.deletedMessages[evt.channelId].length + evt.ids.length - 150);
        this.deletedMessages[evt.channelId].push(...evt.ids);
      } else {
        this.deletedMessages[evt.channelId] = [...evt.ids];
      }
      if (evt.channelId === this.getCurrentChannelID()) this.updateDeletedMessages();
      return true;
    } else if (evt.type === "MESSAGE_UPDATE" && evt.message.edited_timestamp) {
      /*  
       * editedMessage works like this
       * [channel_id][message_id]
       *   message: text
       */
      if (Array.isArray(this.editedMessages[evt.message.channel_id])) {
        if (this.editedMessages[evt.message.channel_id].length > 149) this.editedMessages[evt.message.id].shift();
      }
      if (!this.editedMessages[evt.message.channel_id]) {
        this.editedMessages[evt.message.channel_id] = [evt.message.id];
        this.editedMessages[evt.message.channel_id][evt.message.id] = [{
          message: evt.message.content
        }];
      } else if (!this.editedMessages[evt.message.channel_id][evt.message.id]) {
        this.editedMessages[evt.message.channel_id][evt.message.id] = [{
          message: evt.message.content
        }];
      } else {
        if (this.editedMessages[evt.message.channel_id][evt.message.id].length > 49) {
          this.editedMessages[evt.message.id][evt.message.id].shift() //I think 50 edits is enough no?
        }
        this.editedMessages[evt.message.channel_id][evt.message.id].push({
          message: evt.message.content
        });
      }
      if (evt.message.channel_id === this.getCurrentChannelID()) this.updateEditedMessages();
      return true;
    } /*else if (evt.type === "MESSAGE_CREATE") { // I won't do this
      this.savedMessages.push(evt);
    }*/

    return false;
  }
  observer({
    addedNodes
  }) {
    let len = addedNodes.length;
    let change;
    while (len--) {
      change = addedNodes[len];
      if (change.classList && change.classList.contains("da-messagesWrapper")) {
        this.updateDeletedMessages();
        this.updateEditedMessages();
        break;
      }
    }
  }
  updateDeletedMessages() {
    const channelDeletedMessages = this.deletedMessages[this.getCurrentChannelID()];
    if (!channelDeletedMessages) return;
    $(".da-message").each((index, elem) => {
      try {
        const messageID = ReactUtilities.getOwnerInstance(elem).props.message.id;
        if (channelDeletedMessages.includes(messageID)) {
          elem.classList.add("NoDeleteMessages-deleted-message");
        }
      } catch (e) {}
    });
  }

  updateEditedMessages() {
    const channelEditedMessages = this.editedMessages[this.getCurrentChannelID()];
    if (!channelEditedMessages) return;
    $(".da-markup").each((index, elem) => {
      try {
        const markupClassName = this.findModule("markup")["markup"].split(" ")[0];
        while (elem.getElementsByClassName(markupClassName).length)
          elem.getElementsByClassName(markupClassName)[0].remove();
        const messageID = ReactUtilities.getOwnerInstance(elem).props.message.id;
        if (channelEditedMessages[messageID]) {
          elem.classList.add("NoDeleteMessages-edited-message");
          const edited = this.editedMessages[this.getCurrentChannelID()][messageID];
          const editedClassName = this.findModule("edited")["edited"].split(" ")[0];
          for (let i = 0; i < edited.length; i++) {
            if (!elem.getElementsByClassName(editedClassName).length) {
              elem.insertAdjacentHTML("beforeend", `<time class="${editedClassName}">(edited)</time>`);
            }
            const elementEdited = this.showEdited(edited[i].message);
            elementEdited.classList.add("NoDeleteMessages-edited-message");
            elem.appendChild(elementEdited);
          }
        }
      } catch (e) {}
    });
  }

  showEdited(content) {
    const editText = document.createElement("div");

    const renderFunc = this.findModule("render");
    const createElementFunc = this.findModule("createElement");
    const parserForFunc = this.findModule(["parserFor", "parse"]);
    const editedClassName = this.findModule("edited")["edited"].split(" ")[0];

    renderFunc.render(
      createElementFunc.createElement("div", {
          className: this.findModule("markup")["markup"].split(" ")[0] + " NoDeleteMessages-edited-message"
        },
        parserForFunc.parse(content),
        //TODO: Find a way to implement display time of edit
        createElementFunc.createElement("time", {
            dateTime: new Date().toISOString(),
            className: editedClassName + " da-edited",
            role: "note"
          },
          parserForFunc.parse("(edited)")
        )
      ),
      editText
    );

    return editText;
  }

  findModule(proporties) {
    if (typeof proporties == "string") { //search for an unique property
      return InternalUtilities.WebpackModules.find(module => module[proporties] != undefined);
    } else {//search multiple properties
      return InternalUtilities.WebpackModules.find(module => proporties.every(property => module[property] != undefined));
    }
  }

  getCurrentChannelID() {
    return DiscordModules.SelectedChannelStore.getChannelId();
  }
}

/*
-----BEGIN PGP SIGNATURE-----

iQEzBAEBCgAdFiEEGTGecftnrhRz9oomf4qgY6FcSQsFAlyVsaUACgkQf4qgY6Fc
SQt2+AgAoOB+0/47n6aOdCafohBLJBW/ev8fT09CRyy7n7SI5uS9Xczw0MwdWWuh
1qxGO/B2khWMfc558cq5vmpcGydW3mwy+0iffhUXS180UZXqvjfzzkwXP4mOr/Dt
Y5sLduhGoI8wPHX6f+pxNZ7ASfEXH/kSVZN9HamN78jOVUdsPgqdgZye+QYIL+Ev
X4Kyorgqy001CbdBU3k0IFGi1DP/28krmnv46WGPH9Jl/ux3itGF+MjrUv+U6LoW
FSMmkuJqO6lVhnCwKumR7b6BCCYiyxszceRGwnKi60i74Vr0W50Yku+m5y1xQPzt
v8XJQ0pHZWsr9KRLvnq3w5fUb0H03Q==
=l6IT
-----END PGP SIGNATURE-----
*/
