import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import image2uri from "image2uri";
import { type SVGIcons2SVGFontStreamOptions } from "./svgicons2svgfont/index.ts";
import color from "colors-cli";
import { autoConf, merge, type AutoConfOption } from "auto-config-loader";
import type { FontOptions } from "svg2ttf";
import type { Config } from "svgo";
import { log } from "./log.ts";
import {
  generateIconsSource,
  generateReactIcons,
  generateReactNativeIcons,
} from "./generate.ts";
import {
  createSVG,
  createTTF,
  createEOT,
  createWOFF,
  createWOFF2,
  createSvgSymbol,
  copyTemplate,
  type CSSOptions,
  createHTML,
  createTypescript,
  type TypescriptOptions,
} from "./utils.ts";
import { generateFontFaceCSS, getDefaultOptions } from "./utils.ts";
import process from "node:process";
import type { IconPageProps, WebsiteTemplate } from "./website/index.tsx";
import { match, P } from "ts-pattern";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type SvgToFontOptions = {
  /** Support for .icon-bundlerrc and more configuration files. */
  config?: AutoConfOption<SvgToFontOptions>;
  /** A value of `false` disables logging */
  log?: boolean;
  /** log callback function  */
  logger?: (message: string) => void;
  /**
   * The output directory.
   * @default fonts
   * @example
   * ```
   * path.join(process.cwd(), 'fonts')
   * ```
   */
  dist?: string;
  /**
   * svg path
   * @default svg
   * @example
   * ```
   * path.join(process.cwd(), 'svg')
   * ```
   */
  src?: string;
  /**
   * The font family name you want.
   * @default iconfont
   */
  fontName?: string;
  /**
   * Create CSS/LESS/Scss/Styl files, default `true`.
   */
  css?: boolean | CSSOptions;
  /**
   * Output `./dist/react/`, SVG generates `react` components.
   */
  outSVGReact?: boolean;
  /**
   * Output `./dist/reactNative/`, SVG generates `reactNative` component.
   */
  outSVGReactNative?: boolean;
  /**
   * Output `./dist/icon-bundler.json`, The content is as follows:
   * @example
   * ```js
   * {
   *   "adobe": ["M14.868 3H23v19L14.868 3zM1 3h8.8.447z...."],
   *   "git": ["M2.6 10.59L8.38 4.8l1.69 1.7c-.24c-.6.34-1 .99-1..."],
   *   "stylelint": ["M129.74 243.648c28-100.5.816c2.65..."]
   * }
   * ```
   */
  outSVGPath?: boolean;
  /**
   * Output `./dist/info.json`, The content is as follows:
   * @example
   * ```js
   * {
   *    "adobe": {
   *      "encodedCode": "\\ea01",
   *      "prefix": "icon-bundler",
   *      "className": "icon-bundler-adobe",
   *      "unicode": "&#59905;"
   *    },
   *    .....
   * }
   * ```
   */
  generateInfoData?: boolean;
  /**
   * This is the setting for [svgicons2svgfont](https://github.com/nfroidure/svgicons2svgfont/tree/dd713bea4f97afa59f7dba6a21ff7f22db565bcf#api)
   */
  svgicons2svgfont?: Partial<SVGIcons2SVGFontStreamOptions>;
  /** Some options can be configured with svgoOptions though it. [svgo](https://github.com/svg/svgo#configuration) */
  svgoOptions?: Config;
  /**
   * Create font class name prefix, default value font name.
   * @default fontName
   */
  classNamePrefix?: SvgToFontOptions["fontName"];
  /**
   * Symbol Name Delimiter, @default `-`
   */
  symbolNameDelimiter?: string;
  /**
   * Directory of custom templates.
   */
  styleTemplates?: string;
  /**
   * unicode start number
   * @default 10000
   */
  startUnicode?: number;
  /** Get Icon Unicode */
  getIconUnicode?: (
    name: string,
    unicode: string,
    startUnicode: number,
  ) => [string, number];
  /**
   * should the name(file name) be used as unicode? this switch allows for the support of ligatures.
   * @default false
   */
  useNameAsUnicode?: boolean;
  /**
   * consoles whenever {{ cssString }} template outputs unicode characters or css vars
   * @default false
   */
  useCSSVars?: boolean;
  /**
   * Clear output directory contents
   * @default false
   */
  emptyDist?: boolean;
  /**
   * This is the setting for [svg2ttf](https://github.com/fontello/svg2ttf/tree/c33a126920f46b030e8ce960cc7a0e38a6946bbc#svg2ttfsvgfontstring-options---buf)
   */
  svg2ttf?: FontOptions;
  /**
   * You can configure which font files to exclude from generation. By default, all font files will be generated.
   * https://github.com/gaubee/icon-bundler/issues/238
   */
  excludeFormat?: Array<
    "eot" | "woff" | "woff2" | "ttf" | "svg" | "symbol.svg"
  >;
  website?: {
    /**
     * Add a Github corner to your website
     * @like https://github.com/uiwjs/react-github-corners
     */
    corners?: {
      /**
       * @example `https://github.com/gaubee/icon-bundler`
       */
      url?: string;
      /**
       * @default 60
       */
      width?: number;
      /**
       * @default 60
       */
      height?: number;
      /**
       * @default #151513
       */
      bgColor?: "#dc3545";
    };
    /**
     * @default unicode
     */
    index?: "font-class" | "unicode" | "symbol";
    /**
     * website title
     */
    title?: string;
    /**
     * @example
     * ```js
     * path.resolve(rootPath, "favicon.png")
     * ```
     */
    favicon?: string;
    /**
     * Must be a .svg format image.
     * @example
     * ```js
     * path.resolve(rootPath, "svg", "git.svg")
     * ```
     */
    logo?: string;
    version?: string;
    meta?: {
      description?: string;
      keywords?: string;
    };
    description?: string;
    template?:
      | WebsiteTemplate
      | Promise<{ default: WebsiteTemplate }>
      | Promise<WebsiteTemplate>;
    footerInfo?: string;
    links: Array<{
      title: string;
      url: string;
    }>;
  };

  /**
   * Create typescript file with declarations for icon classnames
   * @default false
   */
  typescript?: boolean | TypescriptOptions;
};

