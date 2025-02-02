import { type SvgToFontOptions } from './';
/**
 * Generate Icon SVG Path Source
 * <font-name>.json
 */
export declare function generateIconsSource(options?: SvgToFontOptions): Promise<string>;
/**
 * Generate React Icon
 * <font-name>.json
 */
export declare function generateReactIcons(options?: SvgToFontOptions): Promise<string>;
/**
 * Generate ReactNative Icon
 * <font-name>.json
 */
export declare function generateReactNativeIcons(options: SvgToFontOptions, unicodeObject: Record<string, string>): void;
