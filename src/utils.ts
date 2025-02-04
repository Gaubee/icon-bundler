import { merge } from "auto-config-loader";
import { load } from "cheerio";
import color from "colors-cli";
import fs, { ReadStream } from "fs-extra";
import { Buffer } from "node:buffer";
import path from "node:path";
import process from "node:process";
import nunjucks from "nunjucks";
import React from "react";
import ReactDOMServer from "react-dom/server";
import svg2ttf from "svg2ttf";
import { SVGIcons2SVGFontStream } from "svgicons2svgfont";
import ttf2eot from "ttf2eot";
import ttf2woff from "ttf2woff";
import ttf2woff2 from "ttf2woff2";
import { type SvgToFontOptions } from "./index.ts";
import { log } from "./log.ts";
import { IconPageProps, WebsiteTemplate } from "./website/index.tsx";

let UnicodeObj: Record<string, string> = {};
/**
 * Unicode Private Use Area start.
 * https://en.wikipedia.org/wiki/Private_Use_Areas
 */
let startUnicode = 0xea01;

/**
 * SVG to SVG font
 */
export function createSVG(
  options: SafeSvgToFontOptions,
): Promise<Record<string, string>> {
  startUnicode = options.startUnicode ?? startUnicode;
  UnicodeObj = {};
  const fontStream = new SVGIcons2SVGFontStream({
    ...options.svgicons2svgfont,
  });

  function writeFontStream(svgPath: string) {
    // file name
    let _name = path.basename(svgPath, ".svg");
    const glyph = fs.createReadStream(svgPath) as ReadStream & {
      metadata: { unicode: string[]; name: string };
    };

    const curUnicode = String.fromCharCode(startUnicode);
    const [_curUnicode, _startUnicode] = options.getIconUnicode
      ? options.getIconUnicode(_name, curUnicode, startUnicode) || [curUnicode]
      : [curUnicode];

    if (_startUnicode) startUnicode = _startUnicode;

    const unicode: string[] = [_curUnicode];
    if (
      curUnicode === _curUnicode &&
      (!_startUnicode || startUnicode === _startUnicode)
    )
      startUnicode++;

    UnicodeObj[_name] = unicode[0];
    if (!!options.useNameAsUnicode) {
      unicode[0] = _name;
      UnicodeObj[_name] = _name;
    }
    glyph.metadata = { unicode, name: _name };
    fontStream.write(glyph);
  }

  const DIST_PATH = path.join(options.dist, options.fontName + ".svg");
  const job = Promise.withResolvers<typeof UnicodeObj>();
  // Setting the font destination
  fontStream
    .pipe(fs.createWriteStream(DIST_PATH))
    .on("finish", () => {
      log.log(
        `${color.green("SUCCESS")} ${color.blue_bt(
          "SVG",
        )} font successfully created!\n  ╰┈▶ ${DIST_PATH}`,
      );
      job.resolve(UnicodeObj);
    })
    .on("error", (err) => {
      job.reject(err);
    });
  filterSvgFiles(options.src).forEach((svg: string) => {
    if (typeof svg !== "string") return false;
    writeFontStream(svg);
  });

  // Do not forget to end the stream
  fontStream.end();

  return job.promise;
}

/**
 * Converts a string to pascal case.
 *
 * @example
 *
 * ```js
 * toPascalCase('some_database_field_name'); // 'SomeDatabaseFieldName'
 * toPascalCase('Some label that needs to be pascalized');
 * // 'SomeLabelThatNeedsToBePascalized'
 * toPascalCase('some-javascript-property'); // 'SomeJavascriptProperty'
 * toPascalCase('some-mixed_string with spaces_underscores-and-hyphens');
 * // 'SomeMixedStringWithSpacesUnderscoresAndHyphens'
 * ```
 */
export const toPascalCase = (str: string) =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
    .join("") ?? str;

/*
 * Filter svg files
 * @return {Array} svg files
 */
export function filterSvgFiles(svgFolderPath: string): string[] {
  const files = fs.readdirSync(svgFolderPath, "utf-8");
  const svgArr = [];
  if (!files) {
    throw new Error(`Error! Svg folder is empty.${svgFolderPath}`);
  }

  for (const i in files) {
    if (typeof files[i] !== "string" || path.extname(files[i]) !== ".svg")
      continue;
    if (!~svgArr.indexOf(files[i])) {
      svgArr.push(path.join(svgFolderPath, files[i]));
    }
  }
  return svgArr;
}

export function snakeToUppercase(str: string) {
  return str
    .split(/[-_]/)
    .map((partial) => partial.charAt(0).toUpperCase() + partial.slice(1))
    .join("");
}

export type TypescriptOptions = {
  extension?: "d.ts" | "ts" | "tsx";
  enumName?: string;
};

