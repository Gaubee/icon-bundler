import { type SvgToFontOptions } from './';
/**
 * SVG to SVG font
 */
export declare function createSVG(options?: SvgToFontOptions): Promise<Record<string, string>>;
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
export declare const toPascalCase: (str: string) => string;
export declare function filterSvgFiles(svgFolderPath: string): string[];
export declare function snakeToUppercase(str: string): string;
export type TypescriptOptions = {
    extension?: 'd.ts' | 'ts' | 'tsx';
    enumName?: string;
};
/**
 * Create typescript declarations for icon classnames
 */
export declare function createTypescript(options: Omit<SvgToFontOptions, 'typescript'> & {
    typescript: TypescriptOptions | true;
}): Promise<void>;
/**
 * SVG font to TTF
 */
export declare function createTTF(options?: SvgToFontOptions): Promise<Buffer>;
/**
 * TTF font to EOT
 */
export declare function createEOT(options: SvgToFontOptions, ttf: Buffer): Promise<unknown>;
/**
 * TTF font to WOFF
 */
export declare function createWOFF(options: SvgToFontOptions, ttf: Buffer): Promise<unknown>;
/**
 * TTF font to WOFF2
 */
export declare function createWOFF2(options: SvgToFontOptions, ttf: Buffer): Promise<unknown>;
/**
 * Create SVG Symbol
 */
export declare function createSvgSymbol(options?: SvgToFontOptions): Promise<unknown>;
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
/**
 * Copy template files
 */
export declare function copyTemplate(inDir: string, outDir: string, { _opts, ...vars }: Record<string, any> & {
    _opts: CSSOptions;
}): Promise<void>;
/**
 * Create HTML
 */
export declare function createHTML(templatePath: string, data: Record<string, any>): string;
export declare function generateFontFaceCSS(fontName: string, cssPath: string, timestamp: number, excludeFormat: string[], hasTimestamp?: boolean | string): string;
export declare const getDefaultOptions: (options: SvgToFontOptions) => SvgToFontOptions;
