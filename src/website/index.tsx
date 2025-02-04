// IconPage.tsx
import React from "react";
import type { SvgToFontOptions } from "../index.ts";
import { match, P } from "ts-pattern";
import fs from "node:fs";
import path from "node:path";
const tooltipCss = fs.readFileSync(
  path.join(import.meta.dirname, "tool-tip.css"),
  "utf-8",
);
const indexCss = fs.readFileSync(
  path.join(import.meta.dirname, "index.css"),
  "utf-8",
);

// 定义 Props 类型
export type IconPageProps = SvgToFontOptions["website"] & {
  fontname: string;
  classNamePrefix: string;
  _type: SvgToFontOptions["website"]["index"];
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
  const dynamicStyles = [
    tooltipCss,
    indexCss,
    match(_type)
      .with(
        "font-class",
        () => css`
          .icons ul li.class-icon {
            font-size: 48px;
            line-height: 1;
          }
        `,
      )
      .with(
        "unicode",
        () => css`
          .${classNamePrefix} {
            font-size: 48px;
            line-height: 1;
          }
        `,
      )
      .with(
        "symbol",
        () => css`
          .icons ul li.symbol svg {
            width: 48px;
            height: 48px;
          }
        `,
      )
      .exhaustive(),
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
        `,
      )
      .otherwise(() => ""),
  ];

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
        {(_type === "font-class" || _type === "unicode") && _link && (
          <link rel="stylesheet" href={_link} />
        )}
        <style dangerouslySetInnerHTML={{ __html: dynamicStyles.join("\n") }} />
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
          <div dangerouslySetInnerHTML={{ __html: footerInfo }}></div>
          <div>
            <a target="_blank" href="https://github.com/gaubee/icon-bundler">
              Created By icon-bundler
            </a>
          </div>
        </div>
      </body>
      <script>{bindCopyToolTipCode}</script>
    </html>
  );
};

const bindCopyToolTip = () => {
  const iconsEle = document.querySelector(".icons");
  iconsEle.addEventListener("click", (e) => {
    let ele = e.target;
    while (true) {
      if (!(ele instanceof Element) || ele === iconsEle) {
        return;
      }
      if (ele instanceof HTMLElement && "copy" in ele.dataset) {
        const copy = ele.dataset.copy;
        ele.removeAttribute("data-copy");
        const copyContent = copy || ele.outerHTML.trim();
        navigator.clipboard.writeText(copyContent);
        ele.setAttribute("data-copy", copy);
        console.log(copyContent);
        break;
      }
      ele = ele.parentElement;
    }
  });
};
let bindCopyToolTipCode = bindCopyToolTip.toString();
bindCopyToolTipCode = bindCopyToolTipCode
  .slice(bindCopyToolTipCode.indexOf("{") + 1, -1)
  .trim();

export default IconPage;
