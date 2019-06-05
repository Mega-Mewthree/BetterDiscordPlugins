//META{"name":"NoDeleteMessages","website":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/AutoStartRichPresence","source":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/AutoStartRichPresence/AutoStartRichPresence.plugin.js"}*//

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

// Updated June 4th, 2019.

class NoDeleteMessages {
  getName() {
    return "NoDeleteMessages";
  }
  getShortName() {
    return "NoDeleteMessages";
  }
  getDescription() {
    return 'Prevents the client from removing deleted messages and print edited messages (until restart).\nUse the CSS setting of this plugin to edit the CSS of deleted messages (BD\'s Custom CSS will NOT work), using "<DELETED_MESSAGE>" as the selector for a deleted message. This selector is applied to the element containing the message-xxxxxx class that is a deleted message. Example usage of CSS: "<DELETED_MESSAGE> { background: rgba(255, 0, 0, 0.1); }"\n\nMy Discord server: https://join-nebula.surge.sh\nDM me @Lucario ☉ ∝ x²#7902 or create an issue at https://github.com/Mega-Mewthree/BetterDiscordPlugins for support.';
  }
  getVersion() {
    return "0.2.0";
  }
  getAuthor() {
    return "Mega_Mewthree (original), ShiiroSan (edit logging)";
  }
  constructor() {
    this.deletedMessages = {};
    this.editedMessages = {};
    this.CSSID = this.generateRandomString(33);
    this.customCSSID = this.generateRandomString(32);
    this.deletedMessageClassName = `message-${this.generateRandomString(7)}`;
    this.editedMessageClassName = `messageCozy-${this.generateRandomString(7)}`;
    this.settings = {};
    //this.savedMessages = [];
  }
  load() {}
  unload() {}
  start() {
    //TODO: Patch this
    if (!global.ZeresPluginLibrary) return window.BdApi.alert("Library Missing",`The library plugin needed for ${this.getName()} is missing.\n\nPlease download ZeresPluginLibrary here: https://betterdiscord.net/ghdl?id=2252`);
    if (window.ZeresPluginLibrary) this.initialize();
  }
  initialize() {
    this.settings = BdApi.loadData("NoDeleteMessages", "settings") || {customCSS: ""};
    ZeresPluginLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), `https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordPlugins/master/Plugins/${this.getName()}/${this.getName()}.plugin.js`);

    BdApi.injectCSS(this.CSSID, `
      .${this.deletedMessageClassName} .da-markup{
        color: #F00 !important;
      }
      .${this.deletedMessageClassName}:not(:hover) img, .${this.deletedMessageClassName}:not(:hover) .mention, .${this.deletedMessageClassName}:not(:hover) .reactions, .${this.deletedMessageClassName}:not(:hover) a {
        filter: grayscale(100%) !important;
      }
      .${this.deletedMessageClassName} img, .${this.deletedMessageClassName} .mention, .${this.deletedMessageClassName} .reactions, .${this.deletedMessageClassName} a {
        transition: filter 0.3s !important;
      }
      .${this.editedMessageClassName} > .${this.editedMessageClassName}:not(:last-child) > .${this.editedMessageClassName}, :not(.${this.editedMessageClassName}) > .${this.editedMessageClassName} {
        color: rgba(255, 255, 255, 0.5) !important;
      }
      .${this.deletedMessageClassName} :not(.${this.editedMessageClassName}) > .${this.editedMessageClassName}, .${this.deletedMessageClassName} .${this.editedMessageClassName} > .${this.editedMessageClassName}:not(:last-child) > .${this.editedMessageClassName} {
        color: rgba(240, 71, 71, 0.5) !important;
      }
      .${this.deletedMessageClassName} .${this.editedMessageClassName} > .${this.editedMessageClassName}:last-child > .${this.editedMessageClassName} {
        color: #F00 !important;
      }
    `);

    BdApi.injectCSS(this.customCSSID, this.settings.customCSS.replace(/<DELETED_MESSAGE>/g, `.${this.deletedMessageClassName}`));

    ZeresPluginLibrary.Patcher.instead(this.getName(), ZeresPluginLibrary.WebpackModules.find(m => m.dispatch), "dispatch", (thisObject, args, originalFunction) => {
      let shouldFilter = this.filter(args[0]);
      if (!shouldFilter) return originalFunction(...args);
    });
    ZeresPluginLibrary.Patcher.instead(this.getName(), ZeresPluginLibrary.WebpackModules.find(m => m.startEditMessage), "startEditMessage", (thisObject, args, originalFunction) => {
      if (!this.editedMessages[args[0]] || !this.editedMessages[args[0]][args[1]]) return originalFunction(...args);
      const edits = this.editedMessages[args[0]][args[1]];
      args[2] = edits[edits.length - 1].message;
      return originalFunction(...args);
    });
    console.log("NoDeleteMessages has started!");
    ZeresPluginLibrary.Toasts.success("NoDeleteMessages has started!");
    this.initialized = true;
  }
  stop() {
    this.deletedMessages = {};
    this.editedMessages = {};
    BdApi.clearCSS(this.CSSID);
    BdApi.clearCSS(this.customCSSID);
    ZeresPluginLibrary.Patcher.unpatchAll(this.getName());
  }
  generateRandomString(length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
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
          message: evt.message.content,
          dateTime: new Date().toISOString()
        }];
      } else if (!this.editedMessages[evt.message.channel_id][evt.message.id]) {
        this.editedMessages[evt.message.channel_id][evt.message.id] = [{
          message: evt.message.content,
          dateTime: new Date().toISOString()
        }];
      } else {
        if (this.editedMessages[evt.message.channel_id][evt.message.id].length > 49) {
          this.editedMessages[evt.message.id][evt.message.id].shift() //I think 50 edits is enough no?
        }
        this.editedMessages[evt.message.channel_id][evt.message.id].push({
          message: evt.message.content,
          dateTime: new Date().toISOString()
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
        const messageID = ZeresPluginLibrary.ReactTools.getOwnerInstance(elem).props.message.id;
        if (channelDeletedMessages.includes(messageID)) {
          elem.classList.add(this.deletedMessageClassName);
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
        const messageID = ZeresPluginLibrary.ReactTools.getOwnerInstance(elem).props.message.id;
        if (channelEditedMessages[messageID]) {
          elem.classList.add(this.editedMessageClassName);
          const edited = this.editedMessages[this.getCurrentChannelID()][messageID];
          const editedClassName = this.findModule("edited")["edited"].split(" ")[0];
          for (let i = 0; i < edited.length; i++) {
            const elementEdited = this.showEdited(edited[i].message);

            var timeElement = elementEdited.children[0].children[0];
            var actualDate = new Date();
            var messageEditDate = new Date(edited[i].dateTime);
            var timeEdit = "";
            if (actualDate.toLocaleDateString() == messageEditDate.toLocaleDateString()) {
              timeEdit += "Today at"
            }
            else
            {
              timeEdit += messageEditDate.toLocaleDateString();
            }
            timeEdit += " " + messageEditDate.toLocaleTimeString();
            new ZeresPluginLibrary.EmulatedTooltip(timeElement, timeEdit);

            elementEdited.classList.add(this.editedMessageClassName);
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
          className: this.findModule("markup")["markup"].split(" ")[0] + ` ${this.editedMessageClassName}`
        },
        parserForFunc.parse(content),
        //TODO: Find a way to implement display time of edit
        createElementFunc.createElement("time", {
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

  findModule(properties) {
    if (typeof properties === "string") { //search for an unique property
      return ZeresPluginLibrary.WebpackModules.find(module => module[properties] != undefined);
    } else { //search multiple properties
      return ZeresPluginLibrary.WebpackModules.find(module => properties.every(property => module[property] != undefined));
    }
  }

  getCurrentChannelID() {
    return ZeresPluginLibrary.DiscordModules.SelectedChannelStore.getChannelId();
  }

  updateCustomCSS(css) {
    this.settings.customCSS = css;
    BdApi.clearCSS(this.customCSSID);
    BdApi.injectCSS(this.customCSSID, this.settings.customCSS.replace(/<DELETED_MESSAGE>/g, `.${this.deletedMessageClassName}`));
  }

  updateSettings() {
    BdApi.saveData("NoDeleteMessages", "settings", this.settings);
  }

  getSettingsPanel() {
    if (!this.initialized) return;
    this.settings = BdApi.loadData("NoDeleteMessages", "settings") || {customCSS: ""};
    const panel = $("<form>").addClass("form").css("width", "100%");
		if (this.initialized) this.generateSettings(panel);
		return panel[0];
  }

  generateSettings(panel) {
    new window.ZeresPluginLibrary.Settings.SettingGroup("Configuration", {collapsible: false, shown: true, callback: () => {this.updateSettings();}}).appendTo(panel).append(
      new window.ZeresPluginLibrary.Settings.Textbox("Custom CSS", "Custom CSS that is compatible with this plugin.", "", val => {this.updateCustomCSS(val);})
		);
  }
}

/*
-----BEGIN PGP SIGNATURE-----

iQEzBAEBCgAdFiEEGTGecftnrhRz9oomf4qgY6FcSQsFAlz3PPkACgkQf4qgY6Fc
SQumbggAsNIzrXr+OmnZnJAxbKoCgRKzSF8KrTTG+4l/gxfeuHReYZ1fAeGrZEiL
6grBY8BoKAPswAy1wHTYL3GehKB8xjVK1JJINo2/jgitojryHluQCa1qORsXFFSn
YgD+RNJzngp/zmDKdH07lZ51zLEkZu2y/akCMwBUAeBISi4y6rnMNuTLfJjBe/z6
3IwkvItsmdRSIXgNjSEsfAFLPSIjm2gEc3uLsJ5ke79X6hmR+FOX/gHJ84+tOsmB
iEOo6K1te/pLYpZXeLt12WgNvfEz8Iyct9b3PKc7iI1k1qh9JK2qtUPZ1lZ/SQiO
PMnh5zSVZnxpY7THtuzw0O4mn53zzw==
=H3Lt
-----END PGP SIGNATURE-----
*/