export type IconInfo = {
  prefix: string;
  symbol: string;
  unicode: string;
  className: string;
  encodedCode: string | number;
};
export type InfoData = Record<string, Partial<IconInfo>>;

const loadConfig = async <T extends SvgToFontOptions>(options: T) => {
  const defaultOptions = getDefaultOptions(options);
  const data = await autoConf<SvgToFontOptions>("icon-bundler", {
    mustExist: true,
    default: defaultOptions,
    ...options.config,
  });
  return merge(defaultOptions, data);
};

const handlePkgConfig = <T extends SvgToFontOptions>(options: T): T => {
  const pkgPath = path.join(process.cwd(), "package.json");
  if (fs.pathExistsSync(pkgPath)) {
    const pkg = fs.readJSONSync(pkgPath);
    if (pkg.iconBundler) {
      const cssOptions = options.css;
      options = merge(options, pkg.iconBundler);
      if (pkg.iconBundler.css && cssOptions && typeof cssOptions === "object") {
        options.css = merge(cssOptions, pkg.iconBundler.css);
      }
    }
    if (options.website && pkg.version) {
      options.website.version = options.website.version ?? pkg.version;
    }
  }
  return options;
};

export default async (_options: SvgToFontOptions = {}) => {
  const options = handlePkgConfig(await loadConfig(_options));
  if (options.log === undefined) options.log = true;
  log.disabled = !options.log;
  if (options.logger && typeof options.logger === "function")
    log.logger = options.logger;

  options.svgicons2svgfont.fontName = options.fontName;
  options.classNamePrefix = options.classNamePrefix || options.fontName;

  const excludeFormat = options.excludeFormat || [];

  const fontSizeOpt = typeof options.css !== "boolean" && options.css?.fontSize;
  const fontSize =
    typeof fontSizeOpt === "boolean"
      ? fontSizeOpt === true
        ? "font-size: 16px;"
        : ""
      : `font-size: ${fontSizeOpt};`;
  // If you generate a font you need to generate a style.
  if (options.website && !options.css) options.css = true;

  const infoDataPath = path.resolve(options.dist, "info.json");
  try {
    if (options.emptyDist) {
      await fs.emptyDir(options.dist);
    }
    // Ensures that the directory exists.
    await fs.ensureDir(options.dist);
    const unicodeObject = await createSVG(options);

    /** @deprecated */
    let cssToVars: string[] = [];
    let cssString: string[] = [];
    let cssRootVars: string[] = [];
    let cssIconHtml: string[] = [];
    let unicodeHtml: string[] = [];
    let symbolHtml: string[] = [];
    const prefix = options.classNamePrefix || options.fontName;
    const infoData: InfoData = {};
    const html = String.raw;

    Object.keys(unicodeObject).forEach((name, index, self) => {
      if (!infoData[name]) infoData[name] = {};
      const _code = unicodeObject[name];
      let symbolName =
        options.classNamePrefix + options.symbolNameDelimiter + name;
      // let iconPart = symbolName + '">';
      let encodedCodes: string | number = _code.charCodeAt(0);

      if (options.useNameAsUnicode) {
        // symbolName = name;
        // iconPart = prefix + '">' + name;
        encodedCodes = _code
          .split("")
          .map((x) => x.charCodeAt(0))
          .join(";&amp;#");
      }
      cssToVars.push(`$${symbolName}: "\\${encodedCodes.toString(16)}";\n`);
      // if (options.useCSSVars) {
      //   if (index === 0) cssRootVars.push(`:root {\n`);
      //   if (typeof encodedCodes === "number") {
      //     // cssRootVars.push(
      //     //   `--${symbolName}: "\\${encodedCodes.toString(16)}";\n`,
      //     // );

      //   } else {
      //     // cssRootVars.push(`--${symbolName}: "${encodedCodes}";\n`);
      //   }
      //   // cssString.push(
      //   //   `.${symbolName}:before { content: var(--${symbolName}); }\n`,
      //   // );
      //   if (index === self.length - 1) cssRootVars.push(`}\n`);
      // } else {
      //   cssString.push(
      //     `.${symbolName}:before { content: "\\${encodedCodes.toString(
      //       16,
      //     )}"; }\n`,
      //   );
      // }
      cssString.push(
        `[data-icon="${name}"] { --icon-code: "\\${encodedCodes.toString(16)}"; }\n`,
      );

      infoData[name].encodedCode = `\\${encodedCodes.toString(16)}`;
      infoData[name].prefix = prefix;
      infoData[name].className = symbolName;
      infoData[name].unicode = `&#${encodedCodes};`;
      cssIconHtml.push(
        html`<li class="class-icon">
          <i class="${prefix}" data-icon="${name}" data-copy></i>
          <tool-tip class="name">${name}</tool-tip>
        </li>`,
      );
      unicodeHtml.push(
        html`<li class="unicode-icon">
          <span class="${options.fontName}" data-copy>${_code}</span>
          <tool-tip class="name">${name}</tool-tip>
        </li>`,
      );
      symbolHtml.push(html`
        <li class="symbol">
          <svg class="icon" aria-hidden="true" data-copy>
            <use xlink:href="${options.fontName}.symbol.svg#${name}"></use>
          </svg>
          <tool-tip class="name">${name}</tool-tip>
        </li>
      `);
    });

    if (options.useCSSVars) {
      cssString = [...cssRootVars, ...cssString];
    }

    if (options.generateInfoData) {
      await fs.writeJSON(infoDataPath, infoData, { spaces: 2 });
      log.log(`${color.green("SUCCESS")} Created ${infoDataPath} `);
    }

    const ttf = await createTTF(options);
    if (!excludeFormat.includes("eot")) await createEOT(options, ttf);
    if (!excludeFormat.includes("woff")) await createWOFF(options, ttf);
    if (!excludeFormat.includes("woff2")) await createWOFF2(options, ttf);
    if (!excludeFormat.includes("symbol.svg")) await createSvgSymbol(options);

    const ttfPath = path.join(options.dist, options.fontName + ".ttf");
    if (excludeFormat.includes("ttf")) {
      fs.removeSync(ttfPath);
    }
    const svgPath = path.join(options.dist, options.fontName + ".svg");
    if (excludeFormat.includes("svg")) {
      fs.removeSync(svgPath);
    }

    if (options.css) {
      const styleTemplatePath =
        options.styleTemplates || path.resolve(__dirname, "styles");
      const outDir =
        typeof options.css === "object"
          ? options.css.output || options.dist
          : options.dist;
      const hasTimestamp =
        typeof options.css === "object" ? options.css.hasTimestamp : true;

      const cssOptions = typeof options.css === "object" ? options.css : {};
      const fontFamilyString = generateFontFaceCSS(
        options.fontName,
        cssOptions.cssPath || "",
        Date.now(),
        excludeFormat,
        hasTimestamp,
      );

      await copyTemplate(styleTemplatePath, outDir, {
        fontname: options.fontName,
        cssString: cssString.join(""),
        cssToVars: cssToVars.join(""),
        infoData,
        fontSize: fontSize,
        timestamp: new Date().getTime(),
        prefix,
        fontFamily: fontFamilyString,
        nameAsUnicode: options.useNameAsUnicode,
        _opts: cssOptions,
      });
    }

    if (options.typescript) {
      await createTypescript({ ...options, typescript: options.typescript });
    }

    const { website } = options;
    if (website) {
      const pageNames = ["font-class", "unicode", "symbol"];
      const htmlPaths: Record<string, string> = {};
      // setting default home page.
      const indexName = pageNames.includes(website.index ?? "")
        ? website.index
        : "font-class";
      pageNames.forEach((name) => {
        const fileName = name === indexName ? "index.html" : `${name}.html`;
        htmlPaths[name] = path.join(options.dist, fileName);
      });
      const fontClassPath = htmlPaths["font-class"];
      const unicodePath = htmlPaths["unicode"];
      const symbolPath = htmlPaths["symbol"];

      // default template
      website.template = website.template || import("./website/index.tsx");
      // template data
      const tempData: IconPageProps = {
        ...{
          meta: undefined,
          links: [],
          corners: undefined,
          description: undefined,
          footerInfo: undefined,
          fontname: options.fontName,
          classNamePrefix: options.classNamePrefix,
          _type: "font-class",
          _link: `${
            (options.css &&
              typeof options.css !== "boolean" &&
              options.css.fileName) ||
            options.fontName
          }.css`,
          _IconHtml: cssIconHtml.join(""),
          _title: website.title || options.fontName,
        },
        ...website,
      };
      // website logo
      if (
        website.logo &&
        fs.pathExistsSync(website.logo) &&
        path.extname(website.logo) === ".svg"
      ) {
        tempData.logo = fs.readFileSync(website.logo).toString();
      }
      // website favicon
      if (website.favicon && fs.pathExistsSync(website.favicon)) {
        tempData.favicon = await image2uri(website.favicon);
      } else {
        tempData.favicon = "";
      }
      const template = match(await website.template)
        .with({ default: P.select() }, (tempFn) => tempFn)
        .otherwise((tempFn) => tempFn);

      const classHtmlStr = await createHTML(template, tempData);
      fs.outputFileSync(fontClassPath, classHtmlStr);
      log.log(`${color.green("SUCCESS")} Created ${fontClassPath} `);

      tempData._IconHtml = unicodeHtml.join("");
      tempData._type = "unicode";
      const unicodeHtmlStr = await createHTML(template, tempData);
      fs.outputFileSync(unicodePath, unicodeHtmlStr);
      log.log(`${color.green("SUCCESS")} Created ${unicodePath} `);

      tempData._IconHtml = symbolHtml.join("");
      tempData._type = "symbol";
      const symbolHtmlStr = await createHTML(template, tempData);
      fs.outputFileSync(symbolPath, symbolHtmlStr);
      log.log(`${color.green("SUCCESS")} Created ${symbolPath} `);
    }

    if (options.outSVGPath) {
      const outPath = await generateIconsSource(options);
      log.log(`${color.green("SUCCESS")} Created ${outPath} `);
    }
    if (options.outSVGReact) {
      const outPath = await generateReactIcons(options);
      log.log(`${color.green("SUCCESS")} Created React Components. `);
    }
    if (options.outSVGReactNative) {
      generateReactNativeIcons(options, unicodeObject);
      log.log(`${color.green("SUCCESS")} Created React Native Components. `);
    }

    return infoData;
  } catch (error) {
    log.log("SvgToFont:CLI:ERR:", error);
  }
};