/**
 * Create typescript declarations for icon classnames
 */
export async function createTypescript(
  options: Omit<SafeSvgToFontOptions, "typescript"> & {
    typescript: TypescriptOptions | true;
  },
) {
  const tsOptions = options.typescript === true ? {} : options.typescript;
  const uppercaseFontName = snakeToUppercase(options.fontName);
  const { extension = "d.ts", enumName = uppercaseFontName } = tsOptions;
  const DIST_PATH = path.join(options.dist, `${options.fontName}.${extension}`);
  const fileNames = filterSvgFiles(options.src).map((svgPath) =>
    path.basename(svgPath, path.extname(svgPath)),
  );
  await fs.promises.writeFile(
    DIST_PATH,
    [
      `export enum ${enumName} {`,
      ...fileNames.map(
        (name) =>
          `  ${snakeToUppercase(name)} = "${options.classNamePrefix}-${name}",`,
      ),
      "}",
      `export type ${enumName}Classname = ${fileNames
        .map((name) => `"${options.classNamePrefix}-${name}"`)
        .join(" | ")}`,
      `export type ${enumName}Icon = ${fileNames
        .map((name) => `"${name}"`)
        .join(" | ")}`,
      `export const ${enumName}Prefix = "${options.classNamePrefix}-"`,
    ].join("\n"),
  );
  log.log(`${color.green("SUCCESS")} Created ${DIST_PATH}`);
}

/**
 * SVG font to TTF
 */
export async function createTTF(
  options: SafeSvgToFontOptions,
): Promise<Buffer> {
  options.svg2ttf = options.svg2ttf || {};
  const DIST_PATH = path.join(options.dist, options.fontName + ".ttf");
  const ttf = svg2ttf(
    fs.readFileSync(path.join(options.dist, options.fontName + ".svg"), "utf8"),
    options.svg2ttf,
  );
  const ttfBuf = Buffer.from(ttf.buffer);
  await fs.promises.writeFile(DIST_PATH, ttfBuf);
  return ttfBuf;
}

/**
 * TTF font to EOT
 */
export async function createEOT(options: SafeSvgToFontOptions, ttf: Buffer) {
  const DIST_PATH = path.join(options.dist, options.fontName + ".eot");
  const eot = Buffer.from(ttf2eot(ttf).buffer);

  await fs.promises.writeFile(DIST_PATH, eot);

  log.log(
    `${color.green("SUCCESS")} ${color.blue_bt(
      "EOT",
    )} font successfully created!\n  ╰┈▶ ${DIST_PATH}`,
  );
  return eot;
}

/**
 * TTF font to WOFF
 */
export async function createWOFF(options: SafeSvgToFontOptions, ttf: Buffer) {
  const DIST_PATH = path.join(options.dist, options.fontName + ".woff");
  const woff = Buffer.from(ttf2woff(ttf).buffer);
  await fs.promises.writeFile(DIST_PATH, woff);
  log.log(
    `${color.green("SUCCESS")} ${color.blue_bt(
      "WOFF",
    )} font successfully created!\n  ╰┈▶ ${DIST_PATH}`,
  );
  return woff;
}

/**
 * TTF font to WOFF2
 */
export async function createWOFF2(options: SafeSvgToFontOptions, ttf: Buffer) {
  const DIST_PATH = path.join(options.dist, options.fontName + ".woff2");
  const woff2 = Buffer.from(ttf2woff2(ttf).buffer);
  await fs.promises.writeFile(DIST_PATH, woff2);
  log.log(
    `${color.green("SUCCESS")} ${color.blue_bt(
      "WOFF2",
    )} font successfully created!\n  ╰┈▶ ${DIST_PATH}`,
  );
  return {
    path: DIST_PATH,
  };
}

/**
 * Create SVG Symbol
 */
export async function createSvgSymbol(options: SafeSvgToFontOptions) {
  const DIST_PATH = path.join(options.dist, `${options.fontName}.symbol.svg`);
  const html = String.raw;
  const $ = load(
    html`<svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="0"
      height="0"
      style="display:none;"
    ></svg>`,
  );
  const rootSvg = $("svg");
  filterSvgFiles(options.src).forEach((svgPath) => {
    const fileName = path.basename(svgPath, path.extname(svgPath));
    const fileContent = fs.readFileSync(svgPath, "utf8");
    const svgNode = load(fileContent)("svg");
    const svgContent = svgNode.html();
    if (svgContent) {
      const symbolNode = $("<symbol></symbol>");
      symbolNode.attr("viewBox", svgNode.attr("viewBox"));
      symbolNode.attr("id", fileName);
      symbolNode.append(svgContent);
      rootSvg.append(symbolNode);
    }
  });

  await fs.promises.writeFile(DIST_PATH, $.html("svg"));

  log.log(
    `${color.green("SUCCESS")} ${color.blue_bt(
      "Svg Symbol",
    )} font successfully created!\n  ╰┈▶ ${DIST_PATH}`,
  );
  return {
    path: DIST_PATH,
    svg: $.html("svg"),
  };
}

