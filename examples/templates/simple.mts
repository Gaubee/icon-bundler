import path from "node:path";
import iconBundler from "../../src/index.ts";
import process from "node:process";

const rootPath = path.resolve(process.cwd(), "examples", "templates");

iconBundler({
  config: {
    cwd: rootPath,
  },
  src: path.resolve(rootPath, "svg"), // svg path
  dist: path.resolve(rootPath, "dist3"), // output path
  fontName: "icon-bundler", // font name
  css: true, // Create CSS files.
  startUnicode: 20000, // unicode start number
  emptyDist: true,
}).then(() => {
  console.log("done!!!!");
});
