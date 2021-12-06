/**
 * @name TeX
 * @version 1.0.0
 *
 * @author Lucario ☉ ∝ x²#7902
 * @authorId 438469378418409483
 * @description Create and send TeX math equations. Uses the KaTeX rendering engine.
 * Required dependency: ZeresPluginLibrary
 *
 * DM the author or create an issue for support.
 *
 * @updateUrl https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordPlugins/master/Plugins/TeX/TeX.plugin.js
 * @invite ZYND2Xd
 * @authorLink https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/TeX
 * @source https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/TeX
 * @website https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/TeX
 * @donate https://www.buymeacoffee.com/lucariodev
 */
/*
MIT License

Copyright (c) 2021 Mega-Mewthree

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

// Created June 22nd, 2021.

"<<<<<JS>>>>>"

const version = "1.0.0";

const css = "<<<<<CSS>>>>>";
const texIconSVG = "<<<<<TEX_ICON>>>>>";

const React = BdApi.React;

class TeXModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.textboxRef = React.createRef();
    this.katexRef = React.createRef();
    this.state = {
      texInput: typeof props.initialValue === "string" ? props.initialValue : ""
    };
  }
  componentDidMount() {
    this.disableSpellcheck();
    katex.render(this.state.texInput, this.katexRef.current, {
      throwOnError: false,
      strict: false,
      trust: true
    });
  }
  componentDidUpdate() {
    this.disableSpellcheck();
  }
  disableSpellcheck() {
    const textbox = BdApi.ReactDOM.findDOMNode(this.textboxRef.current).querySelector("textarea");
    textbox.setAttribute("autocomplete", "off");
    textbox.setAttribute("autocorrect", "off");
    textbox.setAttribute("autocapitalize", "off");
    textbox.setAttribute("spellcheck", "false");
  }
  render() {
    return React.createElement("div", null, React.createElement(BdApi.findModuleByDisplayName("TextArea"), {
      ref: this.textboxRef,
      value: this.state.texInput,
      rows: 8,
      onChange: val => {
        this.setState({
          texInput: val
        });
        katex.render(val, this.katexRef.current, {
          throwOnError: false,
          strict: false,
          trust: true
        });
        this.props?.onUpdate?.(val);
      }
    }), React.createElement("div", {
      className: "BD-TeX-plugin",
      ref: this.katexRef
    }));
  }
}

function createTeXButton({onClick}) {
  const ButtonData = ZeresPluginLibrary.DiscordModules.ButtonData;
  const {button, contents, grow} = ZeresPluginLibrary.WebpackModules.find(m => m.button && m.grow);
  const discordButton = ZeresPluginLibrary.WebpackModules.getByProps("icon", "hoverScale");
  const texButton = document.createElement("button");
  texButton.classList.add(ButtonData.ButtonColors.BRAND, ButtonData.ButtonLooks.BLANK, button, grow, "BD-TeX-plugin-button");
  const div = document.createElement("div");
  div.classList.add(ZeresPluginLibrary.DiscordClasses.Textarea.button, discordButton.button, contents);
  const innerDiv = document.createElement("div");
  innerDiv.classList.add(discordButton.buttonWrapper);
  innerDiv.innerHTML = texIconSVG.trim();
  const svg = innerDiv.firstElementChild;
  svg.classList.add(discordButton.icon, "BD-TeX-plugin-button-icon");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 512 512");
  innerDiv.append(svg);
  div.append(innerDiv);
  texButton.append(div);
  texButton.onclick = onClick;
  return texButton;
}

class TeX {
  constructor() {
    this.settings = {};
    this.texInput = "";
    this.canvas = document.createElement("canvas");
    this.texButton = null;
  }
  async start() {
    if (typeof ZeresPluginLibrary === "undefined") {
      try {
        await this.askToDownloadZeresPluginLibrary();
        // Wait for ZeresPluginLibrary to load if it didn't load yet
        while (typeof ZeresPluginLibrary === "undefined") {
          await this.delay(500);
        }
      } catch (e) {
        console.error(`${this.constructor.name}: `, e);
        return BdApi.showToast(`${this.constructor.name}: "ZeresPluginLibrary" was not downloaded, or the download failed. This plugin cannot start.`, {type: "error"});
      }
    }
    BdApi.injectCSS(this.constructor.name, css);
    ZeresPluginLibrary.Patcher.after(this.constructor.name, ZeresPluginLibrary.WebpackModules.getByProps("instantBatchUpload"), "upload", () => {
      this.texInput = "";
    });
    this.texButton = createTeXButton({
      onClick: () => this.showTeXModal()
    });
    ZeresPluginLibrary?.PluginUpdater?.checkForUpdate?.(this.constructor.name, version, `https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordPlugins/master/Plugins/${this.constructor.name}/${this.constructor.name}.plugin.js`);
    BdApi.showToast(`${this.constructor.name} has started!`);
    const Textarea = ZeresPluginLibrary.DiscordClasses.Textarea;
    while (!document.querySelector(`.${Textarea.channelTextArea} .${Textarea.buttons}`)) {
      await this.delay(500);
    }
    this.injectButton();
  }
  stop() {
    this.texButton?.remove?.();
    BdApi.clearCSS(this.constructor.name);
    ZeresPluginLibrary?.Patcher?.unpatchAll?.(this.constructor.name);
    BdApi.showToast(`${this.constructor.name} has stopped!`);
  }
  onSwitch() {
    this.injectButton();
  }
  showTeXModal() {
    BdApi.showConfirmationModal(
      "TeX Input",
      React.createElement(TeXModal, {
        initialValue: this.texInput,
        onUpdate: val => this.texInput = val
      }),
      {
        confirmText: "Attach",
        onConfirm: async () => {
          if (this.texInput.length) {
            const blob = await this.generateTeXImage();
            this.attachImage(blob);
          }
        }
      }
    );
  }
  async htmlToCanvas(html, canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
    if (!this.svgDocument) {
      this.svgDocument = document.implementation.createHTMLDocument();
      this.svgDocument.write(html);
      this.svgDocument.close();
      this.svgDocument.documentElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      this.svgDocument.body.setAttribute("style", "margin:0");
    } else {
      this.svgDocument.body.innerHTML = html;
    }
    const serialized = new XMLSerializer().serializeToString(this.svgDocument.body).replace(/#/g, "%23");
    const svgData = `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="100%" height="100%"><style>body{margin:0;}</style>${serialized}</foreignObject></svg>`;
    const image = new Image();
    image.src = svgData;
    await image.decode();
    canvas.getContext("2d").drawImage(image, 0, 0);
  }
  async generateTeXImage() {
    const renderTarget = document.createElement("div");
    renderTarget.classList.add("BD-TeX-plugin");
    renderTarget.classList.add("BD-TeX-plugin-image-render");
    katex.render(this.texInput, renderTarget, {
      throwOnError: false,
      strict: false,
      trust: true
    });
    document.body.append(renderTarget);
    const html = `<style type="text/css">${css}</style>` + renderTarget.outerHTML;
    const rect = renderTarget.getBoundingClientRect();
    // Fix some issues with non-integer widths
    rect.width = Math.ceil(rect.width) + renderTarget.querySelector(".katex-html").children.length - 1;
    rect.height = Math.ceil(rect.height);
    renderTarget.parentNode.removeChild(renderTarget);
    await this.htmlToCanvas(html, this.canvas, rect.width, rect.height);
    return new Promise((resolve, reject) => {
      try {
        this.canvas.toBlob(blob => resolve(blob), "image/png");
      } catch (e) {
        reject(e);
      }
    });
  }
  attachImage(blob) {
    const fileList = [
      new File([blob], `tex-output-${Date.now()}.png`, {
        type: "image/png"
      })
    ];
    BdApi.findModuleByProps("promptToUpload").promptToUpload(
      fileList,
      ZeresPluginLibrary.ReactTools.getOwnerInstance(document.querySelector(':-webkit-any([class*=" uploadArea-"], [class^="uploadArea-"])')).props.channel,
      false,
      true
  );
  }
  injectButton() {
    const Textarea = ZeresPluginLibrary.DiscordClasses.Textarea;
    const buttonsContainer = document.querySelector(`.${Textarea.channelTextArea} .${Textarea.buttons}`);
    if (!buttonsContainer || buttonsContainer.getElementsByClassName("BD-TeX-plugin-icon").length) return;
    buttonsContainer.prepend(this.texButton);
  }
  askToDownloadZeresPluginLibrary() {
    return new Promise((resolve, reject) => {
      BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${this.constructor.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
          require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
            if (error) {
              console.error(`${this.constructor.name}: `, e);
              require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
              return reject();
            }
            try {
              await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
              resolve();
            } catch (e) {
              console.error(`${this.constructor.name}: `, e);
              reject();
            }
          });
        },
        onCancel: reject
      });
    });
  }
  delay(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}

module.exports = TeX;
