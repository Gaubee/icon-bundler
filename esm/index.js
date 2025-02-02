import _extends from "@babel/runtime/helpers/extends";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import image2uri from 'image2uri';
import color from 'colors-cli';
import { autoConf, merge } from 'auto-config-loader';
import { log } from './log.js';
import { generateIconsSource, generateReactIcons, generateReactNativeIcons } from './generate.js';
import { createSVG, createTTF, createEOT, createWOFF, createWOFF2, createSvgSymbol, copyTemplate, createHTML, createTypescript } from './utils.js';
import { generateFontFaceCSS, getDefaultOptions } from './utils.js';
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var loadConfig = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (options) {
    var defaultOptions = getDefaultOptions(options);
    var data = autoConf('icon-bundler', _extends({
      mustExist: true,
      default: defaultOptions
    }, options.config));
    return merge(defaultOptions, data);
  });
  return function loadConfig(_x) {
    return _ref.apply(this, arguments);
  };
}();
var handlePkgConfig = options => {
  var pkgPath = path.join(process.cwd(), 'package.json');
  if (fs.pathExistsSync(pkgPath)) {
    var pkg = fs.readJSONSync(pkgPath);
    if (pkg.icon - bundler) {
      var cssOptions = options.css;
      options = merge(options, pkg.icon - bundler);
      if (pkg.icon - bundler.css && cssOptions && typeof cssOptions === 'object') {
        options.css = merge(cssOptions, pkg.icon - bundler.css);
      }
    }
    if (options.website && pkg.version) {
      var _options$website$vers;
      options.website.version = (_options$website$vers = options.website.version) != null ? _options$website$vers : pkg.version;
    }
  }
  return options;
};
export default (/*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (options) {
    if (options === void 0) {
      options = {};
    }
    options = yield loadConfig(options);
    options = handlePkgConfig(options);
    if (options.log === undefined) options.log = true;
    log.disabled = !options.log;
    if (options.logger && typeof options.logger === 'function') log.logger = options.logger;
    options.svgicons2svgfont.fontName = options.fontName;
    options.classNamePrefix = options.classNamePrefix || options.fontName;
    var excludeFormat = options.excludeFormat || [];
    var fontSizeOpt = typeof options.css !== 'boolean' && options.css.fontSize;
    var fontSize = typeof fontSizeOpt === 'boolean' ? fontSizeOpt === true ? 'font-size: 16px;' : '' : "font-size: " + fontSizeOpt + ";";
    // If you generate a font you need to generate a style.
    if (options.website && !options.css) options.css = true;
    var infoDataPath = path.resolve(options.dist, 'info.json');
    try {
      if (options.emptyDist) {
        yield fs.emptyDir(options.dist);
      }
      // Ensures that the directory exists.
      yield fs.ensureDir(options.dist);
      var unicodeObject = yield createSVG(options);

      /** @deprecated */
      var cssToVars = [];
      var cssString = [];
      var cssRootVars = [];
      var cssIconHtml = [];
      var unicodeHtml = [];
      var symbolHtml = [];
      var prefix = options.classNamePrefix || options.fontName;
      var infoData = {};
      Object.keys(unicodeObject).forEach((name, index, self) => {
        if (!infoData[name]) infoData[name] = {};
        var _code = unicodeObject[name];
        var symbolName = options.classNamePrefix + options.symbolNameDelimiter + name;
        var iconPart = symbolName + '">';
        var encodedCodes = _code.charCodeAt(0);
        if (options.useNameAsUnicode) {
          symbolName = name;
          iconPart = prefix + '">' + name;
          encodedCodes = _code.split('').map(x => x.charCodeAt(0)).join(';&amp;#');
        } else {
          cssToVars.push("$" + symbolName + ": \"\\" + encodedCodes.toString(16) + "\";\n");
          if (options.useCSSVars) {
            if (index === 0) cssRootVars.push(":root {\n");
            cssRootVars.push("--" + symbolName + ": \"\\" + encodedCodes.toString(16) + "\";\n");
            cssString.push("." + symbolName + ":before { content: var(--" + symbolName + "); }\n");
            if (index === self.length - 1) cssRootVars.push("}\n");
          } else {
            cssString.push("." + symbolName + ":before { content: \"\\" + encodedCodes.toString(16) + "\"; }\n");
          }
        }
        infoData[name].encodedCode = "\\" + encodedCodes.toString(16);
        infoData[name].prefix = prefix;
        infoData[name].className = symbolName;
        infoData[name].unicode = "&#" + encodedCodes + ";";
        cssIconHtml.push("<li class=\"class-icon\"><i class=\"" + iconPart + "</i><p class=\"name\">" + name + "</p></li>");
        unicodeHtml.push("<li class=\"unicode-icon\"><span class=\"iconfont\">" + _code + "</span><h4>" + name + "</h4><span class=\"unicode\">&amp;#" + encodedCodes + ";</span></li>");
        symbolHtml.push("\n        <li class=\"symbol\">\n          <svg class=\"icon\" aria-hidden=\"true\">\n            <use xlink:href=\"" + options.fontName + ".symbol.svg#" + symbolName + "\"></use>\n          </svg>\n          <h4>" + symbolName + "</h4>\n        </li>\n      ");
      });
      if (options.useCSSVars) {
        cssString = [...cssRootVars, ...cssString];
      }
      if (options.generateInfoData) {
        yield fs.writeJSON(infoDataPath, infoData, {
          spaces: 2
        });
        log.log(color.green('SUCCESS') + " Created " + infoDataPath + " ");
      }
      var ttf = yield createTTF(options);
      if (!excludeFormat.includes('eot')) yield createEOT(options, ttf);
      if (!excludeFormat.includes('woff')) yield createWOFF(options, ttf);
      if (!excludeFormat.includes('woff2')) yield createWOFF2(options, ttf);
      if (!excludeFormat.includes('symbol.svg')) yield createSvgSymbol(options);
      var ttfPath = path.join(options.dist, options.fontName + ".ttf");
      if (excludeFormat.includes('ttf')) {
        fs.removeSync(ttfPath);
      }
      var svgPath = path.join(options.dist, options.fontName + ".svg");
      if (excludeFormat.includes('svg')) {
        fs.removeSync(svgPath);
      }
      if (options.css) {
        var styleTemplatePath = options.styleTemplates || path.resolve(__dirname, 'styles');
        var outDir = typeof options.css === 'object' ? options.css.output || options.dist : options.dist;
        var hasTimestamp = typeof options.css === 'object' ? options.css.hasTimestamp : true;
        var cssOptions = typeof options.css === 'object' ? options.css : {};
        var fontFamilyString = generateFontFaceCSS(options.fontName, cssOptions.cssPath || "", Date.now(), excludeFormat, hasTimestamp);
        yield copyTemplate(styleTemplatePath, outDir, {
          fontname: options.fontName,
          cssString: cssString.join(''),
          cssToVars: cssToVars.join(''),
          infoData,
          fontSize: fontSize,
          timestamp: new Date().getTime(),
          prefix,
          fontFamily: fontFamilyString,
          nameAsUnicode: options.useNameAsUnicode,
          _opts: cssOptions
        });
      }
      if (options.typescript) {
        yield createTypescript(_extends({}, options, {
          typescript: options.typescript
        }));
      }
      if (options.website) {
        var pageNames = ['font-class', 'unicode', 'symbol'];
        var htmlPaths = {};
        // setting default home page.
        var indexName = pageNames.includes(options.website.index) ? options.website.index : 'font-class';
        pageNames.forEach(name => {
          var fileName = name === indexName ? 'index.html' : name + ".html";
          htmlPaths[name] = path.join(options.dist, fileName);
        });
        var fontClassPath = htmlPaths['font-class'];
        var unicodePath = htmlPaths['unicode'];
        var symbolPath = htmlPaths['symbol'];

        // default template
        options.website.template = options.website.template || path.join(__dirname, 'website', 'index.njk');
        // template data
        var tempData = _extends({
          meta: null,
          links: null,
          corners: null,
          description: null,
          footerInfo: null
        }, options.website, {
          fontname: options.fontName,
          classNamePrefix: options.classNamePrefix,
          _type: 'font-class',
          _link: (options.css && typeof options.css !== 'boolean' && options.css.fileName || options.fontName) + ".css",
          _IconHtml: cssIconHtml.join(''),
          _title: options.website.title || options.fontName
        });
        // website logo
        if (options.website.logo && fs.pathExistsSync(options.website.logo) && path.extname(options.website.logo) === '.svg') {
          tempData.logo = fs.readFileSync(options.website.logo).toString();
        }
        // website favicon
        if (options.website.favicon && fs.pathExistsSync(options.website.favicon)) {
          tempData.favicon = yield image2uri(options.website.favicon);
        } else {
          tempData.favicon = '';
        }
        var classHtmlStr = yield createHTML(options.website.template, tempData);
        fs.outputFileSync(fontClassPath, classHtmlStr);
        log.log(color.green('SUCCESS') + " Created " + fontClassPath + " ");
        tempData._IconHtml = unicodeHtml.join('');
        tempData._type = 'unicode';
        var unicodeHtmlStr = yield createHTML(options.website.template, tempData);
        fs.outputFileSync(unicodePath, unicodeHtmlStr);
        log.log(color.green('SUCCESS') + " Created " + unicodePath + " ");
        tempData._IconHtml = symbolHtml.join('');
        tempData._type = 'symbol';
        var symbolHtmlStr = yield createHTML(options.website.template, tempData);
        fs.outputFileSync(symbolPath, symbolHtmlStr);
        log.log(color.green('SUCCESS') + " Created " + symbolPath + " ");
      }
      if (options.outSVGPath) {
        var outPath = yield generateIconsSource(options);
        log.log(color.green('SUCCESS') + " Created " + outPath + " ");
      }
      if (options.outSVGReact) {
        var _outPath = yield generateReactIcons(options);
        log.log(color.green('SUCCESS') + " Created React Components. ");
      }
      if (options.outSVGReactNative) {
        generateReactNativeIcons(options, unicodeObject);
        log.log(color.green('SUCCESS') + " Created React Native Components. ");
      }
      return infoData;
    } catch (error) {
      log.log('SvgToFont:CLI:ERR:', error);
    }
  });
  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());