export type CSSOptions = {
  /**
   * Output the css file to the specified directory
   */
  output?: string;
  /**
   * Which files are exported.
   */
  include?: RegExp;
  /**
   * Setting font size.
   */
  fontSize?: string | boolean;
  /**
   * Set the path in the css file
   * https://github.com/gaubee/icon-bundler/issues/48#issuecomment-739547189
   */
  cssPath?: string;
  /**
   * Set file name
   * https://github.com/gaubee/icon-bundler/issues/48#issuecomment-739547189
   */
  fileName?: string;
  /**
   * Ad hoc template variables.
   */
  templateVars?: Record<string, any>;
  /**
   * When including CSS files in a CSS file,
   * you can add a timestamp parameter or custom text to the file path to prevent browser caching issues and ensure style updates are applied. @default true
   * @example `path/to/iconfont.css?t=1612345678`
   */
  hasTimestamp?: boolean | string;
};

// As we are processing css files, we need to eacape HTML entities.
const safeNunjucks = nunjucks.configure({ autoescape: false });

/**
 * Copy template files
 */
export async function copyTemplate(
  inDir: string,
  outDir: string,
  { _opts, ...vars }: Record<string, any> & { _opts: CSSOptions },
) {
  const files = await fs.readdir(inDir, { withFileTypes: true });
  const context = {
    ...(_opts.templateVars || {}),
    ...vars,
    cssPath: _opts.cssPath || "",
    filename: _opts.fileName || vars.fontname,
  };
  await fs.ensureDir(outDir);
  for (const file of files) {
    if (!file.isFile()) continue;
    if (_opts.include && !new RegExp(_opts.include).test(file.name)) continue;
    let newFileName = file.name.replace(/\.template$/, "").replace(/^_/, "");
    for (const key in context)
      newFileName = newFileName.replaceAll(
        `{{${key}}}`,
        `${context[key as keyof typeof context]}`,
      );
    const template = await fs.readFile(path.join(inDir, file.name), "utf8");
    const content = safeNunjucks.renderString(template, context);
    const filePath = path.join(outDir, newFileName);
    await fs.promises.writeFile(filePath, content);
    log.log(`${color.green("SUCCESS")} Created ${filePath} `);
  }
}

/**
 * Create HTML
 */
export function createHTML(
  template: WebsiteTemplate,
  props: IconPageProps,
  options?: ReactDOMServer.ServerOptions,
): string {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(template, props),
    options,
  );
}

export function generateFontFaceCSS(
  fontName: string,
  cssPath: string,
  timestamp: number,
  excludeFormat: string[],
  hasTimestamp: boolean | string = true,
): string {
  const timestamString =
    hasTimestamp === true
      ? `?t=${timestamp}`
      : typeof hasTimestamp == "string"
        ? `?t=${hasTimestamp}`
        : undefined;
  const formats = [
    { ext: "eot", format: "embedded-opentype", ieFix: true },
    { ext: "woff2", format: "woff2" },
    { ext: "woff", format: "woff" },
    { ext: "ttf", format: "truetype" },
    { ext: "svg", format: "svg" },
  ];
  let cssString = `  font-family: "${fontName}";\n`;
  if (!excludeFormat.includes("eot")) {
    cssString += `  src: url('${cssPath}${fontName}.eot${
      timestamString || ""
    }'); /* IE9*/\n`;
  }
  cssString += "  src: ";
  const srcParts = formats
    .filter((format) => !excludeFormat.includes(format.ext))
    .map((format) => {
      if (format.ext === "eot") {
        return `url('${cssPath}${fontName}.eot${
          timestamString || "?"
        }#iefix') format('${format.format}') /* IE6-IE8 */`;
      }
      return `url('${cssPath}${fontName}.${format.ext}${
        timestamString || ""
      }') format('${format.format}')`;
    });
  cssString += srcParts.join(",\n  ") + ";";
  return cssString;
}

export const getDefaultOptions = <T extends SvgToFontOptions>(options: T) => {
  return merge(
    {
      dist: path.resolve(process.cwd(), "fonts"),
      src: path.resolve(process.cwd(), "svg"),
      startUnicode: 0xea01,
      svg2ttf: {},
      svgicons2svgfont: {
        fontName: "iconfont",
        fontHeight: 1000,
      },
      fontName: "iconfont",
      symbolNameDelimiter: "-",
    } satisfies SvgToFontOptions,
    options,
  );
};
export type SafeSvgToFontOptions = Awaited<
  ReturnType<typeof getDefaultOptions>
>;
