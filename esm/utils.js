import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/extends";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
var _excluded = ["_opts"];
import { SVGIcons2SVGFontStream } from 'svgicons2svgfont';
import fs from 'fs-extra';
import path from 'path';
import color from 'colors-cli';
import { load } from 'cheerio';
import svg2ttf from 'svg2ttf';
import ttf2eot from 'ttf2eot';
import ttf2woff from 'ttf2woff';
import ttf2woff2 from 'ttf2woff2';
import nunjucks from 'nunjucks';
import { merge } from 'auto-config-loader';
import { log } from './log.js';
var UnicodeObj = {};
/**
 * Unicode Private Use Area start.
 * https://en.wikipedia.org/wiki/Private_Use_Areas
 */
var startUnicode = 0xea01;

/**
 * SVG to SVG font
 */
export function createSVG(options) {
  if (options === void 0) {
    options = {};
  }
  startUnicode = options.startUnicode;
  UnicodeObj = {};
  return new Promise(/*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* (resolve, reject) {
      var fontStream = new SVGIcons2SVGFontStream(_extends({}, options.svgicons2svgfont));
      function writeFontStream(svgPath) {
        // file name
        var _name = path.basename(svgPath, ".svg");
        var glyph = fs.createReadStream(svgPath);
        var curUnicode = String.fromCharCode(startUnicode);
        var [_curUnicode, _startUnicode] = options.getIconUnicode ? options.getIconUnicode(_name, curUnicode, startUnicode) || [curUnicode] : [curUnicode];
        if (_startUnicode) startUnicode = _startUnicode;
        var unicode = [_curUnicode];
        if (curUnicode === _curUnicode && (!_startUnicode || startUnicode === _startUnicode)) startUnicode++;
        UnicodeObj[_name] = unicode[0];
        if (!!options.useNameAsUnicode) {
          unicode[0] = _name;
          UnicodeObj[_name] = _name;
        }
        glyph.metadata = {
          unicode,
          name: _name
        };
        fontStream.write(glyph);
      }
      var DIST_PATH = path.join(options.dist, options.fontName + ".svg");
      // Setting the font destination
      fontStream.pipe(fs.createWriteStream(DIST_PATH)).on("finish", () => {
        log.log(color.green('SUCCESS') + " " + color.blue_bt('SVG') + " font successfully created!\n  \u2570\u2508\u25B6 " + DIST_PATH);
        resolve(UnicodeObj);
      }).on("error", err => {
        if (err) {
          reject(err);
        }
      });
      filterSvgFiles(options.src).forEach(svg => {
        if (typeof svg !== 'string') return false;
        writeFontStream(svg);
      });

      // Do not forget to end the stream
      fontStream.end();
    });
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
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
export var toPascalCase = str => str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g).map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join('');

/*
 * Filter svg files
 * @return {Array} svg files
 */
export function filterSvgFiles(svgFolderPath) {
  var files = fs.readdirSync(svgFolderPath, 'utf-8');
  var svgArr = [];
  if (!files) {
    throw new Error("Error! Svg folder is empty." + svgFolderPath);
  }
  for (var i in files) {
    if (typeof files[i] !== 'string' || path.extname(files[i]) !== '.svg') continue;
    if (!~svgArr.indexOf(files[i])) {
      svgArr.push(path.join(svgFolderPath, files[i]));
    }
  }
  return svgArr;
}
export function snakeToUppercase(str) {
  return str.split(/[-_]/).map(partial => partial.charAt(0).toUpperCase() + partial.slice(1)).join('');
}
/**
 * Create typescript declarations for icon classnames
 */
export function createTypescript(_x3) {
  return _createTypescript.apply(this, arguments);
}

/**
 * SVG font to TTF
 */
function _createTypescript() {
  _createTypescript = _asyncToGenerator(function* (options) {
    var tsOptions = options.typescript === true ? {} : options.typescript;
    var uppercaseFontName = snakeToUppercase(options.fontName);
    var {
      extension = 'd.ts',
      enumName = uppercaseFontName
    } = tsOptions;
    var DIST_PATH = path.join(options.dist, options.fontName + "." + extension);
    var fileNames = filterSvgFiles(options.src).map(svgPath => path.basename(svgPath, path.extname(svgPath)));
    yield fs.writeFile(DIST_PATH, ["export enum " + enumName + " {", ...fileNames.map(name => "  " + snakeToUppercase(name) + " = \"" + options.classNamePrefix + "-" + name + "\","), '}', "export type " + enumName + "Classname = " + fileNames.map(name => "\"" + options.classNamePrefix + "-" + name + "\"").join(' | '), "export type " + enumName + "Icon = " + fileNames.map(name => "\"" + name + "\"").join(' | '), "export const " + enumName + "Prefix = \"" + options.classNamePrefix + "-\""].join('\n'));
    log.log(color.green('SUCCESS') + " Created " + DIST_PATH);
  });
  return _createTypescript.apply(this, arguments);
}
export function createTTF(options) {
  if (options === void 0) {
    options = {};
  }
  return new Promise((resolve, reject) => {
    options.svg2ttf = options.svg2ttf || {};
    var DIST_PATH = path.join(options.dist, options.fontName + ".ttf");
    var ttf = svg2ttf(fs.readFileSync(path.join(options.dist, options.fontName + ".svg"), "utf8"), options.svg2ttf);
    var ttfBuf = Buffer.from(ttf.buffer);
    fs.writeFile(DIST_PATH, ttfBuf, err => {
      if (err) {
        return reject(err);
      }
      log.log(color.green('SUCCESS') + " " + color.blue_bt('TTF') + " font successfully created!\n  \u2570\u2508\u25B6 " + DIST_PATH);
      resolve(ttfBuf);
    });
  });
}
;

/**
 * TTF font to EOT
 */
export function createEOT(options, ttf) {
  if (options === void 0) {
    options = {};
  }
  return new Promise((resolve, reject) => {
    var DIST_PATH = path.join(options.dist, options.fontName + '.eot');
    var eot = Buffer.from(ttf2eot(ttf).buffer);
    fs.writeFile(DIST_PATH, eot, err => {
      if (err) {
        return reject(err);
      }
      log.log(color.green('SUCCESS') + " " + color.blue_bt('EOT') + " font successfully created!\n  \u2570\u2508\u25B6 " + DIST_PATH);
      resolve(eot);
    });
  });
}
;

/**
 * TTF font to WOFF
 */
export function createWOFF(options, ttf) {
  if (options === void 0) {
    options = {};
  }
  return new Promise((resolve, reject) => {
    var DIST_PATH = path.join(options.dist, options.fontName + ".woff");
    var woff = Buffer.from(ttf2woff(ttf).buffer);
    fs.writeFile(DIST_PATH, woff, err => {
      if (err) {
        return reject(err);
      }
      log.log(color.green('SUCCESS') + " " + color.blue_bt('WOFF') + " font successfully created!\n  \u2570\u2508\u25B6 " + DIST_PATH);
      resolve(woff);
    });
  });
}
;

/**
 * TTF font to WOFF2
 */
export function createWOFF2(options, ttf) {
  if (options === void 0) {
    options = {};
  }
  return new Promise((resolve, reject) => {
    var DIST_PATH = path.join(options.dist, options.fontName + ".woff2");
    var woff2 = Buffer.from(ttf2woff2(ttf).buffer);
    fs.writeFile(DIST_PATH, woff2, err => {
      if (err) {
        return reject(err);
      }
      log.log(color.green('SUCCESS') + " " + color.blue_bt('WOFF2') + " font successfully created!\n  \u2570\u2508\u25B6 " + DIST_PATH);
      resolve({
        path: DIST_PATH
      });
    });
  });
}
;

/**
 * Create SVG Symbol
 */
export function createSvgSymbol(options) {
  if (options === void 0) {
    options = {};
  }
  var DIST_PATH = path.join(options.dist, options.fontName + ".symbol.svg");
  var $ = load('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" style="display:none;"></svg>');
  return new Promise((resolve, reject) => {
    filterSvgFiles(options.src).forEach(svgPath => {
      var fileName = path.basename(svgPath, path.extname(svgPath));
      var file = fs.readFileSync(svgPath, "utf8");
      var svgNode = $(file);
      var symbolNode = $("<symbol></symbol>");
      symbolNode.attr("viewBox", svgNode.attr("viewBox"));
      symbolNode.attr("id", options.classNamePrefix + "-" + fileName);
      symbolNode.append(svgNode.html());
      $('svg').append(symbolNode);
    });
    fs.writeFile(DIST_PATH, $.html("svg"), err => {
      if (err) {
        return reject(err);
      }
      log.log(color.green('SUCCESS') + " " + color.blue_bt('Svg Symbol') + " font successfully created!\n  \u2570\u2508\u25B6 " + DIST_PATH);
      resolve({
        path: DIST_PATH,
        svg: $.html("svg")
      });
    });
  });
}
;
// As we are processing css files, we need to eacape HTML entities.
var safeNunjucks = nunjucks.configure({
  autoescape: false
});

/**
 * Copy template files
 */
export function copyTemplate(_x4, _x5, _x6) {
  return _copyTemplate.apply(this, arguments);
}
function _copyTemplate() {
  _copyTemplate = _asyncToGenerator(function* (inDir, outDir, _ref2) {
    var {
        _opts
      } = _ref2,
      vars = _objectWithoutPropertiesLoose(_ref2, _excluded);
    var files = yield fs.readdir(inDir, {
      withFileTypes: true
    });
    var context = _extends({}, _opts.templateVars || {}, vars, {
      cssPath: _opts.cssPath || '',
      filename: _opts.fileName || vars.fontname
    });
    yield fs.ensureDir(outDir);
    for (var file of files) {
      if (!file.isFile()) continue;
      if (_opts.include && !new RegExp(_opts.include).test(file.name)) continue;
      var newFileName = file.name.replace(/\.template$/, '').replace(/^_/, '');
      for (var key in context) newFileName = newFileName.replace("{{" + key + "}}", "" + context[key]);
      var template = yield fs.readFile(path.join(inDir, file.name), 'utf8');
      var content = safeNunjucks.renderString(template, context);
      var filePath = path.join(outDir, newFileName);
      yield fs.writeFile(filePath, content);
      log.log(color.green('SUCCESS') + " Created " + filePath + " ");
    }
  });
  return _copyTemplate.apply(this, arguments);
}
;

/**
 * Create HTML
 */
export function createHTML(templatePath, data) {
  return nunjucks.renderString(fs.readFileSync(templatePath, 'utf8'), _extends({}, data, {
    Date: Date,
    JSON: JSON,
    Math: Math,
    Number: Number,
    Object: Object,
    RegExp: RegExp,
    String: String,
    typeof: v => typeof v
  }));
}
;
export function generateFontFaceCSS(fontName, cssPath, timestamp, excludeFormat, hasTimestamp) {
  if (hasTimestamp === void 0) {
    hasTimestamp = true;
  }
  var timestamString = hasTimestamp === true ? "?t=" + timestamp : typeof hasTimestamp == 'string' ? "?t=" + hasTimestamp : undefined;
  var formats = [{
    ext: 'eot',
    format: 'embedded-opentype',
    ieFix: true
  }, {
    ext: 'woff2',
    format: 'woff2'
  }, {
    ext: 'woff',
    format: 'woff'
  }, {
    ext: 'ttf',
    format: 'truetype'
  }, {
    ext: 'svg',
    format: 'svg'
  }];
  var cssString = "  font-family: \"" + fontName + "\";\n";
  if (!excludeFormat.includes('eot')) {
    cssString += "  src: url('" + cssPath + fontName + ".eot" + (timestamString || '') + "'); /* IE9*/\n";
  }
  cssString += '  src: ';
  var srcParts = formats.filter(format => !excludeFormat.includes(format.ext)).map(format => {
    if (format.ext === 'eot') {
      return "url('" + cssPath + fontName + ".eot" + (timestamString || '?') + "#iefix') format('" + format.format + "') /* IE6-IE8 */";
    }
    return "url('" + cssPath + fontName + "." + format.ext + (timestamString || '') + "') format('" + format.format + "')";
  });
  cssString += srcParts.join(',\n  ') + ';';
  return cssString;
}
export var getDefaultOptions = options => {
  return merge({
    dist: path.resolve(process.cwd(), 'fonts'),
    src: path.resolve(process.cwd(), 'svg'),
    startUnicode: 0xea01,
    svg2ttf: {},
    svgicons2svgfont: {
      fontName: 'iconfont'
    },
    fontName: 'iconfont',
    symbolNameDelimiter: '-'
  }, options);
};