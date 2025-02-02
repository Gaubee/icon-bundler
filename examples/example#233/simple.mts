import iconBundler from "../../src/index.ts";
import path from "node:path";
import process from "node:process";

iconBundler({
  src: path.resolve(process.cwd(), "svg"), // svg path
  dist: path.resolve(process.cwd(), "dist"), // output path
  fontName: "pst-font", // font name
  css: true, // Create CSS files.
})
  .then(() => {
    console.log("done!");
  })
  .catch((error) => {
    console.error("Error:", error);
  });
