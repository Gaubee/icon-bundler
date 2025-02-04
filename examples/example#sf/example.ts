import iconBundler from "../../src/index.ts";
import path from "node:path";
import fs from "node:fs";
import process from "node:process";

import packageJson from "../../package.json" with { type: "json" };

const createResolveTo = (dirname: string) => {
  return (...parts: string[]) => path.resolve(dirname, ...parts);
};

const resolveCwd = createResolveTo(process.cwd());

const resolveDir = createResolveTo(import.meta.dirname);

(async () => {
  const sourceDir = resolveCwd("src/sf-symbols");
  const tmpSrc = resolveDir("svg");
  if (fs.existsSync(tmpSrc)) {
    fs.rmSync(tmpSrc, { recursive: true });
  }
  fs.mkdirSync(tmpSrc, { recursive: true });

  const allNames = fs
    .readdirSync(sourceDir)
    .filter((name) => name.endsWith(".svg"))
    .sort((a, b) => a.localeCompare(b));

  for (const name of allNames) {//["rainbow.svg", "character_book_closed.svg"]
    const targetName = name.replaceAll(".", "_").replace(/_svg$/, ".svg");
    fs.copyFileSync(
      path.join(sourceDir, targetName),
      path.join(tmpSrc, targetName),
    );
  }

  const fontData = await iconBundler({
    src: tmpSrc, // svg path
    dist: resolveDir("dist"), // output path
    fontName: "sficons", // font name
    // css: true, // Create CSS files.
    // outSVGPath: true,
    excludeFormat: ["eot", "woff", "ttf"],
    useNameAsUnicode: false,
    emptyDist: true,
    svgicons2svgfont: {
      usePathBounds: false,
      normalize: false,
      fontHeight: 200,
      centerVertically: true,
      centerHorizontally: true,
    },
    website: {
      title: "Icons Bundler",
      links: [
        {
          title: "Font Class",
          url: "index.html",
        },
        {
          title: "Symbol",
          url: "symbol.html",
        },
        {
          title: "Unicode",
          url: "unicode.html",
        },
      ],
      footerInfo: `Licensed under MIT. (Yes it\'s free and <a href="${packageJson.repository.url}">open-sourced</a>)`,
    },
  });
  // console.log(fontData);
  console.log("done!");
})();
