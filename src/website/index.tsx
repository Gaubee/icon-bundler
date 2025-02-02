// IconPage.tsx
import React from "react";
import type { SvgToFontOptions } from "../index.ts";
import { match, P } from "ts-pattern";

// 定义 Props 类型
export type IconPageProps = SvgToFontOptions["website"] & {
  fontname: string;
  classNamePrefix: string;
  _type: string;
  _link: string;
  _IconHtml: string;
  _title: string;
};
//        {
//   _title: string;
//   version?: string;
//   meta?: Record<string, string>;
//   favicon?: string;
//   _type?: "font-class" | "unicode" | "symbol";
//   _link?: string;
//   classNamePrefix?: string;
//   fontname?: string;
//   corners?: {
//     url?: string;
//     width?: number;
//     bgColor?: string;
//   };
//   logo?: string | React.ReactNode;
//   description?: string;
//   links?: Array<{ url: string; title: string }>;
//   footerInfo?: React.ReactNode;
//   _IconHtml?: string;
// }

export type WebsiteTemplate = React.FC<IconPageProps>;

const css = String.raw;
const IconPage: WebsiteTemplate = ({
  _title,
  version,
  meta = {},
  favicon,
  _type,
  _link,
  classNamePrefix = "icon",
  fontname = "iconfont",
  corners,
  logo,
  description,
  links = [],
  footerInfo,
  _IconHtml = "",
}) => {
  // 动态生成 CSS
  const dynamicStyles =
    css`
      * {
        margin: 0;
        padding: 0;
        list-style: none;
      }
      body {
        color: #696969;
        font: 12px/1.5 tahoma, arial, \5b8b\4f53, sans-serif;
      }
      a {
        color: #333;
        text-decoration: underline;
      }
      a:hover {
        color: rgb(9, 73, 209);
      }
      .header {
        color: #333;
        text-align: center;
        padding: 80px 0 60px 0;
        min-height: 153px;
        font-size: 14px;
      }
      .header .logo svg {
        height: 120px;
        width: 120px;
      }
      .header h1 {
        font-size: 42px;
        padding: 26px 0 10px 0;
      }
      .header sup {
        font-size: 14px;
        margin: 8px 0 0 8px;
        position: absolute;
        color: #7b7b7b;
      }
      .info {
        color: #999;
        font-weight: normal;
        max-width: 346px;
        margin: 0 auto;
        padding: 20px 0;
        font-size: 14px;
      }

      .icons {
        max-width: 1190px;
        margin: 0 auto;
      }
      .icons ul {
        text-align: center;
      }
      .icons ul li {
        vertical-align: top;
        width: 120px;
        display: inline-block;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.02);
        border-radius: 3px;
        padding: 29px 0 10px 0;
        margin-right: 10px;
        margin-top: 10px;
        transition: all 0.6s ease;
      }
      .icons ul li:hover {
        background-color: rgba(0, 0, 0, 0.06);
      }
      .icons ul li:hover span {
        color: #3c75e4;
        opacity: 1;
      }
      .icons ul li .unicode {
        color: #8c8c8c;
        opacity: 0.3;
      }
      .icons ul li h4 {
        font-weight: normal;
        padding: 10px 0 5px 0;
        display: block;
        color: #8c8c8c;
        font-size: 14px;
        line-height: 12px;
        opacity: 0.8;
      }
      .icons ul li:hover h4 {
        opacity: 1;
      }
      .icons ul li svg {
        width: 24px;
        height: 24px;
      }
      .icons ul li:hover {
        color: #3c75e4;
      }
      .footer {
        text-align: center;
        padding: 10px 0 90px 0;
      }
      .footer a {
        text-align: center;
        padding: 10px 0 90px 0;
        color: #696969;
      }
      .footer a:hover {
        color: #0949d1;
      }
      .links {
        text-align: center;
        padding: 50px 0 0 0;
        font-size: 14px;
      }
    ` +
    match(_type)
      .with(
        "font-class",
        () => css`
          .icons ul li.class-icon {
            font-size: 21px;
            line-height: 21px;
            padding-bottom: 20px;
          }
          .icons ul li.class-icon p {
            font-size: 12px;
          }
          .icons ul li.class-icon [class^="${classNamePrefix}-"] {
            font-size: 26px;
          }
        `
      )
      .with(
        "unicode",
        () => css`
          .icons ul .unicode-icon span {
            display: block;
          }
          .icons ul .unicode-icon h4 {
            font-size: 12px;
          }
          @font-face {
            font-family: "${fontname}";
            src: url(${fontname}.woff2) format("woff2"),
              url(${fontname}.svg#${fontname}) format("svg");
          }
          .iconfont {
            font-family: "${fontname}" !important;
            font-size: 26px;
            font-style: normal;
            -webkit-font-smoothing: antialiased;
            -webkit-text-stroke-width: 0.2px;
            -moz-osx-font-smoothing: grayscale;
          }
        `
      )
      .with(
        "symbol",
        () => css`
          .icons ul li.symbol {
            padding: 28px 10px 16px 10px;
            width: 100px;
          }
          .icons ul li.symbol svg {
            width: 34px;
            height: 34px;
          }
          .icons ul li.symbol h4 {
            font-size: 12px;
          }
        `
      )
      .otherwise(() => "") +
    match(corners)
      .with(
        { url: P.any },
        () => css`
          .github-corner:hover .octo-arm {
            animation: octocat-wave 560ms ease-in-out;
          }
          .github-corner svg {
            position: fixed;
            z-index: 999;
            border: 0px;
            top: 0px;
            right: 0px;
          }
          @keyframes octocat-wave {
            0%,
            100% {
              transform: rotate(0);
            }
            20%,
            60% {
              transform: rotate(-25deg);
            }
            40%,
            80% {
              transform: rotate(10deg);
            }
          }
          @media (max-width: 500px) {
            .github-corner:hover .octo-arm {
              animation: none;
            }
            .github-corner .octo-arm {
              animation: octocat-wave 560ms ease-in-out;
            }
          }
        `
      )
      .otherwise(() => "");

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>{_title}</title>
        <meta
          name="viewport"
          content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no"
        />
        {Object.entries(meta).map(([k, v]) => (
          <meta key={k} name={k} content={v} />
        ))}
        {favicon && <link rel="icon" type="image/x-icon" href={favicon} />}
        {_type === "font-class" && _link && (
          <link rel="stylesheet" href={_link} />
        )}
        <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
      </head>

      <body>
        {corners?.url && (
          <a href={corners.url} target="_blank" className="github-corner">
            <svg
              width={corners.width || 60}
              height={corners.height || corners.width || 60}
              viewBox="0 0 250 250"
              style={{
                fill: corners.bgColor || "#151513",
                color: "#fff",
                position: "fixed",
                top: 0,
                right: 0,
                border: 0,
                zIndex: 999,
              }}
            >
              {/* SVG paths here */}
            </svg>
          </a>
        )}

        <div className="header">
          {typeof logo === "string" ? (
            <div className="logo">
              <a href="./">{logo}</a>
            </div>
          ) : (
            logo
          )}

          <h1>
            {_title}
            {version && <sup>{version}</sup>}
          </h1>

          <div className="info">{description || meta.description}</div>

          <p>
            {links.map((linkItem, index) => (
              <React.Fragment key={linkItem.url}>
                <a href={linkItem.url}>{linkItem.title}</a>
                {index !== links.length - 1 && " · "}
              </React.Fragment>
            ))}
          </p>
        </div>

        <div className="icons">
          <ul dangerouslySetInnerHTML={{ __html: _IconHtml }} />
        </div>

        <p className="links">
          {links.map((linkItem, index) => (
            <React.Fragment key={linkItem.url}>
              <a href={linkItem.url}>{linkItem.title}</a>
              {index !== links.length - 1 && " · "}
            </React.Fragment>
          ))}
        </p>

        <div className="footer">
          {footerInfo}
          <div>
            <a target="_blank" href="https://github.com/gaubee/icon-bundler">
              Created By icon-bundler
            </a>
          </div>
        </div>
      </body>
    </html>
  );
};

export default IconPage;
