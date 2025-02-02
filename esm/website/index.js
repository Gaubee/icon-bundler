// IconPage.tsx
import React from 'react';

// 定义 Props 类型
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var IconPage = _ref => {
  var {
    _title,
    version,
    meta = {},
    favicon,
    _type,
    _link,
    classNamePrefix = 'icon',
    fontname = 'iconfont',
    corners,
    logo,
    description,
    links = [],
    footerInfo,
    _IconHtml = ''
  } = _ref;
  // 动态生成 CSS
  var dynamicStyles = "\n    *{margin: 0;padding: 0;list-style: none;}\n    body { color: #696969; font: 12px/1.5 sans-serif; }\n    a { color: #333; text-decoration: underline; }\n    a:hover { color: rgb(9, 73, 209); }\n    .header { \n      color: #333; \n      text-align: center; \n      padding: 80px 0 60px 0; \n      min-height: 153px; \n      font-size: 14px; \n    }\n    " + (_type === 'font-class' ? "\n      .icons ul li.class-icon { \n        font-size: 21px; \n        line-height: 21px; \n        padding-bottom: 20px; \n      }\n      .icons ul li.class-icon p{ font-size: 12px; }\n      .icons ul li.class-icon [class^=\"" + classNamePrefix + "-\"]{ font-size: 26px; }\n    " : '') + "\n    \n    " + (_type === 'unicode' ? "\n      @font-face {\n        font-family: \"" + fontname + "\";\n        src: url(\"" + fontname + ".eot\");\n        src: url(\"" + fontname + ".eot#iefix\") format(\"embedded-opentype\"),\n             url(\"" + fontname + ".woff2?" + Date.now() + "\") format(\"woff2\"),\n             url(\"" + fontname + ".woff?" + Date.now() + "\") format(\"woff\"),\n             url(\"" + fontname + ".ttf?" + Date.now() + "\") format(\"truetype\"),\n             url(\"" + fontname + ".svg#" + fontname + "?" + Date.now() + "\") format(\"svg\");\n      }\n      .iconfont {\n        font-family: \"" + fontname + "\" !important;\n        font-size: 26px;\n        -webkit-font-smoothing: antialiased;\n        -webkit-text-stroke-width: 0.2px;\n        -moz-osx-font-smoothing: grayscale;\n      }\n    " : '') + "\n  ";
  return /*#__PURE__*/_jsxs("html", {
    lang: "en",
    children: [/*#__PURE__*/_jsxs("head", {
      children: [/*#__PURE__*/_jsx("meta", {
        charSet: "UTF-8"
      }), /*#__PURE__*/_jsx("title", {
        children: _title
      }), /*#__PURE__*/_jsx("meta", {
        name: "viewport",
        content: "width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
      }), Object.entries(meta).map(_ref2 => {
        var [k, v] = _ref2;
        return /*#__PURE__*/_jsx("meta", {
          name: k,
          content: v
        }, k);
      }), favicon && /*#__PURE__*/_jsx("link", {
        rel: "icon",
        type: "image/x-icon",
        href: favicon
      }), _type === 'font-class' && _link && /*#__PURE__*/_jsx("link", {
        rel: "stylesheet",
        href: _link
      }), /*#__PURE__*/_jsx("style", {
        dangerouslySetInnerHTML: {
          __html: dynamicStyles
        }
      })]
    }), /*#__PURE__*/_jsxs("body", {
      children: [(corners == null ? void 0 : corners.url) && /*#__PURE__*/_jsx("a", {
        href: corners.url,
        target: "_blank",
        className: "github-corner",
        children: /*#__PURE__*/_jsx("svg", {
          width: corners.width || 60,
          height: corners.width || 60,
          viewBox: "0 0 250 250",
          style: {
            fill: corners.bgColor || '#151513',
            color: '#fff',
            position: 'fixed',
            top: 0,
            right: 0,
            border: 0,
            zIndex: 999
          }
        })
      }), /*#__PURE__*/_jsxs("div", {
        className: "header",
        children: [typeof logo === 'string' ? /*#__PURE__*/_jsx("div", {
          className: "logo",
          children: /*#__PURE__*/_jsx("a", {
            href: "./",
            children: logo
          })
        }) : logo, /*#__PURE__*/_jsxs("h1", {
          children: [_title, version && /*#__PURE__*/_jsx("sup", {
            children: version
          })]
        }), /*#__PURE__*/_jsx("div", {
          className: "info",
          children: description || meta.description
        }), /*#__PURE__*/_jsx("p", {
          children: links.map((linkItem, index) => /*#__PURE__*/_jsxs(React.Fragment, {
            children: [/*#__PURE__*/_jsx("a", {
              href: linkItem.url,
              children: linkItem.title
            }), index !== links.length - 1 && ' · ']
          }, linkItem.url))
        })]
      }), /*#__PURE__*/_jsx("div", {
        className: "icons",
        children: /*#__PURE__*/_jsx("ul", {
          dangerouslySetInnerHTML: {
            __html: _IconHtml
          }
        })
      }), /*#__PURE__*/_jsx("p", {
        className: "links",
        children: links.map((linkItem, index) => /*#__PURE__*/_jsxs(React.Fragment, {
          children: [/*#__PURE__*/_jsx("a", {
            href: linkItem.url,
            children: linkItem.title
          }), index !== links.length - 1 && ' · ']
        }, linkItem.url))
      }), /*#__PURE__*/_jsxs("div", {
        className: "footer",
        children: [footerInfo, /*#__PURE__*/_jsx("div", {
          children: /*#__PURE__*/_jsx("a", {
            target: "_blank",
            href: "https://github.com/gaubee/icon-bundler",
            children: "Created By icon-bundler"
          })
        })]
      })]
    })]
  });
};
export default IconPage;