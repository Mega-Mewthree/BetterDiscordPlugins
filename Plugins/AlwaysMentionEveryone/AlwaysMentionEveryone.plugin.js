//META{"name":"AlwaysMentionEveryone","website":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Plugins/AlwaysMentionEveryone","source":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Plugins/AlwaysMentionEveryone/AlwaysMentionEveryone.plugin.js"}*//

/*
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

*/

/*
MIT License

Copyright (c) 2018 Mega-Mewthree

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

// Created July 19th, 2018.

class AlwaysMentionEveryone {
  getName() {
    return "AlwaysMentionEveryone";
  }
  getShortName() {
    return "AlwaysMentionEveryone";
  }
  getDescription() {
    return 'Discord will no longer confirm if you want to mention everyone in large servers.\nRequires "Normalize Classes" to be enabled in Zere\'s Fork settings.\n\nMy Discord server: https://join-nebula.surge.sh\nDM me @Lucario 🌌 V5.0.0#7902 or create an issue at https://github.com/Mega-Mewthree/BetterDiscordPlugins for support.';
  }
  getVersion() {
    return "0.0.1";
  }
  getAuthor() {
    return "Mega_Mewthree"; //Current Discord account: @Lucario 🌌 V5.0.0#7902 (438469378418409483) Wonder how long this one will last...
  }
  constructor() {

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
    PluginUtilities.checkForUpdate(this.getName(), this.getVersion());
    PluginUtilities.showToast("AlwaysMentionEveryone has started!");
  }
  stop() {

  }
  observer({
    addedNodes
  }) {
    let len = addedNodes.length;
    let change;
    while (len--) {
      change = addedNodes[len];
      if (change.classList) {
        if (change.classList.contains("da-popout") && change.children[0].classList.contains("da-everyonePopout")) {
          return change.children[0].children[0].children[1].children[2].children[1].children[0].click();
        }
      }
    }
  }
}

/*
-----BEGIN PGP SIGNATURE-----

iQEzBAEBCAAdFiEEGTGecftnrhRz9oomf4qgY6FcSQsFAltRfsEACgkQf4qgY6Fc
SQsDbwgAuWrxJ8k5dFi+e+26iS2Gf1+BF3rqKBRbsjOLFFlG6hrqYPBx0BIUjkXn
PH1VztUwF8ibSAhIOl2FYGKQBOYrYIcsIMov9QARcC81ZDqYZ6HOIpfs00OROvtz
eLqPtF4XdaB1uEMZT9N3OmjXQLZMNcmR4z9idUf4VOc/W8k75rBCxWo4Oy+MB2LW
LDoLkSAvpuaNRdsifPikyDNtbj9NcQ+qRmAVqkwTbmKbPxGDc8Fai0Ui5WwSfqKp
gV3gR8KcjkyV2rVp7DanitPSQffJ/x2CxmYh8Vf+EvYIPGsKLos+6MKDVEm9ZUr/
VTImRJ9VvYPjEIbzGBfZFhmEYZge8A==
=nbz3
-----END PGP SIGNATURE-----
*/
