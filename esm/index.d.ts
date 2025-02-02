import { type SVGIcons2SVGFontStreamOptions } from 'svgicons2svgfont';
import { type AutoConfOption } from 'auto-config-loader';
import type { FontOptions } from 'svg2ttf';
import type { Config } from 'svgo';
import { type CSSOptions, type TypescriptOptions } from './utils.js';
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
    classNamePrefix?: SvgToFontOptions['fontName'];
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
    getIconUnicode?: (name: string, unicode: string, startUnicode: number) => [string, number];
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
    excludeFormat?: Array<"eot" | "woff" | "woff2" | "ttf" | "svg" | "symbol.svg">;
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
            bgColor?: '#dc3545';
        };
        /**
         * @default unicode
         */
        index?: 'font-class' | 'unicode' | 'symbol';
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
        template?: string;
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
declare const _default: (options?: SvgToFontOptions) => Promise<InfoData>;
export default _default;
