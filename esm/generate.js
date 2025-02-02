import _extends from "@babel/runtime/helpers/extends";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import fs from 'fs-extra';
import path from 'path';
import { optimize } from 'svgo';
import { filterSvgFiles, toPascalCase } from './utils.js';
/**
 * Generate Icon SVG Path Source
 * <font-name>.json
 */
export function generateIconsSource(_x) {
  return _generateIconsSource.apply(this, arguments);
}

/**
 * Loads SVG file for each icon, extracts path strings `d="path-string"`,
 * and constructs map of icon name to array of path strings.
 * @param {array} files
 */
function _generateIconsSource() {
  _generateIconsSource = _asyncToGenerator(function* (options) {
    if (options === void 0) {
      options = {};
    }
    var ICONS_PATH = filterSvgFiles(options.src);
    var data = yield buildPathsObject(ICONS_PATH, options);
    var outPath = path.join(options.dist, options.fontName + ".json");
    yield fs.outputFile(outPath, "{" + data + "\n}");
    return outPath;
  });
  return _generateIconsSource.apply(this, arguments);
}
function buildPathsObject(_x2, _x3) {
  return _buildPathsObject.apply(this, arguments);
}
function _buildPathsObject() {
  _buildPathsObject = _asyncToGenerator(function* (files, options) {
    if (options === void 0) {
      options = {};
    }
    var svgoOptions = options.svgoOptions || {};
    return Promise.all(files.map(/*#__PURE__*/function () {
      var _ref = _asyncToGenerator(function* (filepath) {
        var name = path.basename(filepath, '.svg');
        var svg = fs.readFileSync(filepath, 'utf-8');
        var pathStrings = optimize(svg, _extends({
          path: filepath
        }, options, {
          plugins: ['convertTransform', ...(svgoOptions.plugins || [])
          // 'convertShapeToPath'
          ]
        }));
        var str = (pathStrings.data.match(/ d="[^"]+"/g) || []).map(s => s.slice(3));
        return "\n\"" + name + "\": [" + str.join(',\n') + "]";
      });
      return function (_x7) {
        return _ref.apply(this, arguments);
      };
    }()));
  });
  return _buildPathsObject.apply(this, arguments);
}
var reactSource = (name, size, fontName, source) => "import React from 'react';\nexport const " + name + " = props => (\n  <svg viewBox=\"0 0 20 20\" " + (size ? "width=\"" + size + "\" height=\"" + size + "\"" : '') + " {...props} className={`" + fontName + " ${props.className ? props.className : ''}`}>" + source + "</svg>\n);\n";
var reactTypeSource = name => "import React from 'react';\nexport declare const " + name + ": (props: React.SVGProps<SVGSVGElement>) => JSX.Element;\n";

/**
 * Generate React Icon
 * <font-name>.json
 */
export function generateReactIcons(_x4) {
  return _generateReactIcons.apply(this, arguments);
}
function _generateReactIcons() {
  _generateReactIcons = _asyncToGenerator(function* (options) {
    if (options === void 0) {
      options = {};
    }
    var ICONS_PATH = filterSvgFiles(options.src);
    var data = yield outputReactFile(ICONS_PATH, options);
    var outPath = path.join(options.dist, 'react', 'index.js');
    fs.outputFileSync(outPath, data.join('\n'));
    fs.outputFileSync(outPath.replace(/\.js$/, '.d.ts'), data.join('\n'));
    return outPath;
  });
  return _generateReactIcons.apply(this, arguments);
}
function outputReactFile(_x5, _x6) {
  return _outputReactFile.apply(this, arguments);
}
function _outputReactFile() {
  _outputReactFile = _asyncToGenerator(function* (files, options) {
    if (options === void 0) {
      options = {};
    }
    var svgoOptions = options.svgoOptions || {};
    var fontSizeOpt = typeof options.css !== 'boolean' && options.css.fontSize;
    var fontSize = typeof fontSizeOpt === 'boolean' ? fontSizeOpt === true ? '16px' : '' : fontSizeOpt;
    var fontName = options.classNamePrefix || options.fontName;
    return Promise.all(files.map(/*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(function* (filepath) {
        var name = toPascalCase(path.basename(filepath, '.svg'));
        if (/^[rR]eact$/.test(name)) {
          name = name + toPascalCase(fontName);
        }
        var svg = fs.readFileSync(filepath, 'utf-8');
        var pathData = optimize(svg, _extends({
          path: filepath
        }, svgoOptions, {
          plugins: ['removeXMLNS', 'removeEmptyAttrs', 'convertTransform',
          // 'convertShapeToPath',
          // 'removeViewBox'
          ...(svgoOptions.plugins || [])]
        }));
        var str = (pathData.data.match(/ d="[^"]+"/g) || []).map(s => s.slice(3));
        var outDistPath = path.join(options.dist, 'react', name + ".js");
        var pathStrings = str.map((d, i) => "<path d=" + d + " fillRule=\"evenodd\" />");
        var comName = isNaN(Number(name.charAt(0))) ? name : toPascalCase(fontName) + name;
        fs.outputFileSync(outDistPath, reactSource(comName, fontSize, fontName, pathStrings.join(',\n')));
        fs.outputFileSync(outDistPath.replace(/\.js$/, '.d.ts'), reactTypeSource(comName));
        return "export * from './" + name + "';";
      });
      return function (_x8) {
        return _ref2.apply(this, arguments);
      };
    }()));
  });
  return _outputReactFile.apply(this, arguments);
}
var reactNativeSource = (fontName, defaultSize, iconMap) => "import { Text } from 'react-native';\n\nconst icons = " + JSON.stringify(Object.fromEntries(iconMap)) + ";\n\nexport const " + fontName + " = ({iconName, ...rest}) => {\n  return (<Text style={{fontFamily: '" + fontName + "', fontSize: " + defaultSize + ", color: '#000000', ...rest}}>\n    {icons[iconName]}\n  </Text>);\n};\n";
var reactNativeTypeSource = (name, iconMap) => "import { TextStyle } from 'react-native';\n\nexport type " + name + "IconNames = " + [...iconMap.keys()].reduce((acc, key, index) => {
  if (index === 0) {
    acc = "'" + key + "'";
  } else {
    acc += " | '" + key + "'";
  }
  return acc;
}, 'string') + "\n\nexport interface " + name + "Props extends Omit<TextStyle, 'fontFamily' | 'fontStyle' | 'fontWeight'> {\n  iconName: " + name + "IconNames\n}\n\nexport declare const " + name + ": (props: " + name + "Props) => JSX.Element;\n";

/**
 * Generate ReactNative Icon
 * <font-name>.json
 */
export function generateReactNativeIcons(options, unicodeObject) {
  if (options === void 0) {
    options = {};
  }
  var ICONS_PATH = filterSvgFiles(options.src);
  outputReactNativeFile(ICONS_PATH, options, unicodeObject);
}
function outputReactNativeFile(files, options, unicodeObject) {
  if (options === void 0) {
    options = {};
  }
  var fontSizeOpt = typeof options.css !== 'boolean' && options.css.fontSize;
  var fontSize = typeof fontSizeOpt === 'boolean' ? 16 : parseInt(fontSizeOpt);
  var fontName = options.classNamePrefix || options.fontName;
  var iconMap = new Map();
  files.map(filepath => {
    var baseFileName = path.basename(filepath, '.svg');
    iconMap.set(baseFileName, unicodeObject[baseFileName]);
  });
  var outDistPath = path.join(options.dist, 'reactNative', fontName + ".jsx");
  var comName = isNaN(Number(fontName.charAt(0))) ? fontName : toPascalCase(fontName) + name;
  fs.outputFileSync(outDistPath, reactNativeSource(comName, fontSize, iconMap));
  fs.outputFileSync(outDistPath.replace(/\.jsx$/, '.d.ts'), reactNativeTypeSource(comName, iconMap));
}