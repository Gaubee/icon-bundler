import iconBundler from "../../src/index.ts";
import path from "node:path";
import fs from "node:fs";
import process from "node:process";
import { map_get_or_put } from "@gaubee/util";

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

  let count = 0;
  const multiLayerColors = new Map<string, number>();
  for (const name of fs.readdirSync(sourceDir)) {
    if (name.endsWith(".svg")) {
      const targetName = name.replaceAll(".", "_").replace(/_svg$/, ".svg");
      const svgCode = fs.readFileSync(path.join(sourceDir, name), "utf-8");
      fs.writeFileSync(
        path.join(tmpSrc, targetName),
        svgCode
          .replace(/<\?xml [\w\W]+?svg11.dtd">/, "")
          .replace(/fill="(.+?)"/g, (fillAttr, color) => {
            const colorIndex = map_get_or_put(
              multiLayerColors,
              color,
              () => multiLayerColors.size,
            );
            return `style="fill:var(--color-${colorIndex}, ${colorIndex === 0 ? "currentColor" : color})"`;
          })
          .replace(/<rect [^>]+?><\/rect>/, (rect) => {
            if (rect.includes('opacity="0"')) {
              return "";
            }
            return rect;
          })
          .replace(/<rect [^>]+?\/>/, (rect) => {
            if (rect.includes('opacity="0"')) {
              return "";
            }
            return rect;
          }),
      );
      count++;
    }
    if (count > 1000) {
      break;
    }
  }
  console.log("multiLayerColors", multiLayerColors);

  const fontData = await iconBundler({
    src: tmpSrc, // svg path
    dist: resolveDir("dist"), // output path
    fontName: "sficons", // font name
    css: true, // Create CSS files.
    // outSVGPath: true,
    useNameAsUnicode: true,
    emptyDist: true,
    svgicons2svgfont: {
      // centerVertically: true,
      // centerHorizontally: true,
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
