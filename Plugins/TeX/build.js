const filesToInclude = {
  css: [
    {
      file: "./src/external/katex/katex.css"
    },
    {
      file: "./src/styles.css"
    }
  ],
  js: [
    {
      file: "./src/external/katex/katex.js",
      name: "katex",
      isWebpack: true
    },
    {
      file: "./src/external/katex/contrib/mhchem.js",
      isWebpack: true,
      replace: [
        [
          /require\("katex"\)/g,
          "katex"
        ]
      ]
    }
  ],
  strings: [
    {
      file: "./src/external/tex-icon.svg",
      target: `"<<<<<TEX_ICON>>>>>"`
    }
  ]
};

const inputFile = "./src/TeX.template.js";
const outputFile = "./TeX.plugin.js";

const replaceTargets = {
  css: `"<<<<<CSS>>>>>"`,
  js: `"<<<<<JS>>>>>"`
};

const cssInjectionNamespace = "TeX";

const fs = require("fs");
const path = require("path");

function transformCSS({file}) {
  let css = fs.readFileSync(path.join(__dirname, file), "utf8");
  css = css.replace(/(?<=@font-face\s*\{[\W\w]*?src:\s*)url\((.*?)\).*?(?=;[\W\w]*?\})/gimu, (_, filePath) => {
    filePath = path.join(path.dirname(path.join(__dirname, file)), filePath);
    const fontFile = fs.readFileSync(filePath);
    return `url("data:font/woff2;base64,${fontFile.toString("base64")}") format("woff2")`;
  });
  return css;
}

function transformJS({file, name, isWebpack, replace}) {
  let js = fs.readFileSync(path.join(__dirname, file), "utf8");
  if (Array.isArray(replace)) {
    for (const r of replace) {
      js = js.replace(r[0], r[1]);
    }
  }
  js = js.replace(/\/\/#\s*sourceMappingURL=.+/gu, "");
  if (isWebpack && name) {
    js += `\nconst ${name} = module.exports;\nmodule.exports = undefined;`;
  }
  return js;
}

function transformString({file, keepBase64}) {
  const string = fs.readFileSync(path.join(__dirname, file), "utf8");
  if (keepBase64) {
    return Buffer.from(string).toString("base64");
  }
  return `atob("${Buffer.from(string).toString("base64")}")`
}

let cssToInject = "";
let jsToInject = "";

for (const fileToInclude of filesToInclude.css) {
  cssToInject += transformCSS(fileToInclude) + "\n";
}

for (const fileToInclude of filesToInclude.js) {
  jsToInject += transformJS(fileToInclude) + "\n";
}

const template = fs.readFileSync(path.join(__dirname, inputFile), "utf8");
let output = template
  .split(replaceTargets.css).join(`atob('${Buffer.from(cssToInject).toString("base64")}')`)
  .split(replaceTargets.js).join(jsToInject);
for (const file of filesToInclude.strings) {
  output = output.split(file.target).join(transformString(file));
}
fs.writeFileSync(path.resolve(__dirname, outputFile), output);
if (process.argv[2]) {
  fs.writeFileSync(path.resolve(__dirname, process.argv[2]), output);
}
