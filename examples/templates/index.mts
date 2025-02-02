import path from "node:path";
import fs from "fs-extra";
import { fileURLToPath } from "node:url";
import iconBundler from "../../src/index.ts";
import process from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = fs.readJSONSync(path.resolve(__dirname, "../../package.json"));

const rootPath = path.resolve(process.cwd(), "examples", "templates");
/**
 * @type {import('../../lib/index.js').SvgToFontOptions}
 */
const options = {
  config: {
    cwd: rootPath,
  },
  src: path.resolve(rootPath, "svg"), // svg path
  dist: path.resolve(rootPath, "dist"), // output path
  // emptyDist: true, // Clear output directory contents
  styleTemplates: path.resolve(rootPath, "styles"),
  fontName: "icon-bundler", // font name
  css: true, // Create CSS files.
  outSVGReact: true,
  outSVGReactNative: true,
  outSVGPath: true,
  startNumber: 20000, // unicode start number
  svgicons2svgfont: {
    fontHeight: 1000,
    normalize: true,
  },
  useCSSVars: true,
  // website = null, no demo html files
  website: {
    // Add a Github corner to your website
    // Like: https://github.com/uiwjs/react-github-corners
    corners: {
      url: "https://github.com/gaubee/icon-bundler",
      width: 62, // default: 60
      height: 62, // default: 60
      bgColor: "#dc3545", // default: '#151513'
    },
    index: "unicode", // Enum{"font-class", "unicode", "symbol"}
    title: "icon-bundler",
    favicon: path.resolve(rootPath, "favicon.png"),
    // Must be a .svg format image.
    logo: path.resolve(rootPath, "svg", "git.svg"),
    version: pkg.version,
    meta: {
      description: "Converts SVG fonts to TTF/EOT/WOFF/WOFF2/SVG format.",
      keywords: "icon-bundler,TTF,EOT,WOFF,WOFF2,SVG",
    },
    description: ``,
    links: [
      {
        title: "GitHub",
        url: "https://github.com/gaubee/icon-bundler",
      },
      {
        title: "Feedback",
        url: "https://github.com/gaubee/icon-bundler/issues",
      },
      {
        title: "Font Class Demo",
        url: "font-class.html",
      },
      {
        title: "Symbol Demo",
        url: "symbol.html",
      },
      {
        title: "Unicode Demo",
        url: "index.html",
      },
    ],
    footerInfo: `Licensed under MIT. (Yes it's free and <a target="_blank" href="https://github.com/gaubee/icon-bundler">open-sourced</a>)`,
  },
};

iconBundler(options).then(() => {
  console.log("done!");
});
