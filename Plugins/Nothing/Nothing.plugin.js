//META{"name":"Nothing","website":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Plugins/Nothing","source":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/Plugins/Nothing/Nothing.plugin.js"}*//

/*
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA512

*/

/*
MIT License

Copyright (c) 2019 Mega-Mewthree

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

// Created April 1st, 2019.

class Nothing {
  getName() {
    return "Nothing";
  }
  getShortName() {
    return "Nothing";
  }
  getDescription() {
    return 'This plugin does nothing.\n\nMy Discord server: https://join-nebula.surge.sh\nDM me @Lucario ☉ ∝ x²#7902 or create an issue at https://github.com/Mega-Mewthree/BetterDiscordPlugins for support.';
  }
  getVersion() {
    return "0";
  }
  getAuthor() {
    return "Mega_Mewthree"; //Current Discord account: @Lucario ☉ ∝ x²#7902 (438469378418409483)
  }
  constructor() {

  }
  load() {}
  unload() {}
  start() {
    BdApi.showToast("What did you expect this plugin to do?");
  }
  stop() {}
}

/*
-----BEGIN PGP SIGNATURE-----

iQEzBAEBCgAdFiEEGTGecftnrhRz9oomf4qgY6FcSQsFAlyhwdsACgkQf4qgY6Fc
SQtQrAgAwqY6yPSIJyy+vnt4qkeKnSlgDiJ+TMQTovOokYhiehwLX8ORmCuvMH4J
UdracD8E/riZ8TSM5LfL9agftWV47MrwUbchpeAVw7f00wi7AFEon4Ok75YRmImy
wAKkLc/n+Wcz/m8IvcXLUJdLkpfBImTwohj5uUe1rFObXmGm8JRknAPtc/qZWhj8
4MZri5AN1hrgowR5agGt6l7WwcE85sesbI0Nv6IYlI5ao/YzqpVXEKpuqiai/TMQ
m69a54JFQ+LeXudq6DamIpKoMMKjSMHy9dNCq+FegMigIvuERco2rRADaFzYPccf
wou4oWXYW9NiW7ZEqzubHt9mA71lpQ==
=a3Za
-----END PGP SIGNATURE-----
*/
