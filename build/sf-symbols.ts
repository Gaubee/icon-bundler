import path from "node:path";
import fs from "node:fs";
import process from "node:process";
import ora from "ora";
import Color from "color";

import { Cheerio, load } from "cheerio";
import type { Element } from "domhandler";

const resolveTo = (() => {
  const dirname = process.cwd();
  return (...parts: string[]) => path.resolve(dirname, ...parts);
})();

(async () => {
  const spinner = ora("Processing sf symbols").start();
  const resColorfulDir = resolveTo("res/sf-symbols-colorful");
  // const resPaletteDir = resolveTo("res/sf-symbols-palette");
  const outDir = resolveTo("src/sf-symbols");
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true });
  }
  fs.mkdirSync(outDir, { recursive: true });

  const allFiles = fs
    .readdirSync(resColorfulDir)
    .filter((n) => n.endsWith(".svg"));
  for (const [index, name] of allFiles.entries()) {
    spinner.text = `Processing(${index + 1}/${allFiles.length}) ${name}`;
    if (!name.endsWith(".svg")) {
      continue;
    }
    const colorfulSvgCode = await fs.promises.readFile(
      path.join(resColorfulDir, name),
      "utf-8",
    );
    // const paletteSvgCode = await fs.promises.readFile(
    //   path.join(resPaletteDir, name),
    //   "utf-8",
    // );
    const colorfulSvg$ = load(colorfulSvgCode);
    // const paletteSvg$ = load(paletteSvgCode);
    const colorfulSvgNode = colorfulSvg$("svg");
    // const paletteSvgNode = paletteSvg$("svg");

    /// 移除不必要的 rect，这是用来支撑图标的，使用viewBox的信息可以做替代
    colorfulSvgNode.find("rect").map((_i, ele) => {
      const ele$ = colorfulSvg$(ele);
      if ("0" === ele$.attr("opacity")) {
        ele$.remove();
      }
    });

    const getFillColor = (ele$: Cheerio<Element>) => {
      const fill = ele$.attr("fill");
      if (!fill) {
        return;
      }
      let color = Color(fill);
      const fillOpacity = ele$.attr("fill-opacity");
      if (fillOpacity) {
        color = Color("transparent").mix(color, +fillOpacity);
      }
      return {
        fill,
        fillOpacity,
        color,
        toString() {
          if (fillOpacity) {
            const hsla = color
              .hsl()
              .array()
              .map((v) => v.toFixed(2).replace(/[\.0]+$/, "") || "0");
            if (hsla.length === 4) {
              return `hsl(${hsla.slice(0, 3).join(" ")}/${hsla[3]})`;
            }
            return `hsl(${hsla.join(" ")})`;
          }
          return fill;
        },
      };
    };
    /// 处理 path 的 fill 和 fill-opacity，统一成 style="fill:var(--color-name,defaultColor)"
    colorfulSvgNode.find("path").map((index, ele) => {
      const ele$ = colorfulSvg$(ele);
      const fillColor = getFillColor(ele$);
      if (!fillColor) {
        return;
      }
      ele$.removeAttr("fill");
      ele$.removeAttr("fill-opacity");

      const colorVarName = `--color-${index}`;

      ele$.attr("style", `fill:var(${colorVarName},${fillColor.toString()})`);
    });

    const targetName = name.replaceAll(".", "_").replace(/_svg$/, ".svg");
    await fs.promises.writeFile(
      path.join(outDir, targetName),
      colorfulSvgNode.prop("outerHTML") ?? "",
    );
  }
  spinner.text = `Done!`;
  spinner.stop();
})();
