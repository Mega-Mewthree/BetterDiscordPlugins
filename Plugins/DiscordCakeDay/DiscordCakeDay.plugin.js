//META{"name":"DiscordCakeDay","website":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Plugins/DiscordCakeDay","source":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Plugins/DiscordCakeDay/DiscordCakeDay.plugin.js"}*//

/*
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

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

// Updated April 27th, 2019.

class DiscordCakeDay {
  getName() {
    return "DiscordCakeDay";
  }
  getShortName() {
    return "DiscordCakeDay";
  }
  getDescription() {
    return 'Displays a cake next to the username of anyone whose account is having a Discord birthday! (Currently only displays in chat and member list.)\nRequires "Normalize Classes" to be enabled in Zere\'s Fork settings.\nOptional Dependency: ZeresPluginLibrary (for update checks and banner)\n\nCSS Selectors:\n  \u2022 discord-cake-day-message: A message-group that contains a cake.\n  \u2022 discord-cake-day-message-cake: A cake inside a message.\n  \u2022 discord-cake-day-member: A member in the member list that has a cake.\n  \u2022 discord-cake-day-member-cake: A cake in the member list.\n\nMy Discord server: https://nebula.mooo.info/discord-invite\nDM me @Lucario ☉ ∝ x²#7902 or create an issue at https://github.com/Mega-Mewthree/BetterDiscordPlugins for support.';
  }
  getVersion() {
    return "0.1.4";
  }
  getAuthor() {
    return "Mega_Mewthree";
  }
  constructor() {}
  load() {}
  unload() {}
  start() {
    ZeresPluginLibrary && ZeresPluginLibrary.PluginUpdater && typeof ZeresPluginLibrary.PluginUpdater.checkForUpdate === "function" && ZeresPluginLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), `https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordPlugins/master/Plugins/${this.getName()}/${this.getName()}.plugin.js`);
    BdApi.injectCSS("DiscordCakeDay-CSS", `.discord-cake-day-message-cake, .discord-cake-day-member-cake {display: inline-block; height: 16px; width: 16px; min-width: 16px; min-height: 16px; margin-left: 6px; vertical-align: middle; background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAADH0lEQVRYw+2WTUycVRSGn3Pu5eMbJghSqT8sqjbtwnSjiUbSxJgmtli70Oh0ogmVuKldGN24MMaFGzcu0E50ZxxhYUpNdQH+Ld0qmlCMqa1aQEQLM8wMA8zP993rAqVkLIoRJ5rw7m7uzXnfe857Tg7sYAf/VRwbOMuxgbObnptG/tCTIy8fPXHm7sb77YJcixyQ0WzKHz1x5tMwkXwgdo7q6nJdVV8XOD02lJ7Z+H40m9oeAQ3k54LW5CO9hw5yiy0zOe+YufA9S6UcURTNqkjGeTf40fDjtX8iRjYhf9sGyYGTT/e5wyMvKh+M4J95nuHbn2DifI56tUwhP09xMYf3/ktRyYy9k842fmYrYuQa5G8FQfhU35Fel3q0W4PHjmMnv6La9zB+8FXee/9nvr60hDGKiFAuFcjnrlAuFUH4RJDM2FB6rNEvm4mRBvI3wzA81XPrHZw8voeuDotLCnjAg67CT/MVsuemCFp0LYAIImuJLCwusJhfYLm8hKoOA5kPh9Kf/1lW7AbyN8IwPLV3/wEq1Yi5hQo33tBOfQW8BxEIAsgXa6hctY73Hu89AB2du+js6sbFEfmF+f5CYaH/wf536yKaETg9mk1NNYqR31rtlTCReGHvvgM4FwNQqzsO3dvN/tvaubnbcHm2xvhkgYkLRYIWxf9VXUUwaqhUVijk1zITx9GciGSAwdFsqvJ7CZ51zr3Wfl2nExHdGCiOPfXY4WKwRrBWUJW/3WgiYIylVMwTRREAqnoRuMt654507dpNoq1Nvd9KQL/VkfIHJNraAEFVmZud2hfHcY/1+MgGCVoTneu1/LehxgLTgHe2VnccPribe+7cQ+xcUwQkE5bnXjpPqeqxKsKVXJVL08u4JgkIW1twHlTAWitMfFvkhzmDpzklMGqIYo9RwQKoCMaA99IcAUbW7Wy9h2TCcH1HQJM8iLVmvWdstebou+8m7u/tIY6bIyAZQnp8nJVVh20NlI8/+4UvvomamoFq3dFiFSsgq1VPqeybZ0JzdeBaNcb9OP0dM1MXm7dwejDWoqq1bd/x/neb9w528CtJD20wscn0EwAAAABJRU5ErkJggg=='); background-size: 16px;}`);
    BdApi.showToast("DiscordCakeDay has started!");
  }
  stop() {
    BdApi.clearCSS("DiscordCakeDay-CSS");
  }
  observer({addedNodes}) {
    let len = addedNodes.length;
    let change;
    const now = new Date();
    const dayNow = now.getDate();
    const monthNow = now.getMonth();
    const yearNow = now.getFullYear();
    while (len--){
      change = addedNodes[len];
      if (change.classList) {
        if (change.classList.contains("da-container")) {
          try {
            const userNode = change.children[0].children[0];
            if (!userNode.className.match("header")) continue;
            const userID = userNode[Object.keys(userNode).find(k => k.startsWith("__reactInternalInstance"))].child.memoizedProps.user.id;
            const userBirthday = new Date(parseInt(parseInt(userID).toString(2).padStart(64, "0").slice(0, 42), 2) + 1420070400000);
            let birthday = userBirthday.getDate();
            let birthmonth = userBirthday.getMonth();
            let birthyear = userBirthday.getFullYear();
            if (birthmonth === 1 && birthday === 29 && new Date(yearNow, 1, 29).getDate() !== 29) {
              // Birthday is on leap day, current year does not have leap day
              birthday = 28;
            }
            if (birthday === dayNow && birthmonth === monthNow && birthyear !== yearNow) {
              const target = userNode.children[1];
              const span = document.createElement("span");
              span.classList.add("discord-cake-day-message-cake");
              target.insertBefore(span, target.children[0].nextSibling);
              change.classList.add("discord-cake-day-message");
            }
            continue;
          } catch (e) {}
        }
        if (change.classList.contains("da-messagesWrapper")) {
          this.updateAllMessages();
          break;
        }
        if (change.classList.contains("da-member")) {
          try {
            const userNode = change.children[0].children[1];
            if (!userNode.classList.contains("da-memberInner")) continue;
            const userID = userNode[Object.keys(userNode).find(k => k.startsWith("__reactInternalInstance"))].child.memoizedProps.user.id;
            const userBirthday = new Date(parseInt(parseInt(userID).toString(2).padStart(64, "0").slice(0, 42), 2) + 1420070400000);
            let birthday = userBirthday.getDate();
            let birthmonth = userBirthday.getMonth();
            let birthyear = userBirthday.getFullYear();
            if (birthmonth === 1 && birthday === 29 && new Date(yearNow, 1, 29).getDate() !== 29) {
              // Birthday is on leap day, current year does not have leap day
              birthday = 28;
            }
            if (birthday === dayNow && birthmonth === monthNow && birthyear !== yearNow) {
              const target = change.children[0].children[1].children[0];
              const span = document.createElement("span");
              span.classList.add("discord-cake-day-member-cake");
              target.insertBefore(span, target.children[0].nextSibling);
              change.classList.add("discord-cake-day-member");
            }
            continue;
          } catch (e) {}
        }
      }
    }
  }
  updateAllMessages() {
    const now = new Date();
    const dayNow = now.getDate();
    const monthNow = now.getMonth();
    const yearNow = now.getFullYear();
    $(".da-container").each((index, elem) => {
      try {
        const userNode = elem.children[0].children[0];
        if (!userNode.className.match("header")) return;
        const userID = userNode[Object.keys(userNode).find(k => k.startsWith("__reactInternalInstance"))].child.memoizedProps.user.id;
        const userBirthday = new Date(parseInt(parseInt(userID).toString(2).padStart(64, "0").slice(0, 42), 2) + 1420070400000);
        let birthday = userBirthday.getDate();
        let birthmonth = userBirthday.getMonth();
        let birthyear = userBirthday.getFullYear();
        if (birthmonth === 1 && birthday === 29 && new Date(yearNow, 1, 29).getDate() !== 29) {
          // Birthday is on leap day, current year does not have leap day
          birthday = 28;
        }
        if (birthday === dayNow && birthmonth === monthNow && birthyear !== yearNow) {
          const target = userNode.children[1];
          const span = document.createElement("span");
          span.classList.add("discord-cake-day-message-cake");
          target.insertBefore(span, target.children[0].nextSibling);
          elem.classList.add("discord-cake-day-message");
        }
      } catch (e) {}
    });
  }
}

/*
-----BEGIN PGP SIGNATURE-----

iQEzBAEBCgAdFiEEGTGecftnrhRz9oomf4qgY6FcSQsFAlzDsW8ACgkQf4qgY6Fc
SQuHoQgAu7qfNEhOjFhddHvbaB38SgKJ8th1x9mxHu+kDsWvsCJVGJaZWfOipQlw
3OPpBukv/ItEC/OrR0r8shuqrvRXFEmBzavYLtlKRx36SrSk7SGlvtg/JXAlHp2J
VCj/WKCoQjGgnl9xHwpIujcGwLK17mxwvEY+Zk2HqRdpZO0cWMNB0gAuFWPGDJzj
DHfenKm3v5l7GTzpDg3X+akBN0RuQJ8Rchl5aG2Wfx7dUb5XoAiJdkP1sdldjCR/
FR5CYxt31I57eHBneCfpCinvvdQclYCkEShN5HaJVl2IoaFRnuDuVI4q3lC8PsP3
buFNKJZnVxSMy1+zzU+C34H3HEgBFA==
=huGG
-----END PGP SIGNATURE-----
*/
